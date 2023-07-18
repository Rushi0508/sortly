import mongoose from 'mongoose'

interface Party{
    name: string,
    contact: string,
    type: string
}

const partySchema = new mongoose.Schema<Party>({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    contact: {
        type: String,
        required: [true, "Contact is required"]
    },
    type: {
        type: String,
        required: [true, "Type is required(Buyer or Supplier)"]
    }
})