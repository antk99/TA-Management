import express from 'express';
<<<<<<< HEAD
import { getAllCourses, addCourses, registerCourseFromFile, updateCourse } from '../controllers/courseController';
=======
import { getAllCourses, addCourse, registerCourseFromFile, deleteCourse } from '../controllers/courseController';
>>>>>>> origin/api+controllers
import multer from "multer";

const upload = multer();
const router = express.Router();

router.route("/").get(getAllCourses);
<<<<<<< HEAD
router.route("/:id").put(updateCourse);
router.route("/add").post(addCourses);
=======
router.route("/add").post(addCourse);
router.route("/delete").delete(deleteCourse);
>>>>>>> origin/api+controllers
router.route("/upload").post(upload.single("csvFile"), registerCourseFromFile);

export default router;  