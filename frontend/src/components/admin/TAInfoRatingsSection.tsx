import React from "react";
import convertScoreToStars from "../../helpers/convertScoreToStars";
import LabelledTextbox from "./LabelledTextbox";
import TAInfoCard from "./TAInfoCard";

type props = {
    ratings: Array<{ _id: string, score: number, comment: string, courseNumber: string, authorName: string }>;
};

const TAInfoRatingsSection = ({ ratings }: props) => {
    const hasStudentComments = ratings.length > 0;

    return (
        <TAInfoCard title="Student Comments" centerText={!hasStudentComments} style={{ marginBottom: "20px" }}>
            {hasStudentComments && ratings.map(rating => (
                <LabelledTextbox key={rating._id} label={`${convertScoreToStars(rating.score)} - ${rating.courseNumber}`} value={rating.comment + ` - ${rating.authorName}`} />
            ))}

            {!hasStudentComments && "No student comments found."}
        </TAInfoCard>
    );
};

export default TAInfoRatingsSection;


