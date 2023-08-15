import express, { Request, Response, NextFunction } from 'express'
import { Date } from 'mongoose'
import Store from '../models/store'
import Item from '../models/item'
import Tag from '../models/tag'

export const newItem = async(req:Request, res: Response, next: NextFunction)=>{
    try{
       const {storeId, name,unit, quantity, costPrice, sellPrice, tags} = req.body;
       const store = await Store.findById(storeId);
       if(!store){
            throw new Error("Store not found");
       }
       if(!name || !quantity || !costPrice || !sellPrice){
            throw new Error("Enter all details");
       }
       const item = new Item({
            storeId: store._id,
            name: name,
            quantity: quantity,
            unit: unit,
            sellPrice: sellPrice,
            costPrice: costPrice,
            tags: tags
        })
        tags.forEach(async(tagId: any) => {
            await Tag.findByIdAndUpdate(tagId, {$push: {items: item.id}});
        });
        store.items?.push(item.id);
        await item.save();
        await store.save();
        res.json({success: true});
    }catch(error: any){
        res.json({success: false, errors: error.message});
    }
}

export const deleteItem = async(req: Request, res: Response)=>{
    try{
        const item = req.body.deleteItem;
        const itemId = item._id;

        await Store.findByIdAndUpdate(item?.storeId, {$pull: {items: itemId}});
        await Tag.updateMany({storeId: item?.storeId}, {$pull: {items: itemId}})
        await Item.findByIdAndDelete(itemId);
        
        res.json({status: true});
    }
    catch(error: any){
        res.json({status: false, errors: error});
    }
}

export const editItem = async(req: Request, res: Response)=>{
    try{
        const { name, quantity, costPrice,unit, sellPrice, tags, rmtags} = req.body;
        const itemId = req.params.itemId;
        // const item = await Item.findByIdAndUpdate(itemId, { "$set": { "tags": [] }});
        const item = await Item.findById(itemId)
        if(!item){
            throw new Error("Item not found");
        }
        await Item.findByIdAndUpdate(itemId, {$pullAll: {tags: rmtags}})
        await Tag.updateMany({storeId: item?.storeId}, {$pull: {items: itemId}})
        tags.forEach((e: any) => {
            const tag = new Tag({name: e, storeId: item.storeId});
            tag.items?.push(item.id)
            tag.save();
            item?.tags?.push(tag);
        });
        await Item.findByIdAndUpdate(itemId, {name: name, quantity: quantity,unit: unit, costPrice: costPrice, sellPrice: sellPrice, updatedAt: Date.now()})
        await item.save();
        res.json({status: true});
    }
    catch(error: any){
        res.json({status: false, errors: error.message});
    }
}

export const fetchItems = async (req: Request, res: Response)=>{
    const {filterTags,storeId,sort,search} = req.body;
    let items;
    if(search.length>0){        
        const search = req.body.search;
        const regex = new RegExp(search, 'i');
        
        items = await Item.find({storeId: storeId, name: { $regex: regex }}).populate({path: 'tags',select: '_id name'});
    }  
    else if(filterTags.length===0){
        if(sort==="Recent"){
            items = await Item.find({storeId: storeId}).sort({createdAt: -1}).populate({path: 'tags',select: '_id name'});
        }
        else if(sort === "Oldest"){
            items = await Item.find({storeId: storeId}).sort({createdAt: 1}).populate({path: 'tags',select: '_id name'});
        }
    }
    else{
        if(sort==="Recent"){
            items = await Item.find({storeId: storeId,tags:{$in: filterTags}}).sort({createdAt: -1}).populate({path: 'tags',select: '_id name'});
        }
        else if(sort === "Oldest"){
            items = await Item.find({storeId: storeId,tags:{$in: filterTags}}).sort({createdAt: 1}).populate({path: 'tags',select: '_id name'});
        }
    }
    res.json({items: items});
}