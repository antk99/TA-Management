import mongoose from 'mongoose';
import { ICourse, Term } from './Course';
import { IProfessor } from './Professor';
import { ITA } from './TA';
const Schema = mongoose.Schema;

export interface IPerformanceLog extends mongoose.Document {
	professor: IProfessor;
	ta: ITA
	course: ICourse;
	term: Term;
	comment: string 
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

    term: {
        type: String,
        required: true,
    },

    comment: {
        type: String,
        required: true,
        maxLength: 1000
    },

}, {
    timestamps: true
})

const PerformanceLog = mongoose.model<IPerformanceLog>("PerformanceLog", PerformanceLogSchema);

export default PerformanceLog;