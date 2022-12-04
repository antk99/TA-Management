import mongoose from 'mongoose';
import {IUser} from "./User";
const Schema = mongoose.Schema;

export interface ITA extends mongoose.Document {
    ta: IUser,
    studentID: string;
    currCourses: Array<string>;
    prevCourses: Array<string>;
}

const TASchema = new mongoose.Schema({

    ta: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    studentID: {
        type: String,
        required: true,
    },

    currCourses: {
        type: Array, // or Array<ObjectId>?
        required: true,
    },

    prevCourses: {
        type: Array, // or Array<ObjectId>?
        required: true,
    },
    
}, {
    timestamps: true
})

const TA = mongoose.model<ITA>("TA", TASchema);

export default TA;