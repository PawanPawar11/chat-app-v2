import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { fullName, email, password } = req.body as {
    fullName: string;
    email: string;
    password: string;
  };

  try {
    if (!fullName || !email || !password) {
      res.status(400).json({ message: "Please fill out all the fields" });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ message: "Password should be of length 8" });
      return;
    }

    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: "User already exists" });
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
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log(
      "Error occurred in the signup controller",
      (error as Error).message
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  try {
    if (!email || !password) {
      res.status(400).json({ message: "Please fill out all details" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "User don't exist" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Incorrect Password" });
      return;
    }

    generateToken(user._id.toString(), res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log(
      "Error occurred in the login controller",
      (error as Error).message
    );
    res.status(500).json({ message: "Internal Server Error" });
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
    res.status(500).json({ message: "Internal Server Error" });
  }
};
