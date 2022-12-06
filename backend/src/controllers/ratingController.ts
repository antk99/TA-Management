import TA from "../models/TA";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Rating from "../models/Rating";
import Student from "../models/Student";
import Course from "../models/Course";
import objectIdFromString from "../utils/objectIdFromString";

// @Desc Get all ratings for given TA
// @Route /api/review
// @Method GET
export const getRatings = asyncHandler(async (req: Request, res: Response) => {
    const { taStudentID } = req.body;

    try {
        if (!taStudentID)
            throw new Error("Missing required field: taStudentID.");

        const taID = await TA.findOne({ studentID: taStudentID }).select("_id");
        if (!taID)
            throw new Error("TA not found. Add TA and continue.");

        const ratings = await Rating.find({ ta: taID });
        res.status(200).json({ ratings });

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Adds a rating for given TA
// @Route /api/review/add
// @Method POST
export const addRating = asyncHandler(async (req: Request, res: Response) => {
    const { authorStudentID, taStudentID, courseNumber, score, comment } = req.body;

    try {
        if (!authorStudentID || !taStudentID || !courseNumber || !score || !comment)
            throw new Error("Missing at least one of required fields: authorStudentID, taStudentID, courseNumber, score, comment.");

        const studentID = await Student.findOne({ studentID: authorStudentID }).select("_id");
        if (!studentID)
            throw new Error("Student not found in the database. Add student and continue.");

        const taID = await TA.findOne({ studentID: taStudentID }).select("_id");
        if (!taID)
            throw new Error("TA not found in the database. Add TA and continue.");

        const courseID = await Course.findOne({ courseNumber: courseNumber.toUpperCase() }).select("_id");
        if (!courseID)
            throw new Error("Course not found in the database. Add course and continue.");

        if (score < 0 || score > 5)
            throw new Error("Score must be between 0 and 5.");

        if (comment.length > 1000)
            throw new Error("Comment must be less than 1000 characters.");

        const rating = await Rating.create({ author: studentID, ta: taID, course: courseID, score, comment });
        res.status(200).json({ rating });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Deletes a rating
// @Route /api/review/delete
// @Method DELETE
export const deleteRating = asyncHandler(async (req: Request, res: Response) => {
    const { ratingID } = req.body;

    try {
        if (!ratingID)
            throw new Error("Missing required field: ratingID.");

        const rating = await Rating.findByIdAndDelete(objectIdFromString(ratingID));
        if (!rating)
            throw new Error("Rating not found in the database.");
        res.status(200).json({ "message": "Rating Deleted." });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});