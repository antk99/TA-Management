import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Course from "../models/Course";
import User from "../models/User";
import { parse } from 'csv-string';

// @Desc Get all Courses
// @Route /api/course
// @Method GET
export const getAllCourses = asyncHandler(async (req: Request, res: Response) => {
    const courses = await Course.find({});
    res.status(200).json({courses});
});

// @Desc Save multiple courses
// @Route /api/course/upload
// @Method POST
export const registerCourseFromFile = asyncHandler(async (req: Request, res: Response) => {
    const csv = req.file;
    if (csv) {
      const fileContent = parse(csv.buffer.toString('utf-8'));
      for (let record of fileContent) {
        const instructorEmail = record[5];
        let courseInstructor = await User.findOne({ instructorEmail }).select("-password");
        if (!courseInstructor) {
            res.status(404);
            console.log("Instructor not found in the database! Skipping row.");
        } else {
            const course = new Course({ 
                courseName: record[0],
                courseDesc: record[1],
                term: record[2],
                year: record[3],
                courseNumber: record[4],
                courseInstructor: courseInstructor
            });
            course.save(); // can be made concurrent
        }
      }
    } else {
      res.status(500);
      throw new Error("File upload unsuccessful.");
    }
    res.status(200).json({});
  });


// @Desc Add Courses
// @Route /api/course/add
// @Method POST
export const addCourses = asyncHandler(async (req: Request, res: Response) => {
    const { courseName, courseDesc, term, year, courseNumber, instructorEmail } = req.body;
    let courseInstructor = await User.findOne({ instructorEmail }).select("-password");
    if (!courseInstructor) {
        res.status(404);
        throw new Error("Instructor not found in the database! Add user and continue.");
    }
  
    const course = new Course({ courseName, courseDesc, term, year, courseNumber, courseInstructor });
    await course.save();
    res.status(201).json({
        id: course._id,
        courseName: course.courseName,
        courseDesc: course.courseDesc,
        term: course.term,
        year: course.year,
        courseNumber: course.courseNumber,
        instructor: course.courseInstructor
    });
});

// @Desc Delete Course
// @Route /api/course/:id
// @Method DELETE
export const deleteCourse = asyncHandler(async (req: Request, res: Response) => {
    const { courseNumber } = req.body;

    let course = await Course.findOne({ courseNumber });
    if(!course) {
        res.status(404);
        throw new Error("Course not found");
    }
    await User.findOneAndDelete({ courseNumber });
    res.status(201).json({});
})