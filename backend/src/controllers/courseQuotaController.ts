import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { parse } from 'csv-string';
import CourseQuota from "../models/CourseQuota";

// @Desc Get all course quotas
// @Route /api/courseQuota
// @Method GET
export const getAllCourseQuotas = asyncHandler(async (req: Request, res: Response) => {
    const quotas = await CourseQuota.find({});
    res.status(200).json({ quotas });
});

// @Desc Save multiple course quotas
// @Route /api/courseQuota/upload
// @Method POST
export const addCourseQuotaFromFile = asyncHandler(async (req: Request, res: Response) => {
    const csv = req.file;

    if (csv) {
        const fileContent = parse(csv.buffer.toString('utf-8'));
        for (let record of fileContent) {
            const quotaInfo = {
                termYear: record[0],
                courseNumber: record[1],
                courseType: record[2],
                courseName: record[3],
                instructorName: record[4],
                enrollmentNumber: record[5],
                taQuota: record[6],
            };
            const exists = await CourseQuota.findOne({
                termYear: quotaInfo.termYear, courseNumber: quotaInfo.courseNumber, courseType: quotaInfo.courseType, instructorName: quotaInfo.instructorName
            });
            if (exists)
                exists.delete();

            const quota = new CourseQuota({ ...quotaInfo });
            await quota.save();
        }
    } else {
        res.status(500);
        throw new Error("File upload unsuccessful.");
    }
    res.status(200).json({});
});
