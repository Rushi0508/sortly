import express from 'express'
import { deleteItem, editItem, newItem, fetchItems} from '../controllers/items';
import { userAuth } from '../middleware';

const router = express.Router();

router.route('/api/addItem')
    .post(userAuth,newItem)
router.route('/api/deleteItem')
    .post(userAuth,deleteItem)
router.route('/api/editItem')
    .put(userAuth,editItem)
router.route('/api/fetchItems')
    .post(userAuth,fetchItems);

export default router;