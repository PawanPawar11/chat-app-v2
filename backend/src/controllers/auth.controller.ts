import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils";
import cloudinary from "../lib/cloudinary";
import {
  AuthenticatedRequest,
  SignupRequest,
  LoginRequest,
  UpdateProfileRequest,
  AuthResponse,
  ErrorResponse,
} from "../types";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { fullName, email, password } = req.body as SignupRequest;

  try {
    if (!fullName || !email || !password) {
      res
        .status(400)
        .json({ message: "Please fill out all the fields" } as ErrorResponse);
      return;
    }

    if (password.length < 8) {
      res
        .status(400)
        .json({ message: "Password should be of length 8" } as ErrorResponse);
      return;
    }

    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: "User already exists" } as ErrorResponse);
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id.toString(), res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id.toString(),
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        createdAt: newUser.createdAt,
      } as AuthResponse);
    } else {
      res.status(400).json({ message: "Invalid user data" } as ErrorResponse);
    }
  } catch (error) {
    console.log(
      "Error occurred in the signup controller",
      (error as Error).message
    );
    res.status(500).json({ message: "Internal Server Error" } as ErrorResponse);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as LoginRequest;

  try {
    if (!email || !password) {
      res
        .status(400)
        .json({ message: "Please fill out all details" } as ErrorResponse);
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "User doesn't exist" } as ErrorResponse);
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Incorrect Password" } as ErrorResponse);
      return;
    }

    generateToken(user._id.toString(), res);

    res.status(200).json({
      _id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      createdAt: user.createdAt,
    } as AuthResponse);
  } catch (error) {
    console.log(
      "Error occurred in the login controller",
      (error as Error).message
    );
    res.status(500).json({ message: "Internal Server Error" } as ErrorResponse);
  }
};

export const logout = (req: Request, res: Response): void => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    console.log(
      "Error occurred in the logout controller",
      (error as Error).message
    );
    res.status(500).json({ message: "Internal Server Error" } as ErrorResponse);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const { profilePic } = req.body as UpdateProfileRequest;
    const userId = authenticatedReq.user._id;

    if (!profilePic) {
      res
        .status(400)
        .json({ message: "Profile pic is required" } as ErrorResponse);
      return;
    }

    if (!userId) {
      res.status(401).json({ message: "Unauthorized User" } as ErrorResponse);
      return;
    }

    const uploadedResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser: IUser | null = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadedResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update profile: ", (error as Error).message);
    res.status(500).json({ message: "Internal Server Error" } as ErrorResponse);
  }
};

export const checkAuth = (req: Request, res: Response): void => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    res.status(200).json({
      _id: authenticatedReq.user._id.toString(),
      fullName: authenticatedReq.user.fullName,
      email: authenticatedReq.user.email,
      profilePic: authenticatedReq.user.profilePic || "",
      createdAt: authenticatedReq.user.createdAt,
    } as AuthResponse);
  } catch (error) {
    console.log(
      "Error occurred in the checkAuth controller: ",
      (error as Error).message
    );
    res.status(500).json({ message: "Internal Server Error" } as ErrorResponse);
  }
};
