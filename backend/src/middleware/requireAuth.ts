import { Request, Response, NextFunction } from "express";
import User from "../models/User";
const jwt = require("jsonwebtoken");

/*
    Middleware to check if the user is authenticated.
    If the user is authenticated, the user object will be attached as req.body.user.
    If the user is not authenticated, the request will be rejected with a 401 status code.
*/
export default async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization)
        return res.status(401).json({ error: "Authorization token required." });

    // extract token from authorization header: "Bearer <token>" --> "<token>"
    const token = authorization.replace("Bearer ", "");

    try {
        // base64 encoding of "comp307secrets"
        // TODO: Put this in the env file
        const SECRET = "Y29tcDMwN3NlY3JldHM=" as string;
        const { id } = jwt.verify(token, SECRET);

        // verify if real user
        const user = await User.findById(id);
        if (!user)
            throw new Error("");

        // attach user to request body
        req.body.user = user;

        next();
    } catch (error: any) {
        res.status(401).json({ error: "Request is not authorized." });
    }
};