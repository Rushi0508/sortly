import Stripe from 'stripe';
import {Request, Response} from 'express'
import dotenv from 'dotenv'

dotenv.config()
const stripe = new Stripe(process.env.STRIPE_KEY!, {
    apiVersion: '2022-11-15',
});

export const stripeCheckout = async (req: Request,res: Response)=>{   
    console.log(req.body);
     
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: req.body.plan,
                    },
                    unit_amount: req.body.price * 100,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: 'http://localhost:5173/checkout',
        cancel_url: 'http://localhost:5173/checkout-cancel'
    });
    res.json({url: session.url})
}