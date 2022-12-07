import mongoose from 'mongoose';
import { ICourse } from './Course';
import { IProfessor } from './Professor';
import { ITA } from './TA';
const Schema = mongoose.Schema;

export interface IPerformanceLog extends mongoose.Document {
    ta: ITA,
    professor: IProfessor,
    course: ICourse,
    course_num: string,
    term: string,
    year: string,
    TA_name: string,
    comment: string,
    time_stamp: Date,
}

const PerformanceLogSchema = new mongoose.Schema({
    professor: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Professor"
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
    course_num: {
        type: String,
        required: true,
    },
    term: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    TA_name: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    time_stamp: {
        type: Date,
        required: true,
    }

}, {
    timestamps: false
})

const PerformanceLog = mongoose.model<IPerformanceLog>("PerformanceLog", PerformanceLogSchema);

export default PerformanceLog;