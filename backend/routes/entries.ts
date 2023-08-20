import express from 'express'
import {createEntry, fetchEntries, fetchPartyEntries} from '../controllers/entries'

const router = express.Router();

router.route('/api/createEntry')
    .post(createEntry)
router.route('/api/fetchEntries')
    .post(fetchEntries)
router.route('/api/fetchPartyEntries')
    .post(fetchPartyEntries)

export default router;