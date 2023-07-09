import express from 'express'
import { deleteStore, editStore, newStore } from '../controllers/stores';

const router = express.Router();

router.route('/api/new/:userId')
    .post(newStore)
router.route('/api/store/:storeId')
    .delete(deleteStore)
    .put(editStore)
export default router;