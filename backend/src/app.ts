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
require('dotenv').config();

const app = express();

if (!process.env.PORT)
    console.log("PORT not set in env file, using default port 3000");

const port = process.env.PORT || 3000;

// Basic express setup
app.use(cors());
app.use(express.json());
connectDB();

// Logging middleware
app.use((req: Request, res: Response, next: any) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.use("/api/users", userRoutes);

// Authentication middleware
app.use(requireAuth);

// Application routes
// TODO: for all route controllers, only provide info for the current user passed in request.body.user
// e.g. if user._id = 1, only allow user 1 to access their own info & not other users' info even if authenticated
app.use("/api/prof", profRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/ta", taRoutes);
app.use("/api/rating", ratingRoutes);
app.use("/api/performanceLog", performanceLogRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cohort", taCohortRoutes);
app.use("/api/courseQuota", courseQuotaRoutes);

// Start the server
app.listen(port, () => {
    console.log('Backend is running on port: ' + port)
})

