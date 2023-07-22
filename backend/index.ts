import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cors from 'cors'
import userRoutes from './routes/users'
import storeRoutes from './routes/stores'
import itemRoutes from './routes/items'

const app = express()
dotenv.config();
app.use(cors());

// Connecting Database
mongoose.set('strictQuery', false);
const dbURL ="mongodb://localhost:27017/hyperDB";

mongoose.connect(dbURL).then(()=>{
    console.log("Mongo Connected");
}).catch((err: any)=>{
    console.log("OH error");
    console.log(err);
})

// Routes setup
app.use(express.json());
app.use(userRoutes);
app.use(storeRoutes);
app.use(itemRoutes)

// Server Setup
const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log(`Server connected and running on ${port}`);
})