import mongoose from "mongoose";

interface User{
    name: string,
    email: string,
    password: string,
    verified?: boolean,
    stores?: Array<string>,
    avatar?: string,
    createdAt?: string,
    updatedAt?: string
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