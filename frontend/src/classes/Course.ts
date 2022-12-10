import { OfficeHour } from "./OfficeHour";
import { CourseTA } from "./CourseTA";

export interface Course {
  id: string;
  term: string;
  year: string;
  courseNumber: string;
  courseName: string;
  courseDesc: string;
  instructorName: string;
  instructorEmail: string;
  instructorOfficeHours: OfficeHour[];
  courseTAs : CourseTA[];
}