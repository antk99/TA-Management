import cors from 'cors';
import express, { Request, Response } from 'express';
import connectDB from "./config/db.config";
import userRoutes from './routes/userRoutes';
import profRoutes from './routes/profRoutes';
import courseRoutes from './routes/courseRoutes';
import taRoutes from './routes/taRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import ratingRoutes from './routes/ratingRoutes';
import studentRoutes from './routes/studentRoutes';
import performanceLogRoutes from './routes/performanceLogRoutes';
import taCohortRoutes from './routes/taCohortRoutes';
import requireAuth from './middleware/requireAuth';
import courseQuotaRoutes from './routes/courseQuotaRoutes';
import standardizeURL from './middleware/standardizeURL';
require('dotenv').config();

const app = express();

if (!process.env.PORT)
    console.log("PORT not set in env file, using default port 3000");

const port = process.env.PORT || 3000;

// In production, the /api prefix is removed from client requests, so the server does not need to add it
// in development, the /api prefix is not removed from client requests, so the server needs to add it
const urlPrefix = process.env.PRODUCTION ? "" : "/api";

// Basic express setup
app.use(cors());
app.use(express.json());
connectDB();

app.use(standardizeURL);

// Logging middleware
app.use((req: Request, res: Response, next: any) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Some routes do not require authentication
app.use(urlPrefix + "/users", userRoutes);

app.use(requireAuth);

// Application routes that require authentication
// TODO: for all route controllers, only provide info for the current user passed in request.body.user
// e.g. if user._id = 1, only allow user 1 to access their own info & not other users' info even if authenticated
app.use(urlPrefix + "/prof", profRoutes);
app.use(urlPrefix + "/course", courseRoutes);
app.use(urlPrefix + "/student", studentRoutes);
app.use(urlPrefix + "/ta", taRoutes);
app.use(urlPrefix + "/rating", ratingRoutes);
app.use(urlPrefix + "/performanceLog", performanceLogRoutes);
app.use(urlPrefix + "/wishlist", wishlistRoutes);
app.use(urlPrefix + "/cohort", taCohortRoutes);
app.use(urlPrefix + "/courseQuota", courseQuotaRoutes);

// Start the server
app.listen(port, () => {
    console.log(`${process.env.PRODUCTION ? "Production" : "Development"} backend server running on port ${port}`);
})

