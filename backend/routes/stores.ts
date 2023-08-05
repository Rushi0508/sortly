import express from 'express'
import { deleteStore, editStore, newStore } from '../controllers/stores';
import { userAuth } from '../middleware';

const router = express.Router();

router.route('/api/addStore')
    .post(userAuth,newStore)
router.route('/api/store/:storeId')
    .delete(deleteStore)
    .put(editStore)
export default router;