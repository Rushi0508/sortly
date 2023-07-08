import express from 'express'
import { register } from '../controllers/users';

const router = express.Router();

router.route('/api/register')
    .post(register);

export default router;