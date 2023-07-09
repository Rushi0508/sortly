import mongoose from "mongoose";


interface Store{
    userId?: string,
    name: string,
    email: string,
    address: string,
    phone: BigInt,
    items?: Array<string>,
    entries?: Array<string>,
    createdAt?: string
}

const storeSchema = new mongoose.Schema<Store>({
    userId: {
        type: String,
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email:{
        type: String,
        required: [true, "Email is required"]
    },
    address: {
        type: String,
        required: [true, "Address is required"],
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
    }
});

  
const Store = mongoose.model("Store", storeSchema);
export default Store;