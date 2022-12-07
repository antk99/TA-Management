import mongoose from 'mongoose';
import { ICourse, Term } from './Course';
import { IProfessor } from './Professor';
import { ITA } from './TA';
const Schema = mongoose.Schema;

export interface IWishlist extends mongoose.Document {
	professor: IProfessor;
	ta: ITA;
	course: ICourse;
	termFor: Term;
}

const WishlistSchema = new mongoose.Schema({

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

    course_num: {
        type: String,
        required: true,
    },

    prof_name: {
        type: String,
        required: true,
    },

    TA_name: {
        type: String,
        required: true,
    },

    termFor: {
        type: String,
        required: true,
    },

}, {
    timestamps: true
})

const Wishlist = mongoose.model<IWishlist>("Wishlist", WishlistSchema);

export default Wishlist;