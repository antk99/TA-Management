import express from 'express';
import multer from "multer";
import { addCourseQuotaFromFile, getAllCourseQuotas } from '../controllers/courseQuotaController';

const upload = multer();
const router = express.Router();

router.route("/").get(getAllCourseQuotas);
router.route("/upload").post(upload.single("csvFile"), addCourseQuotaFromFile);

export default router;