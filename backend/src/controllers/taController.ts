import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Professor from "../models/Professor";
import Course from "../models/Course";
import User from "../models/User";
import { parse } from 'csv-string';
import TA from "../models/TA";

// @Desc Get all TAs
// @Route /api/ta
// @Method GET
export const getAllTAs = asyncHandler(async (req: Request, res: Response) => {
    const TAs = await TA.find({});
    res.status(200).json({ TAs });
});

// @Desc Add TA
// @Route /api/ta/add
// @Method POST
export const addTA = asyncHandler(async (req: Request, res: Response) => {
    const { taEmail, studentID, currCourses, prevCourses } = req.body;

    try {
        if (!taEmail || !studentID || !currCourses || !prevCourses)
            throw new Error("Missing at least one of required fields: taEmail, studentID, currCourses, prevCourses.");

        const taUserID = await User.findOne({ email: taEmail }).select("_id");
        if (!taUserID)
            throw new Error(`No user with email ${taEmail} found in the database! Add user and continue.`);

        const exists = await TA.findOne({ "$or": [{ studentID }, { ta: taUserID }] });
        if (exists)
            throw new Error(`TA with either email: ${taEmail} or studentID: ${studentID} already exists in the database!`);

        const ta = new TA({
            ta: taUserID,
            studentID,
            currCourses,
            prevCourses,
        });
        await ta.save();
        res.status(201).json({
            id: ta._id,
            studentID: ta.studentID,
            currCourses: ta.currCourses,
            prevCourses: ta.prevCourses
        });

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Add currCourse to TA
// @Route /api/ta/addCurrCourse
// @Method POST
export const addTACurrCourse = asyncHandler(async (req: Request, res: Response) => {
    const { taStudentID, courseNumber } = req.body;

    try {

        if (!taStudentID || !courseNumber)
            throw new Error("Missing at least one of required fields: taStudentID, courseNumber.");

        // push courseNumber to currCourses array if it doesn't already exist
        const update = await TA.updateOne({ studentID: taStudentID }, { $addToSet: { currCourses: courseNumber.toUpperCase() } });
        if (update.matchedCount === 0)
            throw new Error(`No TA found with studentID ${taStudentID} in the database!`);

        res.status(200).json({ "message": `Successfully added course ${courseNumber} to TA with studentID ${taStudentID}!` });

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Remove currCourse from TA
// @Route /api/ta/removeCurrCourse
// @Method DELETE
export const removeTACurrCourse = asyncHandler(async (req: Request, res: Response) => {
    const { taStudentID, courseNumber } = req.body;

    // TODO: add course to TA's prev courses once removed?

    try {

        if (!taStudentID || !courseNumber)
            throw new Error("Missing at least one of required fields: taStudentID, courseNumber.");

        // delete courseNumber from currCourses array if it exists
        const update = await TA.updateOne({ studentID: taStudentID }, { $pull: { currCourses: courseNumber.toUpperCase() } });
        if (update.matchedCount === 0)
            throw new Error(`No TA found with studentID ${taStudentID} in the database!`);

        res.status(200).json({ "message": `Successfully removed course ${courseNumber} from TA with studentID ${taStudentID}!` });

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Save multiple TAs
// @Route /api/ta/upload
// @Method POST
export const registerTAFromFile = asyncHandler(async (req: Request, res: Response) => {
    const csv = req.file;

    // TODO

    if (csv) {
        const fileContent = parse(csv.buffer.toString('utf-8'));
        for (let record of fileContent) {
            const professorEmail = record[0];
            const courseNumber = record[3];
            let instructor = await User.findOne({ professorEmail }).select("-password");
            let course = await Course.findOne({ courseNumber });
            if (!instructor || !course) {
                res.status(404);
                console.log("Instructor or course not found in the database! Skipping row.");
            } else {
                const prof = new Professor({
                    professor: instructor,
                    faculty: record[1],
                    department: record[2],
                    course: course
                });
                await prof.save();
            }
        }
    } else {
        res.status(500);
        throw new Error("File upload unsuccessful.");
    }
    res.status(200).json({});
});