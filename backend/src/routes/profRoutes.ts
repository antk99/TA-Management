import express from 'express';
import { getAllProfs, addProfs, registerProfFromFile} from '../controllers/profController';
import multer from "multer";
import requireAuth from '../middleware/requireAuth';

const upload = multer();
const router = express.Router();

// require authentication for all course routes
// router.use(requireAuth);

router.route("/").get(getAllProfs);
router.route("/add").post(addProfs);
router.route("/upload").post(upload.single("csvFile"), registerProfFromFile);

export default router;