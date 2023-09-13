import express from 'express';
import {stripeCheckout} from '../controllers/stripe'

const router = express.Router();

router.route('/create-checkout-session')
    .post(stripeCheckout);

export default router