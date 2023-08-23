import express from 'express'
import mongoose from 'mongoose';
import path from 'path'
import dotenv from 'dotenv'
import cors from 'cors'
import fs from 'fs'
import nodemailer from 'nodemailer'
import userRoutes from './routes/users'
import storeRoutes from './routes/stores'
import itemRoutes from './routes/items'
import tagRoutes from './routes/tags'
import entryRoutes from './routes/entries'
import partyRoutes from './routes/parties'
import stripeRoutes from './routes/stripe'
import invoiceRoutes from './routes/invoice'

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

// ejs setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));

// Routes setup
app.use(express.json());
app.use(userRoutes);
app.use(storeRoutes);
app.use(itemRoutes)
app.use(tagRoutes)
app.use(entryRoutes)
app.use(partyRoutes)
app.use(stripeRoutes)
app.use(invoiceRoutes)


// Server Setup
const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log(`Server connected and running on ${port}`);
})