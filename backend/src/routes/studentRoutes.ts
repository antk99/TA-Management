import express from 'express';
import { addStudent, getStudent, deleteStudent, addCourses, removeCourses } from '../controllers/studentController';

const router = express.Router();

router.route("/").get(getStudent);
router.route("/add").post(addStudent);
router.route("/delete").delete(deleteStudent);
router.route("/addCourses").patch(addCourses);
router.route("/removeCourses").patch(removeCourses);

export default router;