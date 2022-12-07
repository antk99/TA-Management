import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Course from "../models/Course";
import Rating from "../models/Rating";
import Student from "../models/Student";
import TA from "../models/TA";
import User from "../models/User";

// @Desc Get all ratings for given TA
// @Route /api/rating/:taStudentID
// @Method GET
export const getRatings = asyncHandler(async (req: Request, res: Response) => {
    const taStudentID = req.params.taStudentID;

    try {
        const ratings = await Rating.find({ taStudentID });
        if (ratings.length === 0)
            throw new Error(`No ratings found.`);

        res.status(200).json({ ratings });

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Adds a rating for given TA
// @Route /api/rating/add
// @Method POST
export const addRating = asyncHandler(async (req: Request, res: Response) => {
    let { authorStudentID, taStudentID, courseNumber, score, comment } = req.body;

    try {
        if (!authorStudentID || !taStudentID || !courseNumber || !score || !comment)
            throw new Error("Missing at least one of required fields: authorStudentID, taStudentID, courseNumber, score, comment.");

        courseNumber = courseNumber.toUpperCase();
        score = Math.round(score);

        const authorUser = await Student.findOne({ studentID: authorStudentID });
        if (!authorUser)
            throw new Error("Student not found in the database. Add student and continue.");
        const authorNames = await User.findById(authorUser.student).select("firstName lastName");
        const authorName = authorNames ? `${authorNames.firstName} ${authorNames.lastName}` : "No Name";

        const taExists = await TA.findOne({ studentID: taStudentID });
        if (!taExists)
            throw new Error("TA not found in the database. Add TA and continue.");

        const courseExists = await Course.findOne({ courseNumber });
        if (!courseExists)
            throw new Error("Course not found in the database. Add course and continue.");

        if (score < 0 || score > 5)
            throw new Error("Score must be between 0 and 5.");

        if (comment.length > 1000)
            throw new Error("Comment must be less than 1000 characters.");

        const rating = await Rating.create({ authorID: authorStudentID, authorName, taStudentID, courseNumber, score, comment });
        res.status(200).json({ rating });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Deletes a rating
// @Route /api/rating/delete/:ratingID
// @Method DELETE
export const deleteRating = asyncHandler(async (req: Request, res: Response) => {
    const ratingID = req.params.ratingID;

    try {
        const rating = await Rating.findByIdAndDelete({ _id: ratingID });
        if (!rating)
            throw new Error("Rating not found in the database.");
        res.status(200).json({ "message": "Rating Deleted." });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});