import express, { Request, Response, NextFunction } from 'express'
import { Date } from 'mongoose'
import Store from '../models/store'
import Item from '../models/item'
import Entry from '../models/entry'
import Party from '../models/party'
import {utcToZonedTime} from 'date-fns-tz'
import {parseISO} from 'date-fns'

function formatNumberWithLeadingZeros(number:any, length:any) {
    return String(number).padStart(length, '0');
}

export const createEntry = async(req:Request, res: Response, next: NextFunction)=>{
    try{
        const e = await Entry.findOne({type: "Sell"}, {}).sort({createdAt: -1});
        const entry = new Entry(req.body)
        if(req.body.type==="Sell"){
            if(e){
                const formattedNumber = formatNumberWithLeadingZeros(parseInt(e.invoiceId)+1, 3);
                entry.invoiceId = formattedNumber;
            }else{
                entry.invoiceId = "001";
            }
        }
       entry.createdAt = Date.now()
       await entry.save();
       const store = await Store.findByIdAndUpdate(req.body.storeId, {$push: {entries: entry}});
       let stockItem = req.body.items[0];
       if(req.body.type==='Buy'){
            let newQunatity = parseInt(stockItem.quantity) + parseInt(req.body.quantity);
            let newCostPrice = ((stockItem.quantity * stockItem.costPrice) + (req.body.quantity * req.body.costPrice))/newQunatity;
            await Item.findByIdAndUpdate(stockItem._id, {costPrice: newCostPrice, quantity: newQunatity });
       }else{
            let newQunatity = stockItem.quantity - req.body.quantity;
            await Item.findByIdAndUpdate(stockItem._id, {quantity: newQunatity });
       }
       res.json({status: true})
    }catch(error: any){
        console.log(error);
        
        res.json({status: false, errors: error});
    }
}

export const fetchEntries = async(req:Request, res: Response, next: NextFunction)=>{
    try{
        const {storeId, search,sort,date,type} = req.body;
        let entries;
        // search term
        if(search.length>0){        
            const search = req.body.search;
            const regex = new RegExp(search, 'i');
            
            entries = await Entry.find({storeId: storeId,type: type, invoiceId: { $regex: regex }}).populate({path: 'items',select: '_id name'});
        }
        // date terms
        else if(date.hasOwnProperty('from')){
            // having both from and to.
            const receivedUtcDate_from = new Date(date.from);
            const timeDifference = 5.5 * 60 * 60 * 1000;
            const from = new Date(receivedUtcDate_from.getTime() + timeDifference);

            if(date.hasOwnProperty('to')){
                const receivedUtcDate_to = new Date(date.to);
                const to = new Date(receivedUtcDate_to.getTime() + timeDifference);
                to.setUTCHours(23, 59, 59, 999);
                
                if(sort==='Recent'){
                    entries = await Entry.find({storeId: storeId,type: type, createdAt: {$gte: from, $lte: to}}).sort({createdAt: -1}).populate({path: 'items',select: '_id name'})
                }else{
                    entries = await Entry.find({storeId: storeId,type: type, createdAt: {$gte: from, $lte: to}}).sort({createdAt: 1}).populate({path: 'items',select: '_id name'})
                }
            }
            // Only From
            else{
                if(sort==='Recent'){
                    entries = await Entry.find({storeId: storeId,type: type, createdAt: {$gte: from}}).sort({createdAt: -1}).populate({path: 'items',select: '_id name'})
                }else{
                    entries = await Entry.find({storeId: storeId,type: type, createdAt: {$gte: from}}).sort({createdAt: 1}).populate({path: 'items',select: '_id name'})
                }
            }
        }
        // sort
        else{
            if(sort==='Recent'){
                entries = await Entry.find({storeId: storeId,type: type}).sort({createdAt: -1}).populate({path: 'items',select: '_id name'})
            }else{
                entries = await Entry.find({storeId: storeId,type: type}).sort({createdAt: 1}).populate({path: 'items',select: '_id name'})
            }
        }
        res.json({status: true, entries: entries});
    }catch(e){
        res.json({status: false, errors: e})
    }
}

export const fetchPartyEntries = async(req:Request, res: Response, next: NextFunction)=>{
    try{
        const {partyId,type} = req.body;
        let entries;
        if(type==="Buyer"){
            entries = await Entry.find({buyer: partyId}).populate({path: 'items', select: "_id name"})
        }else{
            entries = await Entry.find({supplier: partyId}).populate({path: 'items', select: "_id name"})
        }
        res.json({status: true, entries: entries});
    }catch(e){
        res.json({status: false, errors: e});
    }
}

