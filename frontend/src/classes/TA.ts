export interface TA {
    // TA cohort fields
    name: string;
    studentID: string;
    legalName: string;
    email: string;
    level: string; // "Undergraduate" or "Graduate"
    supervisorName: string;
    isPriority: boolean;
    hours: number;
    dateApplied: string;
    location: string;
    phone: string;
    degree: string;
    coursesAppliedFor: Array<string>;
    openToOtherCourses: boolean;
    notes: string;
    currCourses: Array<string>;
    prevCourses: Array<string>;
}
