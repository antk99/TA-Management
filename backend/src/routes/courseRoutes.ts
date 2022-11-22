import express from 'express';
import { getAllCourses, addCourses, registerCourseFromFile } from '../controllers/courseController';
import multer from "multer";
import requireAuth from '../middleware/requireAuth';

const upload = multer();

const router = express.Router();

// require authentication for all course routes
// router.use(requireAuth);

router.route("/").get(getAllCourses);
router.route("/add").post(addCourses);
router.route("/upload").post(upload.single("csvFile"), registerCourseFromFile);

export default router;