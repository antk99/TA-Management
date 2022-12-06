import { Request, Response } from 'express';
import asyncHandler from "express-async-handler";
import Course from '../models/Course';
import PerformanceLog from '../models/PerformanceLog';
import Professor from '../models/Professor';
import TA from '../models/TA';
import { capitalizeFirstLetter } from '../utils/stringFormatting';
import { getProfNameByEmail } from './profController';

// @Desc Get all performance logs for given TA
// @Route /api/performanceLog/:studentID
// @Method GET
export const getPerformanceLogs = asyncHandler(async (req: Request, res: Response) => {
    const studentID = req.params.studentID;

    try {
        const performanceLogs = await PerformanceLog.find({ taStudentID: studentID }) as any;
        if (performanceLogs.length === 0)
            throw new Error("No performance logs found for given TA.");

        const logs = [];
        for (const log of performanceLogs) {
            // get prof name & attach to log
            const profName = await getProfNameByEmail(log.profEmail);
            logs.push({ ...log._doc, profName });
        }

        res.status(200).json({ logs });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Get all performance logs for given TA for a given prof
// @Route /api/performanceLog/:profEmail/:studentID
// @Method GET
export const getPerformanceLogsByProf = asyncHandler(async (req: Request, res: Response) => {
    const profEmail = req.params.profEmail;
    const studentID = req.params.studentID;

    try {
        const performanceLogs = await PerformanceLog.find({ profEmail, taStudentID: studentID });
        if (performanceLogs.length === 0)
            throw new Error("No performance logs found for given prof for given TA.");
        res.status(200).json({ performanceLogs });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Adds a performance log for given TA
// @Route /api/performanceLog/add
// @Method POST
export const addPerformanceLog = asyncHandler(async (req: Request, res: Response) => {
    let { profEmail, taStudentID, courseNumber, term, comment } = req.body;

    try {
        if (!profEmail || !taStudentID || !courseNumber || !term || !comment)
            throw new Error("Missing at least one of required fields: profEmail, taStudentID, courseNumber, term, comment.");

        term = capitalizeFirstLetter(term);
        courseNumber = courseNumber.toUpperCase();

        const professorExists = await Professor.findOne({ profEmail });
        if (!professorExists)
            throw new Error("Professor not found in the database. Add professor and continue.");

        const taExists = await TA.findOne({ studentID: taStudentID });
        if (!taExists)
            throw new Error("TA not found in the database. Add TA and continue.");

        const courseExists = await Course.findOne({ courseNumber });
        if (!courseExists)
            throw new Error("Course not found in the database. Add course and continue.");

        if (comment.length > 1000)
            throw new Error("Comment must be less than 1000 characters.");

        const performanceLog = await PerformanceLog.create({ profEmail, taStudentID, courseNumber, term, comment });
        res.status(200).json({ performanceLog });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Deletes a performance log
// @Route /api/performanceLog/delete/:performanceLogID
// @Method DELETE
export const deletePerformanceLog = asyncHandler(async (req: Request, res: Response) => {
    const performanceLogID = req.params.performanceLogID;

    try {
        const performanceLog = await PerformanceLog.findByIdAndDelete({ _id: performanceLogID });
        if (!performanceLog)
            throw new Error("Performance log not found in the database.");
        res.status(200).json({ "message": "Performance log deleted successfully." });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});