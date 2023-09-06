import {Request, Response ,NextFunction } from "express";
import jwt from 'jsonwebtoken'
import User from "./models/user";


export const userAuth = async (req: Request, res: Response, next: NextFunction)=>{
    try{
        const userAuthToken = req.headers.authorization;
        if(userAuthToken){
            jwt.verify(userAuthToken , process.env.JWT_SECRET!, async(err, decodedToken)=>{
                if(err){
                    return res.status(401)
                }
                // @ts-ignore: decodedToken is possibly 'undefined'.
                const userId = decodedToken.user.id 
                const user = await User.findById(userId);
                if(!user){
                    return res.status(401)
                }
                else{
                    return next(); 
                }
            })
        }
        else{
            return res.status(401)
        }
    }catch(error: any){
        res.json({errors: error, status: false});
    }
}