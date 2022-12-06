import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Course from "../models/Course";
import User from "../models/User";
import Wishlist from "../models/Wishlist";
import Professor from "../models/Professor";
import TA from "../models/TA";
import objectIdFromString from "../utils/objectIdFromString";
import { capitalizeFirstLetter } from "../utils/stringFormatting";

// @Desc Get a prof's wishlist
// @Route /api/wishlist
// @Method GET
export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
    const { profEmail } = req.body;
    console.log("NEW");
    try {
        if (!profEmail)
            throw new Error("Missing at least one of required fields: profEmail.");

        const profUserID = await User.findOne({ email: profEmail }).select("_id");
        if (!profUserID)
            throw new Error(`No user with email ${profEmail} found in the database! Add user and continue.`);

        const wishlist = await Wishlist.find({ professor: profUserID });
        res.status(200).json({ wishlist });

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Delete a prof's singular ta in their wishlist
// @Route /api/wishlist/delete
// @Method DELETE
export const deleteWishlist = asyncHandler(async (req: Request, res: Response) => {
    const { wishlistID } = req.body;

    try {
        if (!wishlistID)
            throw new Error("Missing at least one of required fields: wishlistID.");

        const wishlist = await Wishlist.findByIdAndDelete(objectIdFromString(wishlistID));
        if (!wishlist)
            throw new Error("No wishlist found with that ID.");

        res.status(200).json({ "message": "Wishlist deleted successfully." });

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Add Wishlist
// @Route /api/wishlist/add
// @Method POST
export const addWishlist = asyncHandler(async (req: Request, res: Response) => {
    let { professorEmail, taEmail, courseNumber, termFor, termYearFor } = req.body;

    try {
        if (!professorEmail || !taEmail || !courseNumber || !termFor || !termYearFor)
            throw new Error("Missing at least one of required fields: professorEmail, taEmail, courseNumber, termFor, termYearFor.");

        termFor = capitalizeFirstLetter(termFor); // capitalize first letter of term

        const professorUserID = await User.findOne({ email: professorEmail }).select("_id");
        if (!professorUserID)
            throw new Error(`No user found with email ${professorEmail} in the database! Add user and continue.`);

        const professorID = await Professor.findOne({ professor: professorUserID }).select("_id");
        if (!professorID)
            throw new Error("Professor not found in the database! Add professor and continue.");

        const taUserID = await User.findOne({ email: taEmail }).select("_id");
        if (!taUserID)
            throw new Error(`No user found with email ${taEmail} in the database! Add user and continue.`);

        const taID = await TA.findOne({ ta: taUserID }).select("_id");
        if (!taID)
            throw new Error("TA not found in the database! Add TA and continue.");

        const courseID = await Course.findOne({ courseNumber }).select("_id");
        if (!courseID)
            throw new Error(`Course ${courseNumber} not found in the database! Add course and continue.`);

        const exists = await Wishlist.findOne({ professor: professorUserID, ta: taUserID, course: courseID, termFor, termYearFor });
        if (exists)
            throw new Error("Wishlist already exists in the database!");

        const wishlist = new Wishlist({ professor: professorUserID, ta: taUserID, course: courseID, termFor, termYearFor });
        await wishlist.save();
        res.status(201).json({
            id: wishlist._id,
            professor: wishlist.professor,
            ta: wishlist.ta,
            course: wishlist.course,
            termFor: wishlist.termFor,
            termYearFor: wishlist.termYearFor
        });

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});