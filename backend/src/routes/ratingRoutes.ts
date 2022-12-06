import express from 'express';
import { getRatings, addRating, deleteRating } from '../controllers/ratingController';

const router = express.Router();

router.route("/").get(getRatings);
router.route("/add").post(addRating);
router.route("/delete").delete(deleteRating);


export default router;