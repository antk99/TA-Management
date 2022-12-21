import express from 'express';
import { addStudent, getStudent, deleteStudent, addCourses, removeCourses, getStudentCourses, getStudentByID } from '../controllers/studentController';

const router = express.Router();

router.route("/").get(getStudent);
router.route("/courses/:id").get(getStudentCourses);
router.route("/:id").get(getStudentByID);
router.route("/add").post(addStudent);
router.route("/delete").delete(deleteStudent);
router.route("/addCourses").patch(addCourses);
router.route("/removeCourses").patch(removeCourses);

export default router;