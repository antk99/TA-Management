import { OfficeHour } from "./OfficeHour";

export interface CourseTA {
  uuid: string;
  fullName: string;
  email: string;
  responsabilities: string[];
  officeHours: OfficeHour[];
}
