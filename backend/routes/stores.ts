import express from 'express'
import { deleteStore, editStore, newStore, fetchStore, fetchStores } from '../controllers/stores';
import { userAuth } from '../middleware';

const router = express.Router();

router.route('/api/addStore')
    .post(userAuth,newStore)
router.route('/api/store/:storeId')
    .delete(deleteStore)
    .put(editStore)
router.route('/api/fetchStore')
    .post(fetchStore)
router.route('/api/fetchStores')
    .post(fetchStores)
export default router;