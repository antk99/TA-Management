import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { defaultSecret } from "../utils/generateToken";
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
        const SECRET = process.env.SECRET as string || defaultSecret;
        const { id } = jwt.verify(token, SECRET);

        // verify if real user
        const user = await User.findById(id);
        if (!user)
            throw new Error("No user found.");

        // attach user to request body
        req.body.user = user;

        next();
    } catch (error: any) {
        res.status(401).json({ error: "Request is not authorized." });
    }
};