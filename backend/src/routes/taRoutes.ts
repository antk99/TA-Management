import express from 'express';
import { getAllTAs, addTA, addTACurrCourse, removeTACurrCourse } from '../controllers/taController';

const router = express.Router();

router.route("/").get(getAllTAs);
router.route("/add").post(addTA);
router.route("/addCurrCourse").post(addTACurrCourse);
router.route("/removeCurrCourse").delete(removeTACurrCourse);

export default router;