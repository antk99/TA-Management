import express from 'express';
import { getAllUsers, getUserByID, registerUsersFromFile, getUserByEmail, deleteUser, register, login, addStudent } from '../controllers/userController';
import multer from "multer";
import requireAuth from '../middleware/requireAuth';

const upload = multer();
const router = express.Router();

// these routes do not require authentication
router.post("/register", register);
router.post("/login", login);
router.post("/add-student", addStudent);

// these routes require authentication
router.get("/", requireAuth, getAllUsers);
router.get("/:id", requireAuth, getUserByID);
router.get("/email/:email", requireAuth, getUserByEmail);
router.post("/upload", requireAuth, upload.single("csvFile"), registerUsersFromFile);
router.delete("/delete/:email", requireAuth, deleteUser);

export default router;