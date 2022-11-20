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
      const user = new User({ 
        firstName: record[0],
        lastName: record[1],
        email: record[2],
        password: record[3],
        userType: record[4].split("/")
       });
      user.save(); // can be made concurrent
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
  if(!user) {
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
});


// @Desc Login user
// @Route /api/users/login
// @Method POST
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if(await user.comparePassword(password)) {
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
})


// @Desc Delete user by ID
// @Route /api/users/:id
// @Method DELETE
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

  let user = await User.findOne({ email });
  if(!user) {
    res.status(404);
    throw new Error("User not found");
  }
  await User.findOneAndDelete({ email });
  res.status(201).json({});
})