import mongoose from "mongoose";

interface Tag{
    name?: string,
    itemId?: string,
    createdAt?: string
}

const tagSchema = new mongoose.Schema<Tag>({
    name: {
        type: String
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
})

const Tag = mongoose.model("Tag", tagSchema);
export default Tag;