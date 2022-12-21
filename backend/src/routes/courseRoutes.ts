import express from 'express';
import { getAllCourses, addCourse, registerCourseFromFile, deleteCourse, updateCourse, getCourseByInstructor, getCourseByTA, getTAsByCourse, addCourseTA } from '../controllers/courseController';
import multer from "multer";

const upload = multer();
const router = express.Router();

router.route("/").get(getAllCourses);
router.route("/instructor/:instructorUuid").get(getCourseByInstructor);
router.route("/ta/:taUuid").get(getCourseByTA);
router.route("/allTas/:courseUuid").get(getTAsByCourse);
router.route("/addTAs").patch(addCourseTA);
router.route("/add").post(addCourse);
router.route("/delete").delete(deleteCourse);
router.route("/edit/:id").put(updateCourse);
router.route("/upload").post(upload.single("csvFile"), registerCourseFromFile);

export default router;  