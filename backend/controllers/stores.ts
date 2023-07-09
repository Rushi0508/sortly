import User from '../models/user'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import express, { Request, Response, NextFunction } from 'express'
import nodemailer from 'nodemailer'
import { Date } from 'mongoose'
import Store from '../models/store'

export const newStore = async(req:Request, res: Response, next: NextFunction)=>{
    try{
        const userId = req.params.userId;
        const {name, email, address, phone } = req.body;
        const user = await User.findById({_id: userId});
        if(!user){
            throw new Error("User not found");
        }
        if(user.plan=== 'FREE' && user.stores?.length === 1){
            throw new Error("Free Plan can create only one store");
        }else{
            const store = new Store({
                userId: userId,
                name: name,
                email: email,
                address: address,
                phone: phone
            })
            user.stores?.push(store);
            await store.save()
            await user.save();
            // send mail
            sendStoreMail(store, user, res);
        }
    }catch(error: any){
        res.json({status: false, errors: error.message })
    }
}

export const deleteStore = async(req: Request, res: Response)=>{
    try{
        const storeId = req.params.storeId;
        const store = await Store.findById({_id: storeId});
        if(!store){
            throw new Error("Store not found");
        }
        await User.findByIdAndUpdate(store?.userId, {$pull: {stores: storeId}});
        await Store.findByIdAndDelete({_id: storeId});
        res.json({status: true});
    }
    catch(error: any){
        res.json({status: false, errors: error});
    }
}

export const editStore = async(req: Request, res: Response)=>{
    try{
        const storeId = req.params.storeId;
        const store = await Store.findByIdAndUpdate(storeId, {...req.body});
        if(!store){
            throw new Error("Store not found");
        }
        res.json({status: true});
    }
    catch(error: any){
        res.json({status: false, errors: error});
    }
}

const sendStoreMail = async (store: any, user: any, res: any)=>{
    try{
        // mail configrations
        let config = {
            service: "gmail",
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PASS
            }
        }

        let transporter = nodemailer.createTransport(config);
        const mailoptions = {
            from: "Sortly",
            to: store.email,
            subject: "Store Created",
            html: `
                <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                    <div style="margin:2px auto;width:90%;padding:0px 0">
                    <div style="border-bottom:1px solid #eee">
                        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Sortly</a>
                    </div>
                    <p style="font-size:1.2em">Hello, <i><b>${user.name}</b></i></p>
                    <p style="font-size: 1.3em"><i>Congrats your store <b>${store.name}</b> has been created.<i></p>
                    <p style="letter-spacing: 1.3px;font-size: 1.2em"><i>Grow your store by adding stock and items.<i></p>
                    <p style="font-size:1.1em;">Regards,<br />Sortly</p>
                    <hr style="border:none;border-top:1px solid #eee" />
                    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                        <p>Sortly Inc</p>
                        <p>India</p>
                    </div>
                    </div>
                </div>
            `
        }
        await transporter.sendMail(mailoptions);
        res.json({
            status: true,
            message: "Mail sent successfully",
            data: {
                store
            }
        })
    }
    catch(error: any){
        res.json({ status: false, message: error.message });
    }
}