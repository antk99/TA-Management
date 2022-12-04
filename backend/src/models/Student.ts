import mongoose from 'mongoose';
import {IUser} from "./User";
const Schema = mongoose.Schema;

export interface IStudent extends mongoose.Document {
	student: IUser;
    name: string;
    studentID: string;
    email: string;
    courses: Array<string>;
}

const StudentSchema = new mongoose.Schema({

    student: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    name: {
        type: String,
        required: true,
    },

    studentID: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    courses: {
        type: Array, // or Array<ObjectId>?
        required: true,
    },

}, {
    timestamps: true
})

const Student = mongoose.model<IStudent>("Student", StudentSchema);

export default Student;