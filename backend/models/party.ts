import mongoose from 'mongoose'

interface Party{
    storeId?: string
    name: string,
    contact: string,
    email: string
    type: string,
    createdAt?: Date
}

const partySchema = new mongoose.Schema<Party>({
    storeId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    contact: {
        type: String,
        required: [true, "Contact is required"]
    },
    email: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: [true, "Type is required(Buyer or Supplier)"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Party = mongoose.model('Party', partySchema);
export default Party;