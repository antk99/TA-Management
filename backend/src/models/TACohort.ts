import mongoose from 'mongoose';
import {IUser} from "./User";
const Schema = mongoose.Schema;

export enum GradLevel {
    Undergraduate = "undergraduate",
    Graduate = "graduate"
}

export interface ITACohort extends mongoose.Document {
    ta: IUser,

    // TA cohort fields
    phone: string;
    legalName: string;
    level: GradLevel;
    supervisorName: string;
    isPriority: boolean;
    hours: number;
    dateApplied: string;
    location: string;
    degree: string;
    coursesAppliedFor: Array<string>;
    openToOtherCourses: boolean;
    notes: string;
}


const ITACohortSchema = new mongoose.Schema({

    ta: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "TA"
    },

    phone: {
        type: String,
        required: true,
    },

    legalName: {
        type: String,
        required: true,
    },

    level: {
        type: String,
        required: true,
    },

    supervisorName: {
        type: String,
        required: true,
    },

    isPriority: {
        type: Boolean,
        required: true,
    },

    hours: {
        type: Number,
        required: true,
    },

    dateApplied: {
        type: String, // date type?
        required: true,
    },

    location: {
        type: String,
        required: true,
    },

    degree: {
        type: String,
        required: true,
    },

    coursesAppliedFor: {
        type: Array,
        required: true,
    },

    openToOtherCourses: {
        type: Boolean,
        required: true,
    },

    notes: {
        type: String,
        required: false,
    },

}, {
    timestamps: true
})

const TACohort = mongoose.model<ITACohort>("TACohort", ITACohortSchema);

export default TACohort;