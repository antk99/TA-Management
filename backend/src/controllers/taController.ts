import { Duties } from './../models/Duties';
import { CourseRegInfo } from './../models/TA';
import { capitalizeFirstLetter } from './../utils/stringFormatting';
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Course from "../models/Course";
import User from "../models/User";
import TA from "../models/TA";
import { CourseTA } from '../models/CourseTA';

// @Desc Get all TAs
// @Route /api/ta
// @Method GET
export const getAllTAs = asyncHandler(async (req: Request, res: Response) => {
    const TAs = await TA.find({});
    res.status(200).json({ TAs });
});

// @Desc Add TA
// @Route /api/ta/add
// @Method POST
export const addTA = asyncHandler(async (req: Request, res: Response) => {
    let { email, studentID, currCourses, prevCourses } = req.body;

    try {
        if (!email || !studentID || !currCourses || !prevCourses)
            throw new Error("Missing at least one of required fields: email, studentID, currCourses, prevCourses.");

        const taUser = await User.findOne({ email });
        if (!taUser)
            throw new Error(`No user with email ${email} found in the database! Add user and continue.`);

        const exists = await TA.findOne({ "$or": [{ studentID }, { email }] });
        if (exists)
            throw new Error(`TA with either email: ${email} or studentID: ${studentID} already exists in the database!`);

        // Check if all courses exist in the database
        for (const course of currCourses) {
            const { courseNumber } = course;
            const courseExists = await Course.findOne({ courseNumber: courseNumber.toUpperCase() });
            if (!courseExists)
                throw new Error(`Course ${courseNumber.toUpperCase()} does not exist in the database!`);
        }

        // Check if all courses exist in the database
        for (const course of prevCourses) {
            const { courseNumber } = course;
            const courseExists = await Course.findOne({ courseNumber: courseNumber.toUpperCase() });
            if (!courseExists)
                throw new Error(`Course ${courseNumber.toUpperCase()} does not exist in the database!`);
        }

        currCourses = currCourses.map((course: CourseRegInfo) => { return { ...course, term: capitalizeFirstLetter(course.term), courseNumber: course.courseNumber.toUpperCase() } });
        prevCourses = prevCourses.map((course: CourseRegInfo) => { return { ...course, term: capitalizeFirstLetter(course.term), courseNumber: course.courseNumber.toUpperCase() } });

        const ta = new TA({ email, name: taUser.firstName + " " + taUser.lastName, studentID, currCourses, prevCourses });
        await ta.save();
        res.status(201).json({ ta });

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Add currCourse to TA
// @Route /api/ta/addCurrCourse
// @Method POST
export const addTACurrCourse = asyncHandler(async (req: Request, res: Response) => {
    let { taStudentID, term, termYear, courseNumber, assignedHours } = req.body;

    try {

        if (!taStudentID || !term || !termYear || !courseNumber || !assignedHours)
            throw new Error("Missing at least one of required fields: taStudentID, term, termYear, courseNumber, assignedHours.");

        term = capitalizeFirstLetter(term);
        courseNumber = courseNumber.toUpperCase();

        const ta = await TA.findOne({ studentID: taStudentID });
        if (!ta)
            throw new Error(`No TA found with studentID ${taStudentID} in the database!`);

        const taUser = await User.findOne({ email: ta.email });
        if (!taUser)
            throw new Error(`No user found with email ${ta.email} in the database!`);

        const course = await Course.findOne({ courseNumber });
        if (!course)
            throw new Error(`No course found with courseNumber ${courseNumber} in the database!`);

        ta.currCourses.forEach((courseReg: any) => {
            if (courseReg.courseNumber === courseNumber && courseReg.term === term && courseReg.termYear === termYear)
                throw new Error(`Course registration info already exists for this TA for course ${courseNumber} in term ${term} ${termYear}! Please delete the existing registration info and try again.`);
        });

        const courseRegInfo: CourseRegInfo = { term, termYear, courseNumber, assignedHours };
        ta.currCourses.push(courseRegInfo);
        await ta.save();

        const BLANK_DUTIES: Duties = {
            officeHoursCount: 0,
            tutorialsCount: 0,
            gradingAssignmentsCount: 0,
            gradingTestsCount: 0,
            specialDescription: "",
            specialHours: 0,
            hours: 0,
            hoursSummation: 0,
        };

        // Add TA to course courseTAs
        const courseTA: CourseTA = {
            uuid: taUser._id,
            fullName: ta.name,
            email: ta.email,
            responsabilities: [],
            officeHours: [],
            duties: BLANK_DUTIES,
        };
        course.courseTAs.push(courseTA);
        await course.save();

        res.status(200).json({ courseAdded: courseRegInfo });

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Remove currCourse from TA & puts it in prevCourses
// @Route /api/ta/removeCurrCourse
// @Method DELETE
export const removeTACurrCourse = asyncHandler(async (req: Request, res: Response) => {
    let { taStudentID, term, termYear, courseNumber } = req.body;

    try {

        if (!taStudentID || !term || !termYear || !courseNumber)
            throw new Error("Missing at least one of required fields: taStudentID, term, termYear, courseNumber.");

        term = capitalizeFirstLetter(term);
        courseNumber = courseNumber.toUpperCase();

        const ta = await TA.findOne({ studentID: taStudentID });
        if (!ta)
            throw new Error(`No TA found with studentID ${taStudentID} in the database!`);

        // delete course from currCourses
        const courseIndex = ta.currCourses.findIndex((courseReg: CourseRegInfo) => courseReg.courseNumber === courseNumber && courseReg.term === term && courseReg.termYear === termYear);
        if (courseIndex === -1)
            throw new Error(`No course registration info found for this TA for course ${courseNumber} in term ${term} ${termYear}!`);
        const course = ta.currCourses.splice(courseIndex, 1);

        // add course to prevCourses
        ta.prevCourses.push({ term, termYear, courseNumber, assignedHours: course[0].assignedHours });

        // remove TA from course courseTAs
        const courseDB = await Course.findOne({ courseNumber });
        if (!courseDB)
            throw new Error(`No course found with courseNumber ${courseNumber} in the database!`);

        const courseTAIndex = courseDB.courseTAs.findIndex((courseTA: CourseTA) => courseTA.email === ta.email);
        if (courseTAIndex === -1)
            throw new Error(`No courseTA found for this TA for course ${courseNumber} in term ${term} ${termYear}!`);
        courseDB.courseTAs.splice(courseTAIndex, 1);
        await courseDB.save();

        await ta.save();
        res.status(200).json({ courseRemoved: courseNumber.toUpperCase() });

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});
