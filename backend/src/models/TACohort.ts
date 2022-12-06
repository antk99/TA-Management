import mongoose from 'mongoose';

export enum GradLevel {
    Undergraduate = "undergraduate",
    Graduate = "graduate"
}

export interface ITACohort extends mongoose.Document {
    studentID: string;

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

    studentID: {
        type: String,
        required: true,
        unique: true
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