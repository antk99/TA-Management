import { Request, Response, NextFunction } from "express";
import { IUser, UserTypes } from "../models/User";
require("dotenv").config();

/**
 * Middleware to protect resources by UserType, e.g. only allow Sysops to access sysop routes...
 * Must be used after requireAuth middleware to ensure user is authenticated
 * @param type UserType to require
 * @returns middleware function that checks if user has the required UserType
 */
const requireType = (type: UserTypes) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { user } = req.body as { user: IUser };
        if (user.userType.includes(type)) {
            next();
        } else {
            res.status(401).send("Unauthorized");
        }
    }
};

export const requireStudent = requireType(UserTypes.Student);
export const requireTA = requireType(UserTypes.TA);
export const requireProfessor = requireType(UserTypes.Professor);
export const requireAdmin = requireType(UserTypes.Admin);
export const requireSysop = requireType(UserTypes.Sysop);