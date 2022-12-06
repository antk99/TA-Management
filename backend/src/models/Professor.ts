import mongoose from 'mongoose';
import { IUser } from './User';

export interface IProfessor extends mongoose.Document {
    professor: IUser,
    profEmail: string,
    faculty: string, // think about what happens when profs are cross appointed 
    department: string,
}

const ProfessorSchema = new mongoose.Schema({

    professor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    profEmail: {
        type: String,
        required: true,
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