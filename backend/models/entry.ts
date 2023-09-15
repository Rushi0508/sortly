import mongoose from "mongoose";
import Item from './item'

interface Entry{
    storeId?: string,
    entryId: string,
    buyer?: string,
    supplier?: string,
    quantity: Array<Number>,
    costPrice: Array<Number>,
    sellPrice: Array<Number>,
    costValue?: Number,
    sellValue?: Number,
    items: Array<Item>
    profit?: Number,
    type?: string,
    createdAt?: Date,
    paymentStatus?: string,
    amountPaid?: Number,
    payDate?: Date
}

const entrySchema = new mongoose.Schema<Entry>({
    storeId: {
        type: String,
        required: true
    },
    entryId: {
        type: String,
        required: true,
        default: "0"
    },
    buyer: {
        type: String
    },
    supplier: {
        type: String
    },
    quantity: [
        {
            type: Number,
            required: [true, "Quantity is required"]
        }
    ],
    costPrice: [
        {
            type: Number,
            required: true
        }
    ],
    sellPrice: [
        {
            type: Number,
            required: true
        }
    ],
    costValue: {
        type: Number
    },
    sellValue: {
        type: Number
    },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }
    ],
    profit: {
        type: Number,
    },
    type: {
        type: String,
        required: [true, "A type is required(Buy or Sell)"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'DEPOSIT'],
        required: true,
    },
    amountPaid: {
        type: Number,
        default: 0
    },
    payDate: {
        type: Date,
        default: Date.now()
    }
})

const Entry = mongoose.model('Entry', entrySchema);
export default Entry;

