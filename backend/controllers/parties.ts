import express, { Request, Response, NextFunction } from 'express'
import { Date } from 'mongoose'
import Party from '../models/party'

export const createParty = async(req:Request, res: Response, next: NextFunction)=>{
    try{
        const party = new Party(req.body);
        party.createdAt = new Date();
        party.save();
        res.json({status: true})
    }catch(e){
        res.json({status: false,errors: e})
    }
}

export const fetchParties = async(req:Request, res: Response, next: NextFunction)=>{
    const {type,storeId,sort,searchParty} = req.body;
    let parties;
    if(searchParty.length>0){        
        const search = req.body.searchParty;
        const regex = new RegExp(search, 'i');
        
        parties = await Party.find({storeId: storeId, name: { $regex: regex }});
    }  
    else if(type==="" || type==="All"){
        if(sort==="Recent"){
            parties = await Party.find({storeId: storeId}).sort({createdAt: -1})
        }
        else if(sort === "Oldest"){
            parties = await Party.find({storeId: storeId}).sort({createdAt: 1})
        }
    }
    else{
        if(sort==="Recent"){
            parties = await Party.find({storeId: storeId,type:type}).sort({createdAt: -1})
        }
        else if(sort === "Oldest"){
            parties = await Party.find({storeId: storeId,type:type}).sort({createdAt: 1})
        }
    }
    res.json({parties: parties});
}

export const fetchParty = async(req:Request, res: Response, next: NextFunction)=>{
    const id = req.query.id;
    const party = await Party.findById(id);
    res.json({party: party});
}