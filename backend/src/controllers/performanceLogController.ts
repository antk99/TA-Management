import { Request, Response } from 'express';
import asyncHandler from "express-async-handler";
import Course from '../models/Course';
import PerformanceLog from '../models/PerformanceLog';
import Professor from '../models/Professor';
import TA from '../models/TA';
import User from '../models/User';
import objectIdFromString from '../utils/objectIdFromString';
import { capitalizeFirstLetter } from '../utils/stringFormatting';

// @Desc Get all performance logs for given TA
// @Route /api/performanceLog
// @Method GET
export const getPerformanceLogs = asyncHandler(async (req: Request, res: Response) => {
    const { taStudentID } = req.body;

    try {
        if (!taStudentID)
            throw new Error("Missing required field: taStudentID.");

        const taID = await TA.findOne({ studentID: taStudentID }).select("_id");
        if (!taID)
            throw new Error("TA not found. Add TA and continue.");

        const performanceLogs = await PerformanceLog.find({ ta: taID });
        res.status(200).json({ performanceLogs });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Adds a performance log for given TA
// @Route /api/performanceLog/add
// @Method POST
export const addPerformanceLog = asyncHandler(async (req: Request, res: Response) => {
    const { professorEmail, taStudentID, courseNumber, term, comment } = req.body;

    try {
        if (!professorEmail || !taStudentID || !courseNumber || !term || !comment)
            throw new Error("Missing at least one of required fields: professorEmail, taStudentID, courseNumber, term, comment.");

        const professorUserID = await User.findOne({ email: professorEmail }).select("_id");
        if (!professorUserID)
            throw new Error(`No user with email: ${professorEmail} found. Add user and continue.`);

        const professorID = await Professor.findOne({ professor: professorUserID }).select("_id");
        if (!professorID)
            throw new Error(`No professor with email: ${professorEmail} found. Add professor and continue.`);

        const taID = await TA.findOne({ studentID: taStudentID }).select("_id");
        if (!taID)
            throw new Error("TA not found in the database. Add TA and continue.");

        const courseID = await Course.findOne({ courseNumber: courseNumber.toUpperCase() }).select("_id");
        if (!courseID)
            throw new Error("Course not found in the database. Add course and continue.");

        if (comment.length > 1000)
            throw new Error("Comment must be less than 1000 characters.");

        const performanceLog = await PerformanceLog.create({ professor: professorUserID, ta: taID, course: courseID, term: capitalizeFirstLetter(term), comment });
        res.status(200).json({ performanceLog });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Deletes a performance log
// @Route /api/performanceLog/delete
// @Method DELETE
export const deletePerformanceLog = asyncHandler(async (req: Request, res: Response) => {
    const { performanceLogID } = req.body;

    try {
        if (!performanceLogID)
            throw new Error("Missing required field: performanceLogID.");

        const performanceLog = await PerformanceLog.findByIdAndDelete(objectIdFromString(performanceLogID));
        if (!performanceLog)
            throw new Error("Performance log not found in the database.");
        res.status(200).json({ "message": "Performance log deleted successfully." });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});