import { registerTAFromFile } from './../controllers/taCohortController';
import express from 'express';
import { getCohortInfo, addCohortInfo, deleteCohortInfo } from '../controllers/taCohortController';
import multer from "multer";

const upload = multer();
const router = express.Router();

router.route('/:studentID').get(getCohortInfo);
router.route('/add').post(addCohortInfo);
router.route('/upload').post(upload.single("csvFile"), registerTAFromFile);
router.route('/delete/:studentID').delete(deleteCohortInfo);

export default router;