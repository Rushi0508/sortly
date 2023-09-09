import express from 'express'
import { deleteStore, editStore, newStore, fetchStore, fetchStores } from '../controllers/stores';
import { userAuth } from '../middleware';

const router = express.Router();

router.route('/api/addStore')
    .post(userAuth,newStore)
router.route('/api/store/:storeId')
    .delete(userAuth,deleteStore)
    .put(userAuth,editStore)
router.route('/api/fetchStore')
    .post(userAuth,fetchStore)
router.route('/api/fetchStores')
    .post(userAuth,fetchStores)
export default router;