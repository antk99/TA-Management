import express from 'express';
import { getRatings, addRating, deleteRating, getRatingsByCourseStudentAndTA } from '../controllers/ratingController';

const router = express.Router();

router.route("/:taStudentID").get(getRatings);
router.route("/studTaCourseRating").post(getRatingsByCourseStudentAndTA);
router.route("/add").post(addRating);
router.route("/delete/:ratingID").delete(deleteRating);


export default router;