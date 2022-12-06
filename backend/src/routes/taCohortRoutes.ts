import express from 'express';
import { getCohortInfo, addCohortInfo, deleteCohortInfo } from '../controllers/taCohortController';

const router = express.Router();

router.route('/').get(getCohortInfo);
router.route('/add').post(addCohortInfo);
router.route('/delete').delete(deleteCohortInfo);

export default router;