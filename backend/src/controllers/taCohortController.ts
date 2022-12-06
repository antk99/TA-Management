import { Request, Response } from 'express';
import asyncHandler from "express-async-handler";
import TA from '../models/TA';
import TACohort from '../models/TACohort';

// @Desc Get all cohort info for given TA
// @Route /api/cohort
// @Method GET
export const getCohortInfo = asyncHandler(async (req: Request, res: Response) => {
    const { taStudentID } = req.body;

    try {
        if (!taStudentID)
            throw new Error("Missing required field: taStudentID.");

        const taID = await TA.findOne({ studentID: taStudentID }).select("_id");
        if (!taID)
            throw new Error("TA not found. Add TA and continue.");

        const cohortInfo = await TACohort.find({ ta: taID });
        if (!cohortInfo)
            throw new Error("No cohort info found.");
        res.status(200).json({ cohortInfo });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }

});

// @Desc Add cohort info for given TA
// @Route /api/cohort/add
// @Method POST
export const addCohortInfo = asyncHandler(async (req: Request, res: Response) => {
    const { taStudentID, phone, legalName, level, supervisorName, isPriority, hours, dateApplied, location, degree, coursesAppliedFor, openToOtherCourses, notes } = req.body;

    try {
        if (!taStudentID || !phone || !legalName || !level || !supervisorName || !isPriority || !hours || !dateApplied || !location || !degree || !coursesAppliedFor || !openToOtherCourses || !notes)
            throw new Error("Missing required field(s).");

        const taID = await TA.findOne({ studentID: taStudentID }).select("_id");
        if (!taID)
            throw new Error("TA not found. Add TA and continue.");

        const exists = await TACohort.findOne({ ta: taID });
        if (exists)
            throw new Error("Cohort info already exists for this TA. Delete it and try again.");

        // TODO: IMPORTANT validate fields 

        const cohortInfo = await TACohort.create({
            ta: taID, phone, legalName, level, supervisorName, isPriority, hours, dateApplied, location, degree,
            coursesAppliedFor: coursesAppliedFor.map((course: string) => course.toUpperCase()), openToOtherCourses, notes
        });
        res.status(200).json({ cohortInfo });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }

});

// @Desc Delete cohort info for given TA
// @Route /api/cohort/delete
// @Method DELETE
export const deleteCohortInfo = asyncHandler(async (req: Request, res: Response) => {
    const { taStudentID } = req.body;

    try {
        if (!taStudentID)
            throw new Error("Missing required field: taStudentID.");

        const taID = await TA.findOne({ studentID: taStudentID }).select("_id");
        if (!taID)
            throw new Error("TA not found. Add TA and continue.");

        const cohortInfo = await TACohort.findOneAndDelete({ ta: taID });
        if (!cohortInfo)
            throw new Error("No cohort info found.");

        res.status(200).json({ "message": "Cohort info deleted." });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});