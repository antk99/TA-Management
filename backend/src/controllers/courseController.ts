import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Course from "../models/Course";
import User from "../models/User";
import { parse } from 'csv-string';
import Professor from "../models/Professor";
import { capitalizeFirstLetter } from "../utils/stringFormatting";
import { CourseTA } from "../models/CourseTA";

// @Desc Get all Courses
// @Route /api/course
// @Method GET
export const getAllCourses = asyncHandler(async (req: Request, res: Response) => {
    const courses = await Course.find({});
    res.status(200).json({ courses });
});

// @Desc Get all Courses by Inscructor
// @Route /api/course/instructor/:instructorUuid
// @Method GET
export const getCourseByInstructor = asyncHandler(async (req: Request, res: Response) => {
    const instructorUuid = req.params.instructorUuid;
    const courses = await Course.find({ courseInstructor: instructorUuid });
    res.status(200).json({ courses });
});

// @Desc Get all Courses by TA
// @Route /api/course/ta/:taUuid
// @Method GET
export const getCourseByTA = asyncHandler(async (req: Request, res: Response) => {
    const uuid = req.params.taUuid;
    const courses = await Course.find({ courseTAs: { $elemMatch: { uuid } } });
    res.status(200).json({ courses });
});


// @Desc Save multiple courses
// @Route /api/course/upload
// @Method POST
export const registerCourseFromFile = asyncHandler(async (req: Request, res: Response) => {
    const csv = req.file;

    // TODO

    if (csv) {
        const fileContent = parse(csv.buffer.toString('utf-8'));
        for (let record of fileContent) {
            const instructorEmail = record[5];
            let courseInstructor = await User.findOne({ email: instructorEmail }).select("-password");
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


// @Desc Add Course
// @Route /api/course/add
// @Method POST
export const addCourse = asyncHandler(async (req: Request, res: Response) => {
    let { courseName, courseDesc, term, year, courseNumber, instructorEmail } = req.body;

    try {
        if (!courseName || !courseDesc || !term || !year || !courseNumber || !instructorEmail)
            throw new Error("Missing at least one of required fields: courseName, courseDesc, term, year, courseNumber, instructorEmail.");

        courseNumber = courseNumber.toUpperCase();
        term = capitalizeFirstLetter(term)  // capitalize first letter: fall -> Fall

        let professorUserID = await User.findOne({ email: instructorEmail }).select("_id");
        if (!professorUserID)
            throw new Error(`No user with email: ${instructorEmail} found in the database! Add user and continue.`);

        const professorID = await Professor.findOne({ professor: professorUserID }).select("_id");
        if (!professorID)
            throw new Error(`No professor with email: ${instructorEmail} found in the database! Add professor and continue.`);

        const exists = await Course.findOne({ "$and": [{ courseNumber, term, year }] });
        if (exists)
            throw new Error(`Course with courseNumber: ${courseNumber} already exists in the database for term ${term} ${year}!`);

        const course = new Course({ courseName, courseDesc, term, year, courseNumber: courseNumber, courseInstructor: professorUserID });
        await course.save();
        res.status(201).json({
            id: course._id,
            courseName: course.courseName,
            courseDesc: course.courseDesc,
            term: course.term,
            year: course.year,
            courseNumber: course.courseNumber,
            instructor: course.courseInstructor._id
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Update Course
// @Route /api/course/edit/:id
// @Method PUT
export const updateCourse = asyncHandler(async (req: Request, res: Response) => {
    const { courseName, courseDesc, term, year, courseNumber, instructorEmail, courseTAs, instructorOfficeHours } = req.body;
    let courseInstructor = await User.findOne({ email: instructorEmail }).select("-password");
    console.log(courseInstructor)
    if (!courseInstructor) {
        res.status(404);
        throw new Error("Instructor not found in the database! Add user and continue.");
    }

    courseTAs.forEach(async (ta: CourseTA) => {
        let courseTA = await User.findOne({ uuid: ta.uuid }).select("-password");
        if (!courseTA) {
            res.status(404);
            throw new Error("TA not found in the database! Add user and continue.");
        }
    });
   
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, {
        courseName,
        courseDesc,
        term,
        year,
        courseNumber,
        courseInstructor: courseInstructor._id,
        courseTAs,
        instructorOfficeHours
    });
    if(updatedCourse) {
        res.status(204).json({
            id: updatedCourse._id,
            courseName: updatedCourse.courseName,
            courseDesc: updatedCourse.courseDesc,
            term: updatedCourse.term,
            year: updatedCourse.year,
            courseNumber: updatedCourse.courseNumber,
            instructor: updatedCourse.courseInstructor,
            courseTAs: updatedCourse.courseTAs,
            instructorOfficeHours: updatedCourse.instructorOfficeHours
        });
    } else {
        res.status(404);
        throw new Error("Course not found");
    }
});

// @Desc Delete Course
// @Route /api/course/delete
// @Method DELETE
export const deleteCourse = asyncHandler(async (req: Request, res: Response) => {
    const { courseNumber } = req.body;

    try {
        if (!courseNumber)
            throw new Error("Missing required field: courseNumber.");

        let course = await Course.findOne({ courseNumber });
        if (!course)
            throw new Error("Course not found.");

        const deletedCourse = await Course.findOneAndDelete({ courseNumber });
        if (!deletedCourse)
            throw new Error("Course could not be deleted.");

        res.status(201).json({ 'message': `Course ${courseNumber} deleted successfully.` });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});