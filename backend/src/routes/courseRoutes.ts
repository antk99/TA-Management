import express from 'express';
import { getAllCourses, addCourse, registerCourseFromFile, deleteCourse } from '../controllers/courseController';
import multer from "multer";

const upload = multer();
const router = express.Router();

router.route("/").get(getAllCourses);
router.route("/add").post(addCourse);
router.route("/delete").delete(deleteCourse);
router.route("/upload").post(upload.single("csvFile"), registerCourseFromFile);

export default router;