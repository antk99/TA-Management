import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Course from "../models/Course";
import User from "../models/User";
import { parse } from 'csv-string';
import { CourseTA } from "../models/CourseTA";
import PerformanceLog from "../models/PerformanceLog";

// @Desc Get all Performance Logs
// @Route /api/performanceLog
// @Method GET
export const getAllPerformanceLogs = asyncHandler(async (req: Request, res: Response) => {
    const performanceLog = await PerformanceLog.find({});
    res.status(200).json({performanceLog});
});

// @Desc Get all Performance Logs by TA
// @Route /api/performanceLog/ta/:id
// @Method GET
export const getAllPerformanceLogsByTA = asyncHandler(async (req: Request, res: Response) => {
    const taId = req.params.id;
    const performanceLog = await PerformanceLog.find({ ta: taId });
    if (performanceLog) {
        res.status(200).json({performanceLog});
    } else {
        res.status(404);
        throw new Error("Performance Log not found");
    }
});

// @Desc Add Performance Logs
// @Route /api/performanceLog
// @Method POST
export const addPerformanceLog = asyncHandler(async (req: Request, res: Response) => {
    const { ta, course, comment } = req.body;
    const courseData = await Course.findById(course);
    if(courseData) {
        const taData = await User.findById(ta);
        if(taData) {
            const performanceLog = new PerformanceLog({
                ta,
                course,
                course_num: courseData.courseNumber,
                term: courseData.term,
                year: courseData.year,
                TA_name: taData.firstName + " " + taData.lastName,
                comment,
                time_stamp: new Date(),
            });
            await performanceLog.save();
            res.status(201).json({performanceLog});
        } else {
            res.status(404);
            throw new Error("TA not found");
        }
    } else {
        res.status(404);
        throw new Error("Course not found");
    }
});

// @Desc Delete Performance Log
// @Route /api/performanceLog/:id
// @Method DELETE
export const deletePerformanceLog = asyncHandler(async (req: Request, res: Response) => {
    const performanceLog = await PerformanceLog.findById(req.params.id);
    if (performanceLog) {
        await performanceLog.remove();
        res.json({ message: "Performance Log removed" });
    } else {
        res.status(404);
        throw new Error("Performance Log not found");
    }
});