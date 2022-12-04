import mongoose from 'mongoose';
import { ICourse } from './Course';
import { IStudent } from './Student';
import { ITA } from './TA';
const Schema = mongoose.Schema;

export interface IRating extends mongoose.Document {
	author: IStudent;
	ta: ITA;
	course: ICourse;
	score: number;
	comment: string;
}

const RatingSchema = new mongoose.Schema({

    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Student"
    },

    ta: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "TA"
    },

    course: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Course"
    },

    score: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
    },

    comment: {
        type: String,
        required: true,
        maxLength: 1000
    },

}, {
    timestamps: true
})

const Rating = mongoose.model<IRating>("Rating", RatingSchema);

export default Rating;