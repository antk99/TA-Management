import { Duties } from "./Duties";
import { OfficeHour } from "./OfficeHour";

export interface CourseTA {
  uuid: string;
  studentID: string;
  fullName: string;
  email: string;
  responsabilities: string[];
  officeHours: OfficeHour[];
  duties: Duties;
}
