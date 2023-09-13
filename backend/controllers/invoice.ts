import { createpdf } from './pdf_render';
import express, { Request, Response } from 'express'
import nodemailer from 'nodemailer'
import Party from '../models/party'
import User from '../models/user'
import mongoose from 'mongoose';
import {format} from 'date-fns'

export const sendInvoice = async (req: Request, res: Response) => {

    try {

        const {entry,store} = req.body;

        const party = await Party.findById(entry.buyer);
        const user = await User.findById(store.userId);

        const partyDetails = {
            name: party?.name,
            email: party?.email,
            contact: party?.contact
        }

        const storeDetails = {
            name: store.name,
            email: store.email,
            contact: store.phone,
            person: user?.name
        }

        const date = new Date(entry.createdAt);
        const formattedDate = format(date, "LLL dd, y");
        entry.date = formattedDate;
        

        const pdfBuffer = await createpdf(partyDetails, storeDetails, entry);
        // fs.writeFileSync('output.pdf', pdfBuffer);
        // res.send('PDF generated and saved as output.pdf');

        const transporter = await nodemailer.createTransport({
            service: 'gmail', // e.g., 'Gmail'
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PASS
            },
        });

        // Define email options
        const mailOptions = {
            from: '"Sortly" sortly@gmail.com',
            to: partyDetails.email,
            subject: `Invoice - ${formattedDate}`,
            html: `<p>Thank you <i>${partyDetails.name}<i> for shopping with <b>${storeDetails.name}.</b></p>
                    <p> Please find the attached invoice for your orders</p>
                    `,
            attachments: [
                {
                    filename: `Invoice-${formattedDate}.pdf`,
                    content: pdfBuffer as Buffer,
                },
            ],
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.json({status: true});
    }catch(e){
        console.log(e);
        
        res.json({status: false, errors: e});
    }

}