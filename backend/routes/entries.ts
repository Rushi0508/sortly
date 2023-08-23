import express from 'express'
import {createEntry, fetchEntries, fetchPartyEntries, getDashboardData} from '../controllers/entries'

const router = express.Router();

router.route('/api/createEntry')
    .post(createEntry)
router.route('/api/fetchEntries')
    .post(fetchEntries)
router.route('/api/fetchPartyEntries')
    .post(fetchPartyEntries)
router.route('/api/details/dashboard')
    .post(getDashboardData)
export default router;