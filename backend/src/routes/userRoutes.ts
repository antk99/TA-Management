import express from 'express';
import { register, login, getAllUsers, getUserByID, registerUsersFromFile } from '../controllers/userController';
import multer from "multer";
import requireAuth from '../middleware/requireAuth';

const upload = multer();
const router = express.Router();

// these routes do not require authentication
router.route("/register").post(register);
router.route("/login").post(login);

router.use(requireAuth);

// these routes require authentication
router.route("/:id").get(getUserByID);
router.route("/").get(getAllUsers);
router.route("/upload").post(upload.single("csvFile"), registerUsersFromFile);

export default router;