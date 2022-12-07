import express from 'express';
import { addWishlist, deleteWishlist, getProfWishlist, getTAWishlist } from '../controllers/wishListController';

const router = express.Router();

router.route("/:profEmail").get(getProfWishlist);
router.route("/ta/:studentID").get(getTAWishlist);
router.route("/add").post(addWishlist);
router.route("/delete/:wishlistID").delete(deleteWishlist);

export default router;