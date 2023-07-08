import User from '../models/user'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

export const register = async (req: Request,res: Response,next: NextFunction)=>{
    try{
        const {name, email, password} = req.body;
        const salt = 10;
        const secPass = await bcrypt.hash(password, salt);
        const user = new User({
            name: name,
            password: secPass,
            email: email
        });
        await user.save();
        // send mail confirmation


        // jwt auth
        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, process.env.JWT_SECRET!);
        res.status(201).json({user: user._id, userToken: authToken, created: true});
    }catch(errors: any){
        res.json({errors: errors, created: false})
    }
}
