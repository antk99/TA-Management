import express from 'express';
import multer from "multer";
import { addWishlist, deleteWishlist, getWishlist } from '../controllers/wishlistController';

const router = express.Router();

// require authentication for all course routes
// router.use(requireAuth);

router.route("/").get(getWishlist);
router.route("/add").post(addWishlist);
router.route("/delete").delete(deleteWishlist);

export default router;