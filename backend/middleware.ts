import {Request, Response ,NextFunction } from "express";
import jwt from 'jsonwebtoken'
import User from "./models/user";


export const userAuth = async (req: Request, res: Response, next: NextFunction)=>{
    try{
        const userAuthToken = req.headers.authorization;
        if(userAuthToken){
            jwt.verify(userAuthToken , process.env.JWT_SECRET!, async(err, decodedToken)=>{
                if(err){
                    console.log("Token Error "+req.method + " " + req.url);
                    return res.json({login: false})
                }
                // @ts-ignore: decodedToken is possibly 'undefined'.
                const userId = decodedToken.user.id 
                const user = await User.findById(userId);
                if(!user){
                    console.log("No User "+req.method + " " + req.url);
                    return res.json({login: false})
                }
                else{
                    console.log("Authenticated "+req.method + " " + req.url);
                    next(); 
                }
            })
        }
        else{
            console.log("No Token "+req.method + " " + req.url);
            return res.json({login: false})
        }
    }catch(error: any){
        return res.json({login: false})
    }
}