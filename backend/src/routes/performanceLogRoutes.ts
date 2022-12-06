import express from 'express';
import { addPerformanceLog, deletePerformanceLog, getPerformanceLogs } from '../controllers/performanceLogController';

const router = express.Router();

router.route("/").get(getPerformanceLogs);
router.route("/add").post(addPerformanceLog);
router.route("/delete").delete(deletePerformanceLog);

export default router;