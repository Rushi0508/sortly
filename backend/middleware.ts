import {Request, Response ,NextFunction } from "express";
import jwt from 'jsonwebtoken'
import User from "./models/user";


export const userAuth = async (req: Request, res: Response, next: NextFunction)=>{
    try{
        const userAuthToken = req.headers.authorization;
        if(userAuthToken){
            jwt.verify(userAuthToken , process.env.JWT_SECRET!, async(err, decodedToken)=>{
                if(err){
                    res.json({loginRequired: true});
                }
                // @ts-ignore: decodedToken is possibly 'undefined'.
                const userId = decodedToken.user.id 
                const user = await User.findById(userId);
                if(!user){
                    res.json({loginRequired: true});
                }
                else{
                    next();
                }
            })
        }
        else{
            res.json({loginRequired: true});
        }
    }catch(error: any){
        res.json({errors: error, status: false});
    }
}