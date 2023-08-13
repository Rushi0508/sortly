import express from 'express'
import { newTag,fetchTags } from '../controllers/tags';

const router = express.Router();

router.route('/api/addTag')
    .post(newTag)
router.route('/api/fetchTags')
    .post(fetchTags);


export default router;