import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Professor from "../models/Professor";
import User from "../models/User";
import { parse } from 'csv-string';

// @Desc Get all Profs
// @Route /api/prof
// @Method GET
export const getAllProfs = asyncHandler(async (req: Request, res: Response) => {
    const profs = await Professor.find({});
    res.status(200).json({ profs });
});

// @Desc Save multiple profs
// @Route /api/prof/upload
// @Method POST
export const registerProfFromFile = asyncHandler(async (req: Request, res: Response) => {
    const csv = req.file;

    if (csv) {
        const fileContent = parse(csv.buffer.toString('utf-8'));
        for (let record of fileContent) {
            const professorEmail = record[0];
            let instructor = await User.findOne({ email: professorEmail }).select("-password");
            if (!instructor) {
                res.status(404);
                console.log(`Instructor ${professorEmail} not found in the database! Skipping row.`);
            } else {
                const prof = new Professor({
                    professor: instructor._id,
                    profEmail: professorEmail,
                    faculty: record[1],
                    department: record[2],
                });
                await prof.save();
            }
        }
    } else {
        res.status(500);
        throw new Error("File upload unsuccessful.");
    }
    res.status(200).json({});
});

// @Desc Add Professor
// @Route /api/prof/add
// @Method POST
export const addProf = asyncHandler(async (req: Request, res: Response) => {
    const { profEmail, faculty, department } = req.body;
    // Also think of the case when the email is not that of a prof, how can you handle it?

    try {
        if (!profEmail || !faculty || !department)
            throw new Error("Missing at least one of required fields: profEmail, faculty, department.");

        const userExists = await User.findOne({ email: profEmail });
        if (!userExists)
            throw new Error(`No user with email: ${profEmail} found in the database. Add user and continue.`);

        const profExists = await Professor.findOne({ profEmail });
        if (profExists)
            throw new Error(`Professor with email: ${profEmail} already exists in the database.`);

        const prof = new Professor({
            professor: userExists._id,
            profEmail,
            faculty,
            department,
        });
        await prof.save();
        res.status(201).json({ prof });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @Desc Delete prof by email
// @Route /api/prof/delete/:email
// @Method DELETE
export const deleteProf = asyncHandler(async (req: Request, res: Response) => {
    const profEmail = req.params.email;

    try {
        let prof = await Professor.findOne({ profEmail });
        if (!prof)
            throw new Error("Professor not found");

        await prof.delete();
        res.status(201).json({ "message": "Professor deleted successfully" });
    } catch (error: any) {
        res.status(404).json({ 'error': error.message });
    }
})

export const getProfNameByEmail = async (profEmail: string) => {
    const profNames = await User.findOne({ email: profEmail }).select("firstName lastName") as any;
    if (!profNames) return "No Name";

    return profNames.firstName + " " + profNames.lastName;
}
