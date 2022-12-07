import express from 'express';
import { addPerformanceLog, deletePerformanceLog, getPerformanceLogs, getPerformanceLogsByProf } from '../controllers/performanceLogController';

const router = express.Router();

router.route("/:studentID").get(getPerformanceLogs);
router.route("/:profEmail/:studentID").get(getPerformanceLogsByProf);
router.route("/add").post(addPerformanceLog);
router.route("/delete/:performanceLogID").delete(deletePerformanceLog);

export default router;
