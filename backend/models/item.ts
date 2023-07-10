import mongoose from 'mongoose'
import Tag from './tag'

interface Item{
    storeId?: string,
    name: string,
    quantity: Number,
    costPrice: Number,
    sellPrice: Number,
    tags?: Array<Tag>,
    createdAt?: string,
    updatedAt?: string
}

const itemSchema = new mongoose.Schema<Item>({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    },
    name: {
        type: String,
        required: [true, "Item name is required"]
    },
    quantity: {
        type: Number,
        required: [true, "Item quantity is required"]
    },
    costPrice: {
        type: Number,
        required: [true, "Cost Price is required"]
    },
    sellPrice: {
        type: Number,
        required: [true, "Sell Price is required"]
    },
    tags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tag"
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})

const Item = mongoose.model("Item", itemSchema);
export default Item;