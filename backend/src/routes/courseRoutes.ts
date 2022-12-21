import express from 'express';
import { getAllCourses, addCourse, registerCourseFromFile, deleteCourse, updateCourse, getCourseByInstructor, getCourseByTA, editCourseDetails } from '../controllers/courseController';
import multer from "multer";
import requireAuth from '../middleware/requireAuth';

const upload = multer();
const router = express.Router();

router.route("/").get(getAllCourses);
router.route("/instructor/:instructorUuid").get(getCourseByInstructor);
router.route("/ta/:taUuid").get(getCourseByTA);
router.route("/add").post(addCourse);
router.route("/delete").delete(deleteCourse);
router.route("/edit/:id").put(updateCourse);
router.route("/upload").post(upload.single("csvFile"), registerCourseFromFile);
router.patch("/editDetails/:courseID", requireAuth, editCourseDetails);

export default router;  