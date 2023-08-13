import express from 'express'
import { deleteItem, editItem, newItem, fetchItems} from '../controllers/items';

const router = express.Router();

router.route('/api/addItem')
    .post(newItem)
router.route('/api/item/:itemId')
    .delete(deleteItem)
    .put(editItem)
router.route('/api/fetchItems')
    .post(fetchItems);

export default router;