import {Request, Response ,NextFunction } from "express";
import jwt from 'jsonwebtoken'
import User from "./models/user";


export const userAuth = async (req: Request, res: Response, next: NextFunction)=>{
    try{
        const {userAuthToken} = req.body;
        if(userAuthToken){
            jwt.verify(userAuthToken , process.env.JWT_SECRET!, async(err, decodedToken)=>{
                if(err){
                    res.json({status: false});
                }
                const userId = decodedToken.user.id;
                const user = await User.findById({userId});
                if(!user){
                    res.json({status: false});
                }
                else{
                    next();
                }
            })
        }
        else{
            res.json({status: false});
        }
    }catch(error: any){
        res.json({errors: error, status: false});
    }
}