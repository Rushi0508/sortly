import express from 'express'
import { deleteItem, editItem, newItem, fetchItems} from '../controllers/items';

const router = express.Router();

router.route('/api/addItem')
    .post(newItem)
router.route('/api/deleteItem')
    .post(deleteItem)
router.route('/api/editItem')
    .put(editItem)
router.route('/api/fetchItems')
    .post(fetchItems);

export default router;