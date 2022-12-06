import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Course from "../models/Course";
import Wishlist from "../models/Wishlist";
import Professor from "../models/Professor";
import TA from "../models/TA";
import { capitalizeFirstLetter } from "../utils/stringFormatting";
import { getProfNameByEmail } from "./profController";

// @Desc Get a prof's wishlist
// @Route /api/wishlist/:profEmail
// @Method GET
export const getProfWishlist = asyncHandler(async (req: Request, res: Response) => {
    const profEmail = req.params.profEmail;

    try {
        const wishlist = await Wishlist.find({ profEmail });
        res.status(200).json({ wishlist });

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Get all wishlists for given TA
// @Route /api/wishlist/ta/:studentID
// @Method GET
export const getTAWishlist = asyncHandler(async (req: Request, res: Response) => {
    const studentID = req.params.studentID;

    try {
        const wishlist = await Wishlist.find({ taStudentID: studentID }) as any;
        if (!wishlist)
            throw new Error(`No wishlist found.`);

        const list = [];
        for (const item of wishlist) {
            // get prof name & attach to wishlist
            const profName = await getProfNameByEmail(item.profEmail);
            item.profName = profName;
            list.push({ ...item._doc, profName });
        }
        res.status(200).json({ wishlist: list });

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Delete a prof's singular ta in their wishlist
// @Route /api/wishlist/delete/:wishlistID
// @Method DELETE
export const deleteWishlist = asyncHandler(async (req: Request, res: Response) => {
    const wishlistID = req.params.wishlistID;

    try {
        const wishlist = await Wishlist.findByIdAndDelete({ _id: wishlistID });
        if (!wishlist)
            throw new Error(`No wishlist found.`);

        res.status(200).json({ "message": "Wishlist deleted successfully." });

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Add Wishlist
// @Route /api/wishlist/add
// @Method POST
export const addWishlist = asyncHandler(async (req: Request, res: Response) => {
    let { profEmail, taStudentID, courseNumber, termFor, termYearFor } = req.body;

    try {
        if (!profEmail || !taStudentID || !courseNumber || !termFor || !termYearFor)
            throw new Error("Missing at least one of required fields: profEmail, taStudentID, courseNumber, termFor, termYearFor.");

        courseNumber = courseNumber.toUpperCase(); // uppercase course number
        termFor = capitalizeFirstLetter(termFor); // capitalize first letter of term

        const professorExists = await Professor.findOne({ profEmail });
        if (!professorExists)
            throw new Error(`Professor ${profEmail} not found in the database! Add professor and continue.`);

        const taExists = await TA.findOne({ studentID: taStudentID });
        if (!taExists)
            throw new Error(`TA ${taStudentID} not found in the database! Add TA and continue.`);

        const courseExists = await Course.findOne({ courseNumber });
        if (!courseExists)
            throw new Error(`Course ${courseNumber} not found in the database! Add course and continue.`);

        let wishlist = await Wishlist.findOne({ profEmail, taStudentID, courseNumber, termFor, termYearFor });
        if (!wishlist) {
            wishlist = new Wishlist({ profEmail, taStudentID, courseNumber, termFor, termYearFor });
            await wishlist.save();
        }
        res.status(201).json({ wishlist });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});