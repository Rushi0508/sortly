import express from 'express'
import {createParty, fetchParties, fetchParty} from '../controllers/parties';

const router = express.Router();

router.route('/api/createParty')
    .post(createParty);
router.route('/api/fetchParties')
    .post(fetchParties);
router.route('/api/fetchParty')
    .get(fetchParty);

export default router