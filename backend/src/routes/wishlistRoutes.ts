import express from 'express';
import multer from "multer";
import { addWishList, deleteWishList, getWishListByProfessor } from '../controllers/wishListController';

const upload = multer();

const router = express.Router();

// require authentication for all course routes
// router.use(requireAuth);

router.route("/").get(getWishListByProfessor);
router.route("/").post(addWishList);
router.route("/").delete(deleteWishList);

export default router;  