import express from 'express'
import { login, register, verifyOTP, fetchUser, updatePlan, changeStoreStatus } from '../controllers/users';

const router = express.Router();

router.route('/api/register')
    .post(register);
router.route('/api/verifyOTP')
    .post(verifyOTP)
router.route('/api/login')
    .post(login);
router.route('/api/fetchUser')
    .post(fetchUser);
router.route('/api/updateplan')
    .get(updatePlan);
router.route('/api/activestore')
    .get(changeStoreStatus);
export default router;