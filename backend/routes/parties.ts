import express from 'express'
import {createParty, fetchParties} from '../controllers/parties';

const router = express.Router();

router.route('/api/createParty')
    .post(createParty);
router.route('/api/fetchParties')
    .post(fetchParties);

export default router