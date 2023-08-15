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
        const { storeId,name, quantity, costPrice,unit, sellPrice, tags} = req.body;
        const itemId = req.body._id;
        // console.log(tags);
        
        // Find items that don't have tags in the provided array
        const itemsWithoutMatchingTags = await Item.find({
            tags: { $nin: tags }
        });
        // Now, you can extract the unique tags from these items
        const removedTags = [...new Set(itemsWithoutMatchingTags.flatMap(item => item.tags))];
        // console.log(removedTags);
        
        // Add latest Tags to Items aray
        const item = await Item.findByIdAndUpdate(itemId, { $set: { tags: [] }});
        await Item.findByIdAndUpdate(itemId, {$addToSet: {tags: tags}})

        // Remove Item Id from removed tags
        await Tag.updateMany({_id: {$in: removedTags}}, {$pull: {items: itemId}});

        // Add item to newly added tags.
        await Tag.updateMany({_id: {$in: tags}}, {$addToSet: {items: itemId}})

        //Update other details
        await Item.findByIdAndUpdate(itemId, {name: name, quantity: quantity,unit: unit, costPrice: costPrice, sellPrice: sellPrice, updatedAt: Date.now()})
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