import { Request } from "express";
import { IUser } from "../models/User";

export interface UnauthenticatedRequest extends Request {
  user?: IUser;
}

export interface AuthenticatedRequest extends Request {
  user: IUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface SendMessageRequest {
  text: string;
  image?: string;
}

export interface UpdateProfileRequest {
  profilePic: string;
}

export interface UserResponse {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string;
}

export interface AuthResponse {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string;
}

export interface ErrorResponse {
  message: string;
}
