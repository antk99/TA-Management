import express from 'express';
import { getAllProfs, addProf, registerProfFromFile, deleteProf } from '../controllers/profController';
import multer from "multer";

const upload = multer();
const router = express.Router();

router.route("/").get(getAllProfs);
router.route("/add").post(addProf);
router.route("/upload").post(upload.single("csvFile"), registerProfFromFile);
router.route("/delete/:email").delete(deleteProf);

export default router;