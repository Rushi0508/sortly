import mongoose from "mongoose";
import Item from "./item";
import Entry from "./entry";


interface Store{
    userId?: string,
    name: string,
    email: string,
    city: string,
    phone: BigInt,
    items?: Array<Item>,
    entries?: Array<Entry>,
    createdAt?: string,
    updatedAt?: string,
}

const storeSchema = new mongoose.Schema<Store>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email:{
        type: String,
        required: [true, "Email is required"]
    },
    city: {
        type: String,
        required: [true, "City is required"],
    },
    phone: {
        type: String,
        required: [true, "Contact is required"]
    },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }
    ],
    entries: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Entry'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

  
const Store = mongoose.model("Store", storeSchema);
export default Store;