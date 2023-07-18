import mongoose from "mongoose";
import Item from './item'

interface Entry{
    buyer?: string,
    supplier?: string,
    quantity: Number,
    costPrice: Number,
    sellPrice: Number,
    items: Array<Item>
    profit?: Number,
    type?: string
}

const entrySchema = new mongoose.Schema<Entry>({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Party'
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Party'
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"]
    },
    costPrice: {
        type: Number,
        required: true
    },
    sellPrice: {
        type: Number,
        required: true
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
    }
})

const Entry = mongoose.model('Entry', entrySchema);
export default Entry;

