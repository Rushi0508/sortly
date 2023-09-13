import express, { Request, Response} from 'express'
import Item from '../models/item'
import Tag from '../models/tag'

export const fetchTags = async (req: Request, res: Response)=>{
    const storeId = req.body.storeId;    

    const tags = await Tag.find({storeId: storeId});
    
    res.json({tags: tags});
}

export const newTag = async (req:Request, res: Response) => {
    const {storeId, tagsArray} = req.body
    tagsArray.forEach((tag:any) => {
        const t = new Tag({
            name: tag,
            storeId: storeId
        });
        t.save();
    });
    res.json({status: true})
}