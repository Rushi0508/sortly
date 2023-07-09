import mongoose from "mongoose";

interface Entry{
    
}

const entrySchema = new mongoose.Schema({

})

const Entry = mongoose.model('Entry', entrySchema);
export default Entry;

