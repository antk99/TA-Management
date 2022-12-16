import { Request, Response, NextFunction } from "express";

/*
    Middleware to replace consecutive slashes in URL path
    e.g. ///api//prof --> /api/prof
*/
export default async (req: Request, res: Response, next: NextFunction) => {
    const path = req.path;
    const newPath = path.replace(/\/{2,}/g, "/");
    req.url = newPath;
    next();
};