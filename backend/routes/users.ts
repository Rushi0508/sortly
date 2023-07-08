import express from 'express'
import { register, verifyOTP } from '../controllers/users';

const router = express.Router();

router.route('/api/register')
    .post(register);
router.route('/api/register/verifyOTP')
    .post(verifyOTP)

export default router;