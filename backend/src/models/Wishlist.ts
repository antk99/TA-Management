import mongoose from 'mongoose';
import { Term } from './Course';

export interface IWishlist extends mongoose.Document {
    profEmail: string;
    taStudentID: string;
    courseNumber: string;
    termFor: Term;
    termYearFor: string;
}

const WishlistSchema = new mongoose.Schema({

    profEmail: {
        type: String,
        required: true,
    },

    taStudentID: {
        type: String,
        required: true,
    },

    courseNumber: {
        type: String,
        required: true,
    },

    termFor: {
        type: String,
        required: true,
    },

    termYearFor: {
        type: String,
        required: true,
    }

}, {
    timestamps: true
})

const Wishlist = mongoose.model<IWishlist>("Wishlist", WishlistSchema);

export default Wishlist;