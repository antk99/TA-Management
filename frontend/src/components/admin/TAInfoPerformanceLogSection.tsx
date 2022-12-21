import React from "react";
import LabelledTextbox from "./LabelledTextbox";
import TAInfoCard from "./TAInfoCard";

type props = {
    performanceLogs: { _id: string, profName: string, courseNumber: string, comment: string }[];
};

const TAInfoPerformanceLogSection = ({ performanceLogs }: props) => {
    const hasPerformanceLogs = performanceLogs.length > 0;

    return (
        <TAInfoCard title="Professor Performance Logs" centerText={!hasPerformanceLogs}>
            {hasPerformanceLogs && performanceLogs.map(log => (
                <LabelledTextbox key={log._id} label={`${log.profName} - ${log.courseNumber}`} value={log.comment} />
            ))}

            {!hasPerformanceLogs && "No performance logs found."}
        </TAInfoCard>
    );
};

export default TAInfoPerformanceLogSection;


