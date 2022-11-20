import mongoose from 'mongoose';
import {IProfessor} from "./Professor";

const Schema = mongoose.Schema;

enum Term {
    Fall = "fall",
    Spring = "spring",
    Summer = "summer"
}

export interface ICourse extends mongoose.Document {
    courseName: string,
    courseDesc: string,
    term: Term,
    year: string,
    courseNumber: string,
    courseInstructor: IProfessor
}

const CourseSchema = new mongoose.Schema({

    courseName: {
        type: String,
        required: true,
    },

    courseDesc: {
        type: String,
        required: true,
    },

    term: {
        type: String,
        required: true,
    },

    year: {
        type: Number,
        required: true,
    },

    courseNumber: {
        type: String,
        required: true,
    },

    courseInstructor: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }

}, {
    timestamps: true
})

const Course = mongoose.model<ICourse>("Course", CourseSchema);

export default Course;