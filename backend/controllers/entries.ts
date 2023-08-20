import express, { Request, Response, NextFunction } from 'express'
import { Date } from 'mongoose'
import Store from '../models/store'
import Item from '../models/item'
import Entry from '../models/entry'
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