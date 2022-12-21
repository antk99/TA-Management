import { Duties } from "./Duties";
import { OfficeHour } from "./OfficeHour";

export interface CourseTA {
  uuid: string; // User._id from MongoDB of the TA
  studentID: string; // Student ID of the TA created by McGill (e.g. 123456789)
  fullName: string;
  email: string;
  responsabilities: string[];
  officeHours: OfficeHour[];
  duties: Duties;
}
