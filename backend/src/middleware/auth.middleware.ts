import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Response } from "express";
import User from "../models/User";
import { ErrorResponse, UnauthenticatedRequest } from "../types";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined within environment variables");
}

export const protectRoute = async (
  req: UnauthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      res
        .status(401)
        .json({ message: "Unauthorized - No token provided" } as ErrorResponse);
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded) {
      res
        .status(401)
        .json({ message: "Unauthorized - Invalid token" } as ErrorResponse);
      return;
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" } as ErrorResponse);
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(
      "Error occurred in the protectRoute middleware",
      (error as Error).message
    );
    res.status(500).json({ message: "Internal server error" } as ErrorResponse);
  }
};
