import { CourseRegInfo } from './../../../backend/src/models/TA';

export interface TA {
    // TA DB fields
    email: string;
    name: string;
    studentID: string;
    currCourses: Array<CourseRegInfo>;
    prevCourses: Array<CourseRegInfo>;
}

// converts an array of course registration objects to a string of course numbers
export const courseRegArrayToString = (arr: Array<any>, delim: string = ", ") => {
    return arr.map((courseReg) => courseReg.courseNumber).join(delim);
};