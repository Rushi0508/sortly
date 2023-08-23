import express from 'express'

const router = express.Router();

import { sendInvoice } from '../controllers/invoice';

router.route('/api/sendinvoice')
    .post(sendInvoice)

export default router