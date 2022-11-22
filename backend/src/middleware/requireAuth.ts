import { Request, Response, NextFunction } from "express";
import User from "../models/User";
const jwt = require("jsonwebtoken");

export default async (req: Request, res: Response, next: NextFunction) => {
    // verify authentication
    const { authorization } = req.headers;

    // extract token from authorization header: "Bearer <token>" --> "<token>"
    const token = authorization ? authorization.replace("Bearer ", "") : null;

    if (!token)
        return res.status(401).json({ error: "Authorization token required." });
    
    try {
        // base64 encoding of "comp307secrets"
        // Put this in the env file
        const SECRET = "Y29tcDMwN3NlY3JldHM=" as string;
        const { id } = jwt.verify(token, SECRET);
        
        // attach userID to request body
        req.body.user = await User.findOne({ id }).select("_id");
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: "Request is not authorized." });
    }
};