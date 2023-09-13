import express from 'express'
import {createParty, fetchParties, fetchParty} from '../controllers/parties';
import { userAuth } from '../middleware';

const router = express.Router();

router.route('/api/createParty')
    .post(userAuth,createParty);
router.route('/api/fetchParties')
    .post(userAuth,fetchParties);
router.route('/api/fetchParty')
    .get(userAuth,fetchParty);

export default router