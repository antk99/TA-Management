import { UserTypes } from "../enums/UserTypes";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: UserTypes[];
  token: string;
}

export const emptyUser: User = { id: "", firstName: "", lastName: "", email: "", userType: [], token: ""};
