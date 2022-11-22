import cors from 'cors';
import express, { Request, Response } from 'express';
import connectDB from "./config/db.config";
import userRoutes from './routes/userRoutes';
import profRoutes from './routes/profRoutes';
import courseRoutes from './routes/courseRoutes';

const app = express();
const port = 3000;

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
app.use("/api/prof", profRoutes);
app.use("/api/course", courseRoutes);


app.listen(port, () => {
    console.log('Backend is running on port: ' + port)
})

