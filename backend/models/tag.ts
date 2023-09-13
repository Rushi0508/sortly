import mongoose from "mongoose";
import Item from "./item";

interface Tag{
    name?: string,
    storeId?: string,
    items?: Array<Item>,
    createdAt?: string
}

const tagSchema = new mongoose.Schema<Tag>({
    name: {
        type: String
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
    }
})

const Tag = mongoose.model("Tag", tagSchema);
export default Tag;