import mongoose from 'mongoose';
import { IUser } from "./User";
const Schema = mongoose.Schema;

export interface IProfessor extends mongoose.Document {
    professor: IUser,
    faculty: string, // think about what happens when profs are cross appointed 
    department: string,
}

const ProfessorSchema = new mongoose.Schema({

    professor: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
        unique: true
    },

    faculty: {
        type: String,
        required: true,
    },

    department: {
        type: String,
        required: true,
    },

}, {
    timestamps: true
})

const Professor = mongoose.model<IProfessor>("Professor", ProfessorSchema);

export default Professor;