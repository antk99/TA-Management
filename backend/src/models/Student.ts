import mongoose from 'mongoose';
import { IUser } from "./User";
const Schema = mongoose.Schema;

export interface IStudent extends mongoose.Document {
    student: IUser;
    studentID: string;
    courses: Array<string>; // Array of courseNumbers
}

const StudentSchema = new mongoose.Schema({

    student: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
        unique: true
    },

    studentID: {
        type: String,
        required: true,
        unique: true,
    },

    courses: {
        type: Array,
        required: true,
    },

}, {
    timestamps: true
})

const Student = mongoose.model<IStudent>("Student", StudentSchema);

export default Student;