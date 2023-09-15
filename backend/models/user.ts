import mongoose from "mongoose";
import Store from "./store";

interface User{
    name: string,
    email: string,
    password: string,
    verified?: boolean,
    stores?: Array<Store>,
    lastActive?: string,
    plan?: string,
    planCreatedAt?: Date,
    planExpiresAt?: Date,
    avatar?: string,
    createdAt?: Date,
    updatedAt?: Date
}

const userSchema = new mongoose.Schema<User>({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email:{
        type: String,
        required: [true, "Email is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    verified:{
        type: Boolean
    },
    stores: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store"
        }
    ],
    lastActive: {
        type: String,
        default: ""
    },
    plan: {
        type: String,
        enum: ['FREE', 'SUPER', 'PREMIUM'],
        default: 'FREE'
    },
    planCreatedAt: {
        type: Date,
        default: Date.now()
    },
    planExpiresAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt:{
        type: Date,
        default: Date.now()
    }
})

const User =  mongoose.model("User", userSchema);
export default User;