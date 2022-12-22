import mongoose from 'mongoose';
import { Term } from './Course';

export interface IPerformanceLog extends mongoose.Document {
    profEmail: string;
    taStudentID: string;
    courseNumber: string;
    term: Term;
    comment: string
}

const PerformanceLogSchema = new mongoose.Schema({

    profEmail: {
        type: String,
        required: true,
    },

    taStudentID: {
        type: String,
        required: true,
    },

    courseNumber: {
        type: String,
        required: true,
    },
    term: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },

}, {
    timestamps: true
})

const PerformanceLog = mongoose.model<IPerformanceLog>("PerformanceLog", PerformanceLogSchema);

export default PerformanceLog;