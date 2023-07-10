import express from 'express'
import { deleteItem, editItem, newItem } from '../controllers/items';

const router = express.Router();

router.route('/api/addItem')
    .post(newItem)
router.route('/api/item/:itemId')
    .delete(deleteItem)
    .put(editItem)

export default router;