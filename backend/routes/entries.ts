import express from 'express'
import {createEntry, fetchEntries, fetchPartyEntries, getDashboardData, updateEntry} from '../controllers/entries'
import { userAuth } from '../middleware';

const router = express.Router();

router.route('/api/createEntry')
    .post(userAuth,createEntry)
router.route('/api/updateEntry')
    .post(userAuth,updateEntry)
router.route('/api/fetchEntries')
    .post(userAuth,fetchEntries)
router.route('/api/fetchPartyEntries')
    .post(userAuth,fetchPartyEntries)
router.route('/api/details/dashboard')
    .post(userAuth, getDashboardData)
export default router;