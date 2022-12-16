import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/User";
import generateToken from "../utils/generateToken";
import { parse } from 'csv-string';

// @Desc Get all users
// @Route /api/users
// @Method GET
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({}).select("-password");
  res.status(200).json({
    users
  });
});

// @Desc Save multiple users
// @Route /api/users/upload
// @Method POST
export const registerUsersFromFile = asyncHandler(async (req: Request, res: Response) => {
  const csv = req.file;
  if (csv) {
    const fileContent = parse(csv.buffer.toString('utf-8'));
    for (let record of fileContent) {
      const email = record[2];
      const userExists = await User.findOne({ email });
      if (userExists)
        console.log("User already exists! Skipping row.")
      else {
        const user = new User({
          firstName: record[0],
          lastName: record[1],
          email,
          password: record[3],
          userType: record[4].split("/")
        });

        await user.save();
        console.log(user.email + " saved.");
      }
    }
  } else {
    res.status(500);
    throw new Error("File upload unsuccessful.");
  }
  res.status(200).json({});
});


// @Desc Get User by ID
// @Route /api/users/:id
// @Method GET
export const getUserByID = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById({ _id: req.params.id }).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json({
    user
  });
});

// @Desc Get User by email
// @Route /api/users/email/:email
// @Method GET
export const getUserByEmail = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.params.email }).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json({
    user
  });
});

// @Desc Register User
// @Route /api/users/register
// @Method POST
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, userType } = req.body;

  try {
    if (!firstName || !lastName || !email || !password || !userType)
      throw new Error("Missing one of required fields: firstName, lastName, email, password, userType");

    const userExists = await User.findOne({ email });
    if (userExists)
      throw new Error("User already exists");

    const user = new User({ firstName, lastName, email, password, userType });
    await user.save();
    res.status(201).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      userType: user.userType,
      token: generateToken(user._id)
    });

  } catch (error: any) {
    res.status(400).json({ 'error': error.message });
  }
});

// @Desc Login user
// @Route /api/users/login
// @Method POST
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400);
      throw new Error("Missing one of required fields: email, password");
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (await user.comparePassword(password)) {
      res.status(200).json({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        token: generateToken(user._id)
      });
    } else {
      res.status(401);
      throw new Error("Email or password incorrect");
    }

  } catch (error: any) {
    res.json({ 'error': error.message });
  }
});

// @Desc Delete user by email
// @Route /api/users/delete/:email
// @Method DELETE
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const email = req.params.email;

  try {
    let user = await User.findOne({ email });
    if (!user)
      throw new Error("User not found");

    await user.delete();
    res.status(201).json({ "message": "User deleted successfully" });
  } catch (error: any) {
    res.status(404).json({ 'error': error.message });
  }
})