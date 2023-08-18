import express, { Request, Response, NextFunction } from 'express'
import { Date } from 'mongoose'
import Store from '../models/store'
import Item from '../models/item'
import Entry from '../models/entry'

export const createEntry = async(req:Request, res: Response, next: NextFunction)=>{
    try{
       const entry = new Entry(req.body)
       await entry.save();
       const store = await Store.findByIdAndUpdate(req.body.storeId, {$push: {entries: entry}});
       let stockItem = req.body.item[0];
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
        res.json({status: false, errors: error});
    }
}