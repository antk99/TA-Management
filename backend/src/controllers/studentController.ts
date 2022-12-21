import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Course from '../models/Course';
import Student from '../models/Student';
import User from '../models/User';

// @Desc Get all students
// @Route /api/student
// @Method GET
export const getStudent = asyncHandler(async (req: Request, res: Response) => {
    const { studentID } = req.body;

    try {
        if (!studentID)
            throw new Error('Missing required field: studentID.');
        const student = await Student.findOne({ studentID });
        if (!student)
            throw new Error('Student not found. Add student and continue.');
        res.status(200).json({ student });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});


// @Desc Get student by user ID
// @Route /api/student/:id
// @Method GET
export const getStudentByID = asyncHandler(async (req: Request, res: Response) => {
    //const user = await User.findById({ _id: req.params.id });
    const student = await Student.findOne({ student: req.params.id });
    if (!student) {
      res.status(404);
      throw new Error("User not found");
    }
    res.status(200).json({
      student
    });
  });

// @Desc Get students courses
// @Route /api/student/courses/:id
// @Method GET
export const getStudentCourses = asyncHandler(async (req: Request, res: Response) => {
    const _IdStudent = req.params.id;
    try {
        if (!_IdStudent)
            throw new Error('Missing required field: studentID.');
        const student = await Student.findOne({ student: _IdStudent });
        if (!student)
            throw new Error('Student not found. Add student and continue.');
        if (!student.courses)
            throw new Error('Student not enrolled in any courses.');
        const courses = [];
        
        for(const courseId of student.courses){
            const course = await Course.findOne({ _id: courseId });
            if(!course)
                throw new Error(`No course with id: ${courseId} found in the database`);
            courses.push(course);
        }
        res.status(200).json({ courses });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Adds a student
// @Route /api/student/add
// @Method POST
export const addStudent = asyncHandler(async (req: Request, res: Response) => {
    const { studentEmail, studentID, courses } = req.body;

    try {
        if (!studentEmail || !studentID || !courses)
            throw new Error('Missing at least one of required fields: studentEmail, studentID, courses.');

        const studentUserID = await User.findOne({ email: studentEmail }).select('_id');
        if (!studentUserID)
            throw new Error(`No user with email: ${studentEmail} found in the database. Add user and continue.`);

        const exists = await Student.findOne({ "$or": [{ student: studentUserID }, { studentID: studentID }] });
        if (exists)
            throw new Error(`Student with email: ${studentEmail} or studentID: ${studentID} already exists in the database.`);

        const coursesIDs = [];

        // check if all courses are in database
        for (const course of courses) {
            const courseID = await Course.findOne({ courseNumber: course.toUpperCase() }).select('_id');
            if (!courseID)
                throw new Error(`Course ${course} not found in the database. Add course and continue.`);
            coursesIDs.push(courseID._id);
        }

        const student = await Student.create({ student: studentUserID, studentID, courses: coursesIDs });
        res.status(200).json({ student });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Deletes a student
// @Route /api/student/delete
// @Method DELETE
export const deleteStudent = asyncHandler(async (req: Request, res: Response) => {
    const { studentID } = req.body;

    try {
        if (!studentID)
            throw new Error('Missing required field: studentID.');

        const student = await Student.findOneAndDelete({ studentID });
        if (!student)
            throw new Error('Student not found. Add student and continue.');
        res.status(200).json({ "message": "Student deleted successfully." });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Adds array of courses to a student
// @Route /api/student/addCourses
// @Method PATCH
export const addCourses = asyncHandler(async (req: Request, res: Response) => {
    const { studentID, courses } = req.body;

    try {
        if (!studentID || !courses)
            throw new Error('Missing at least one of required fields: studentID, courses.');

        const student = await Student.findOne({ studentID });
        if (!student)
            throw new Error('Student not found. Add student and continue.');

        // check if courses are in database
        for (const course of courses) {
            const courseID = await Course.findOne({ courseNumber: course.toUpperCase() }).select('_id');
            if (!courseID)
                throw new Error(`Course ${course} not found in the database. Add course and continue.`);

            // append to student's courses if not already there
            if (!student.courses.includes(courseID._id))
                student.courses.push(courseID._id);
        }
        await student.save();
        res.status(200).json({ student });

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Removes array of courses from a student
// @Route /api/student/renmoveCourses
// @Method PATCH
export const removeCourses = asyncHandler(async (req: Request, res: Response) => {
    const { studentID, courses } = req.body;

    try {
        if (!studentID || !courses)
            throw new Error('Missing at least one of required fields: studentID, courses.');

        const student = await Student.findOne({ studentID });
        if (!student)
            throw new Error('Student not found. Add student and continue.');

        // check if courses are in database
        for (const course of courses) {
            const courseID = await Course.findOne({ courseNumber: course.toUpperCase() }).select('_id');
            if (!courseID)
                throw new Error(`Course ${course} not found in the database. Add course and continue.`);

            const index = student.courses.indexOf(courseID._id);
            index > -1 && student.courses.splice(index, 1);
        }
        await student.save();
        res.status(200).json({ student });

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});