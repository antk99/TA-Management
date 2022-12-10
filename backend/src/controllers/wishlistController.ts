import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Course from "../models/Course";
import User from "../models/User";
import { parse } from 'csv-string';
import { CourseTA } from "../models/CourseTA";
import PerformanceLog from "../models/PerformanceLog";
import Wishlist from "../models/Wishlist";
import Professor from "../models/Professor";
import TA from "../models/TA";

// @Desc Get Wish List by Professor
// @Route /api/wishList/professor/:id
// @Method GET
export const getWishListByProfessor = asyncHandler(async (req: Request, res: Response) => {
    const wishList = await Wishlist.find({ professor: req.params.id });
    if (wishList) {
        res.status(200).json({wishList});
    }
    else {
        res.status(404);
        throw new Error("Wish List not found");
    }
});

// @Desc Add Wish List
// @Route /api/wishList
// @Method POST
export const addWishList = asyncHandler(async (req: Request, res: Response) => {
    const { professor, ta, course } = req.body;
    const courseData = await Course.findById(course);
    const professorData = await Professor.findById(professor);
    const taData = await TA.findById(ta);

    if(!courseData) {
        res.status(404);
        throw new Error("Course not found");
    }
    if(!professorData) {
        res.status(404);
        throw new Error("Professor not found");
    }
    if(!taData) {
        res.status(404);
        throw new Error("TA not found");
    }

    if(courseData && professorData && taData) {
        const wishList = new Wishlist({
            professor,
            ta,
            course,
            course_num: courseData.courseNumber,
            termFor: courseData.term,
            yearFor: courseData.year,
            professor_name: professorData.professor.firstName + " " + professorData.professor.lastName,
            TA_name: taData.ta.firstName + " " + taData.ta.lastName,
        });
        await wishList.save();
        res.status(201).json({wishList});
    }
});

// @Desc Delete Wish List
// @Route /api/wishlist/:id
// @Method DELETE
export const deleteWishList = asyncHandler(async (req: Request, res: Response) => {
    const wishList = await Wishlist.findById(req.params.id);
    if (wishList) {
        await wishList.remove();
        res.status(200).json({message: "Wish List removed"});
    }
    else {
        res.status(404);
        throw new Error("Wish List not found");
    }
});