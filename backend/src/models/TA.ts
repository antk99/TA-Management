import mongoose from 'mongoose';
import { Term } from './Course';

export type CourseRegInfo = { term: Term, termYear: string, courseNumber: string, assignedHours: number };

export interface ITA extends mongoose.Document {
    email: string,
    name: string,
    studentID: string;
    currCourses: Array<CourseRegInfo>;
    prevCourses: Array<CourseRegInfo>;
}

const TASchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true,
    },

    studentID: {
        type: String,
        required: true,
        unique: true,
    },

    currCourses: {
        type: Array<CourseRegInfo>,
        required: true,
    },

    prevCourses: {
        type: Array<CourseRegInfo>,
        required: true,
    },

}, {
    timestamps: true
})

const TA = mongoose.model<ITA>("TA", TASchema);

export default TA;