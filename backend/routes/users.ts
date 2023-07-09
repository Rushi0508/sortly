import express from 'express'
import { login, register, verifyOTP } from '../controllers/users';

const router = express.Router();

router.route('/api/register')
    .post(register);
router.route('/api/register/verifyOTP')
    .post(verifyOTP)
router.route('/api/login')
    .post(login);
export default router;