export const getDashboardData = async(req:Request, res: Response, next: NextFunction)=>{
    const storeId = req.body.storeId; // Replace with the actual storeId value
    const type = "Sell"; // Replace with the actual type value
    
    if(storeId){
        // Sales Data

        // Current Month Sales
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const currentMonthSalesCountResult = await Entry.aggregate([
            {
              $match: {
                storeId,
                type,
                createdAt: {
                  $gt: new Date(currentYear, currentMonth, 1), // Start of current month
                  $lte: new Date(currentYear, currentMonth+1, 1) // Start of next month
                }
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 }
              }
            }
        ]);
        const currentMonthSalesCount = currentMonthSalesCountResult[0]?.count || 0;
        // Previous Month Sales        
        const previousMonthSalesCountResult = await Entry.aggregate([
            {
              $match: {
                storeId,
                type,
                createdAt: {
                  $gt: new Date(currentYear, currentMonth-1, 1), // Start of current month
                  $lte: new Date(currentYear, currentMonth, 1) // Start of next month
                }
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 }
              }
            }
        ]);
        const previousMonthSalesCount = previousMonthSalesCountResult[0]?.count || 0;
        
        const salesChange = previousMonthSalesCount===0? 100:((currentMonthSalesCount-previousMonthSalesCount)/previousMonthSalesCount)*100;

        // Parties Data

        // current month parties
        const currentMonthPartyCountResult = await Party.aggregate([
            {
              $match: {
                storeId,
                createdAt: {
                  $gt: new Date(currentYear, currentMonth, 1), // Start of current month
                  $lte: new Date(currentYear, currentMonth+1, 1) // Start of next month
                }
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 }
              }
            }
        ]);
        const currentMonthPartyCount = currentMonthPartyCountResult[0]?.count || 0;
        // Previous Month Sales        
        const previousMonthPartyCountResult = await Entry.aggregate([
            {
              $match: {
                storeId,
                createdAt: {
                  $gt: new Date(currentYear, currentMonth-1, 1), // Start of current month
                  $lte: new Date(currentYear, currentMonth, 1) // Start of next month
                }
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 }
              }
            }
        ]);
        const previousMonthPartyCount = previousMonthPartyCountResult[0]?.count || 0;
        
        const partyChange = previousMonthPartyCount===0? 100:((currentMonthPartyCount-previousMonthPartyCount)/previousMonthPartyCount)*100;

        // Total Profit and Revenue
        const totalData = await Entry.aggregate([
            {
              $match: {
                storeId,
                type
              }
            },
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: '$sellValue' },
                totalProfit: { $sum: '$profit' },
                salesCount: { $sum: 1}
              }
            }
        ])

        const partyResults = await Party.aggregate([
            {
                $match: {
                    storeId
                }
            },{
                $group: {
                    _id: null,
                    count: { $sum: 1}
                }
            }
        ]);

        const totalRevenue = totalData[0]?.totalRevenue || 0;
        const totalProfit = totalData[0]?.totalProfit || 0;
        const salesCount = totalData[0]?.salesCount || 0;
        const mSalesCount = currentMonthSalesCount;
        const partiesCount = partyResults[0]?.count || 0;

        const cardData = {
            totalProfit,totalRevenue,mSalesCount,partiesCount,salesCount
        }

        // Query for revenue and profit for each month
         const results = await Entry.aggregate([
            {
                $match: {
                storeId,
                type
                }
            },
            {
                $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                totalRevenue: { $sum: '$sellValue' },
                totalProfit: { $sum: '$profit' }
                }
            },
            {
                $sort: {
                '_id.year': 1,
                '_id.month': 1
                }
            }
        ]);
    
        // Create an array to hold monthly data
        const monthlyData = new Array(12).fill({ totalRevenue: 0, totalProfit: 0 });
        
        
        // // Fill in the aggregated data into the monthlyData array
        results.forEach(result => {
            const { _id, totalRevenue, totalProfit } = result;
            const month = _id.month;
            monthlyData[month - 1] = { totalRevenue, totalProfit };
        });

        // Previous month compare %

        const previousMonthRevenue = monthlyData[currentMonth-1].totalRevenue;
        const previousMonthProfit = monthlyData[currentMonth-1].totalProfit;
        const currentMonthRevenue = monthlyData[currentMonth].totalRevenue;
        const currentMonthProfit = monthlyData[currentMonth].totalProfit;
        const revenueChange= previousMonthRevenue===0?100: ((currentMonthRevenue-previousMonthRevenue)/(previousMonthRevenue))*100
        const profitChange= previousMonthRevenue===0? 100: ((currentMonthProfit-previousMonthProfit)/(previousMonthRevenue))*100
        const perChange = {
            revenueChange,profitChange,salesChange,partyChange
        }

        // Recent Sales
        const recentSales = await Entry.find({storeId: storeId, type: "Sell"}).sort({createdAt: -1}).limit(4);

        res.json({status: true,perChange: perChange,cardData: cardData, monthlyData: monthlyData,recentSales: recentSales})
    }else{
        res.json({errors: "No Store Id"})
    }
}