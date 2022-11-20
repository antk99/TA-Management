import { UserTypes } from "../enums/UserTypes";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  userType: UserTypes[];
}

export const emptyUser: User = { firstName: "", lastName: "", email: "", userType: []};
