import React from "react";
import { courseRegArrayToString, TA } from "../../classes/TA";
import LabelledTextbox from "./LabelledTextbox";
import TAInfoCard from "./TAInfoCard";

type CohortInfo = {
    phone: string,
    degree: string,
    level: string,
    priority: boolean,
    supervisorName: string,
    termYear: string,
    location: string,
    dateApplied: string,
    coursesAppliedFor: Array<string>
    openToOtherCourses: boolean,
    hours: string,
    notes: string
};

type props = {
    ta: TA,
    cohortInfo: CohortInfo,
    isError: boolean,
};

const booleanToYesNo = (bool) => { return bool ? "Yes" : "No" };
const arrToString = (arr) => { return arr ? arr.length === 0 ? "None" : arr.join(", ") : "" };

const TAInfoCohortSection = ({ ta, cohortInfo, isError }: props) => {
    // invisible character to prevent empty cells from collapsing, equivalent to blank
    const defaultData = "‎";

    const fields = [
        { label: "Email", value: ta.email },
        { label: "Student ID", value: ta.studentID },
        { label: "Phone Number", value: isError ? defaultData : cohortInfo.phone },
        { label: "Degree", value: isError ? defaultData : cohortInfo.degree },
        { label: "Level", value: isError ? defaultData : cohortInfo.level },
        { label: "Priority", value: isError ? defaultData : booleanToYesNo(cohortInfo.priority) },
        { label: "Supervisor", value: isError ? defaultData : cohortInfo.supervisorName },
        { label: "Term Year", value: isError ? defaultData : cohortInfo.termYear },
        { label: "Location", value: isError ? defaultData : cohortInfo.location },
        { label: "Date Applied", value: isError ? defaultData : cohortInfo.dateApplied },
        { label: "Courses Applied For", value: isError ? defaultData : arrToString(cohortInfo.coursesAppliedFor) },
        { label: "Open To Other Courses", value: isError ? defaultData : booleanToYesNo(cohortInfo.openToOtherCourses) },
        { label: "Hours", value: isError ? defaultData : cohortInfo.hours },
        { label: "Current Courses", value: ta.currCourses.length > 0 ? courseRegArrayToString(ta.currCourses) : defaultData },
        { label: "Previous Courses", value: ta.prevCourses.length > 0 ? courseRegArrayToString(ta.prevCourses) : defaultData },
        { label: "Notes", value: isError || cohortInfo?.notes?.length === 0 ? defaultData : cohortInfo.notes },
    ];

    const midPoint = Math.ceil(fields.length / 2);

    return (
        <TAInfoCard title="Cohort Information" style={{ width: '100%' }} maxHeight="fit-content" flexDirection="row">
            <div className="cohortFields">
                {fields.slice(0, midPoint).map((field) => (
                    <LabelledTextbox key={field.label} label={field.label} value={field.value !== "" ? field.value : "None"} />
                ))}
            </div>
            <div className="cohortFields">
                {fields.slice(midPoint).map((field) => (
                    <LabelledTextbox key={field.label} label={field.label} value={field.value} />
                ))}
            </div>
        </TAInfoCard>
    );
};

export default TAInfoCohortSection;