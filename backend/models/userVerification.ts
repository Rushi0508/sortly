import mongoose from "mongoose";

interface UserVerfication{
    userId: string,
    otp: string,
    createdAt?: string,
    expiresAt?: string,
}

const userVerificationSchema = new mongoose.Schema<UserVerfication>({
    userId: String,
    otp: String,
    createdAt: {
        type: Date,
        default: Date.now() 
    },
    expiresAt: {
        type: Date
    }
})

const UserVerfication =  mongoose.model("UserVerification", userVerificationSchema);
export default UserVerfication;