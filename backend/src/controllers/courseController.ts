import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Course from "../models/Course";
import User from "../models/User";
import { parse } from 'csv-string';
import Professor from "../models/Professor";
import { capitalizeFirstLetter } from "../utils/stringFormatting";
import { CourseTA } from "../models/CourseTA";
import TA from "../models/TA";

// @Desc Get all Course Numbers [Public]
// @Route /api/course/courseNumbers
// @Method GET
export const getAllCourseNumbers = asyncHandler(async (req: Request, res: Response) => {
    const courses = await Course.find({});
    res.status(200).json({ courses: courses.map(course => course.courseNumber) });
});

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

// @Desc Get TAs by course
// @Route /api/course/allTas/:courseUuid
// @Method GET
export const getTAsByCourse = asyncHandler(async (req: Request, res: Response) => {
    const uuid = req.params.courseUuid;
    const course = await Course.findOne({ _id: uuid });
    if (!course)
        throw new Error(`Course with id: ${uuid} not found in database.`);
    const TAs = course.courseTAs;
    if (!TAs)
        throw new Error(`Course has no TAs.`);

    const data = [];
    // attach TA name to each TA
    for (const TA of TAs) {
        const ta = await User.findOne({ email: TA.email });
        if (!ta)
            throw new Error(`TA with email: ${TA.email} not found in database.`);
        data.push({ ...TA, fullName: `${ta.firstName} ${ta.lastName}` });
    }

    res.status(200).json({ TAs: data });
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
                    courseInstructor: courseInstructor,
                    instructorOfficeHours: [],
                    courseTAs: [],
                });

                const exists = await Course.findOne({ "$and": [{ courseNumber: course.courseNumber, term: course.term, year: course.year }] });
                if (exists)
                    console.log(`Course with courseNumber: ${course.courseNumber} already exists in the database for term ${course.term} ${course.year}! Skipping row.`);
                else
                    course.save(); // can be made concurrent
            }
        }
    } else {
        res.status(500);
        throw new Error("File upload unsuccessful.");
    }
    res.status(200).json({});
});

// @Desc Edit Course Details
// @Route /api/course/editDetails/:courseID
// @Method PATCH
export const editCourseDetails = asyncHandler(async (req: Request, res: Response) => {
    let { courseName, courseDesc, term, year, courseNumber, instructorEmail } = req.body;
    const courseID = req.params.courseID;

    try {
        if (!courseName || !courseDesc || !term || !year || !courseNumber || !instructorEmail)
            throw new Error("Missing one of the required fields: courseName, courseDesc, term, year, courseNumber, instructorEmail");

        const courseInstructor = await Professor.findOne({ profEmail: instructorEmail });
        if (!courseInstructor)
            throw new Error(`No professor with email: ${instructorEmail} found in the database! Add professor and continue.`);

        courseNumber = courseNumber.toUpperCase();
        term = capitalizeFirstLetter(term)  // capitalize first letter: fall -> Fall

        const course = await Course.findById({ _id: courseID });
        if (!course)
            throw new Error(`No course with ID: ${courseID} found in the database! Add course and continue.`);

        course.courseName = courseName;
        course.courseDesc = courseDesc;
        course.term = term;
        course.year = year;
        course.courseNumber = courseNumber;
        course.courseInstructor = courseInstructor.professor;
        await course.save();
        res.status(200).json({ course });

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
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

        const course = new Course({ courseName, courseDesc, term, year, courseNumber: courseNumber, courseInstructor: professorUserID, instructorOfficeHours: [], courseTAs: [] });
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

// @Desc Add Course TAs
// @Route /api/course/addTAs
// @Method PATCH
/*export const addCourseTA = asyncHandler(async (req: Request, res: Response) => {
    const { courseTA, courses } = req.body;

    const studentID = courseTA.studentID;
    let ta = await TA.findOne({ studentID });
    if (!ta) {
        res.status(404);
        throw new Error("TA not found in the database! Add user and continue.");
    }

    for (const c of courses) {
        let course = await Course.findOne({ courseNumber: c });
        if (!course) {
            throw new Error("Course not found in the database! Add course and continue.");
        }
        if (!(course.courseTAs.includes(courseTA))) course.courseTAs.push(courseTA);
        await course.save();
    }
    res.status(201);
});*/

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
    if (updatedCourse) {
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