import express from 'express';
import { getAllCourses, addCourses, registerCourseFromFile, updateCourse } from '../controllers/courseController';
import multer from "multer";
import requireAuth from '../middleware/requireAuth';
import { addPerformanceLog, getAllPerformanceLogs, getAllPerformanceLogsByTA } from '../controllers/performanceLogController';

const upload = multer();

const router = express.Router();

// require authentication for all course routes
// router.use(requireAuth);

router.route("/").get(getAllPerformanceLogs);
router.route("/").post(addPerformanceLog);
router.route("/ta/:id").get(getAllPerformanceLogsByTA);


export default router;  