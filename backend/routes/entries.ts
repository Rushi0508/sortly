import express from 'express'
import {createEntry} from '../controllers/entries'

const router = express.Router();

router.route('/api/createEntry')
    .post(createEntry)

export default router;