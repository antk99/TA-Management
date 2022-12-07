import express from 'express';
import multer from "multer";
import { getAllTAs, addTA, registerTAFromFile, addTACurrCourse, removeTACurrCourse } from '../controllers/taController';

const upload = multer();
const router = express.Router();

router.route("/").get(getAllTAs);
router.route("/add").post(addTA);
router.route("/addCurrCourse").post(addTACurrCourse);
router.route("/removeCurrCourse").delete(removeTACurrCourse);
router.route("/upload").post(upload.single("csvFile"), registerTAFromFile);

export default router;