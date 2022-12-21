import express from 'express';
import multer from "multer";
import { addCourseQuotaFromFile, getAllCourseQuotas, updateCourseQuota } from '../controllers/courseQuotaController';

const upload = multer();
const router = express.Router();

router.route("/").get(getAllCourseQuotas);
router.route("/upload").post(upload.single("csvFile"), addCourseQuotaFromFile);
router.route("/edit/:id").patch(updateCourseQuota);

export default router;