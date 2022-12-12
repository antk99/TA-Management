import mongoose from 'mongoose';

export type CourseType = "Regular" | "Seminar" | "Lab" | "Other";

export interface ICourseQuota extends mongoose.Document {
    courseNumber: string,
    courseName: string,
    termYear: string,
    courseType: CourseType,
    instructorName: string,
    enrollmentNumber: number,
    taQuota: number
}

const CourseQuotaSchema = new mongoose.Schema({

    courseNumber: {
        type: String,
        required: true,
    },

    courseName: {
        type: String,
        required: true,
    },

    termYear: {
        type: String,
        required: true,
    },

    courseType: {
        type: String,
        required: true,
    },

    instructorName: {
        type: String,
        required: true,
    },

    enrollmentNumber: {
        type: Number,
        required: true,
    },

    taQuota: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true
})

const CourseQuota = mongoose.model<ICourseQuota>("CourseQuota", CourseQuotaSchema);

export default CourseQuota;