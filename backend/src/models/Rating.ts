import mongoose from 'mongoose';

export interface IRating extends mongoose.Document {
    authorID: string;
    authorName: string;
    taStudentID: string;
    courseNumber: string;
    score: number;
    comment: string;
}

const RatingSchema = new mongoose.Schema({

    authorID: {
        type: String,
        required: true,
    },

    authorName: {
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

    score: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
    },

    comment: {
        type: String,
        required: true,
        maxLength: 1000
    },

}, {
    timestamps: true
})

const Rating = mongoose.model<IRating>("Rating", RatingSchema);

export default Rating;