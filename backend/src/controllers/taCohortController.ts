import { parse } from 'csv-string';
import { Request, Response } from 'express';
import asyncHandler from "express-async-handler";
import TA from '../models/TA';
import TACohort from '../models/TACohort';
import User from '../models/User';

// @Desc Get all cohort info for given TA
// @Route /api/cohort/:studentID
// @Method GET
export const getCohortInfo = asyncHandler(async (req: Request, res: Response) => {
    const studentID = req.params.studentID;
    try {
        const cohortInfo = await TACohort.findOne({ studentID });
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
    const { studentID, phone, legalName, level, supervisorName, isPriority, hours, dateApplied, location, degree, coursesAppliedFor, termYear, openToOtherCourses, notes } = req.body;

    try {
        if (!studentID || !phone || !legalName || !level || !supervisorName || !isPriority || !hours || !dateApplied || !location || !degree || !coursesAppliedFor || !termYear || !openToOtherCourses || !notes)
            throw new Error("Missing required field(s).");

        const taExists = await TA.findOne({ studentID });
        if (!taExists)
            throw new Error("No TA found with given studentID.");

        const exists = await TACohort.findOne({ studentID });
        if (exists)
            throw new Error("Cohort info already exists for this TA. Delete it and try again.");

        // TODO: IMPORTANT validate fields 

        const cohortInfo = await TACohort.create({
            studentID, phone, legalName, level, supervisorName, isPriority, hours, dateApplied, location, degree,
            coursesAppliedFor: coursesAppliedFor.map((course: string) => course.toUpperCase()), termYear, openToOtherCourses, notes
        });
        res.status(200).json({ cohortInfo });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }

});

// @Desc Delete cohort info for given TA
// @Route /api/cohort/delete/:studentID
// @Method DELETE
export const deleteCohortInfo = asyncHandler(async (req: Request, res: Response) => {
    const studentID = req.params.studentID;

    try {
        const cohortInfo = await TACohort.findOneAndDelete({ studentID });
        if (!cohortInfo)
            throw new Error("No cohort info found.");

        res.status(200).json({ "message": "Cohort info deleted." });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Save multiple ta cohort info from csv file
// @Route /api/cohort/upload
// @Method POST
export const registerTAFromFile = asyncHandler(async (req: Request, res: Response) => {
    const csv = req.file;

    if (csv) {
        const fileContent = parse(csv.buffer.toString('utf-8'));
        for (let record of fileContent) {
            console.log(record)
            const taInfo = {
                name: record[1],
                email: record[4],
            }
            const cohortInfo = {
                termYear: record[0],
                studentID: record[2],
                legalName: record[3],
                level: record[5],
                supervisorName: record[6],
                isPriority: record[7],
                hours: record[8],
                dateApplied: record[9],
                location: record[10],
                phone: record[11],
                degree: record[12],
                coursesAppliedFor: record[13].split('/'),
                openToOtherCourses: record[14],
                notes: record[15]
            };
            let ta = await TA.findOne({ studentID: cohortInfo.studentID });

            // create new ta if not exists, assumes ta User already exists
            if (!ta)
                ta = await TA.create({ email: taInfo.email, name: taInfo.name, studentID: cohortInfo.studentID, currCourses: [], prevCourses: [] });

            // check if ta has cohort data already
            let cohort = await TACohort.findOne({ studentID: cohortInfo.studentID });
            if (cohort)
                await cohort.delete();

            // create new cohort data
            cohort = await TACohort.create(cohortInfo);
        }
    } else {
        res.status(500);
        throw new Error("File upload unsuccessful.");
    }
    res.status(200).json({ "message": "TA cohort info uploaded successfully." });
});