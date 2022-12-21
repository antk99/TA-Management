import express from 'express';
import { getAllCourses, addCourse, registerCourseFromFile, deleteCourse, updateCourse, getCourseByInstructor, getCourseByTA, getTAsByCourse, getAllCourseNumbers } from '../controllers/courseController';
import multer from "multer";
import requireAuth from '../middleware/requireAuth';

const upload = multer();
const router = express.Router();

// these routes do not require authentication
router.get("/courseNumbers", getAllCourseNumbers);

// these routes require authentication
router.get("/", requireAuth, getAllCourses);
router.get("/instructor/:instructorUuid", requireAuth, getCourseByInstructor);
router.get("/ta/:taUuid", requireAuth, getCourseByTA);
router.get("/allTas/:courseUuid", requireAuth, getTAsByCourse);
router.post("/add", requireAuth, addCourse);
router.delete("/delete", requireAuth, deleteCourse);
router.put("/edit/:id", requireAuth, updateCourse);
router.post("/upload", requireAuth, upload.single("csvFile"), registerCourseFromFile);

export default router;  