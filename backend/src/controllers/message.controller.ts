import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import Message, { IMessage } from "../models/Message";
import cloudinary from "../lib/cloudinary";
import {
  AuthenticatedRequest,
  SendMessageRequest,
  ErrorResponse,
} from "../types";

export const getUsersForSidebar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Type assertion since we know protectRoute middleware adds user
    const authenticatedReq = req as AuthenticatedRequest;
    const loggedInUser = authenticatedReq.user._id;

    const filteredUsers: IUser[] = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log(
      "Error occurred in the getUsersForSidebar controller: ",
      (error as Error).message
    );
    res.status(500).json({ message: "Internal Server Error" } as ErrorResponse);
  }
};

export const getMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Type assertion since we know protectRoute middleware adds user
    const authenticatedReq = req as AuthenticatedRequest;
    const { id: userToChatID } = req.params;
    const myId = authenticatedReq.user._id;

    const messages: IMessage[] = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatID },
        { senderId: userToChatID, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log(
      "Error occurred in the getMessages controller: ",
      (error as Error).message
    );
    res.status(500).json({ message: "Internal Server Error" } as ErrorResponse);
  }
};

export const sendMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Type assertion since we know protectRoute middleware adds user
    const authenticatedReq = req as AuthenticatedRequest;
    const { text, image } = req.body as SendMessageRequest;
    const { id: receiverId } = req.params;
    const senderId = authenticatedReq.user._id;

    let imageUrl: string | undefined;

    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadedResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.log(
      "Error occurred in the sendMessage controller: ",
      (error as Error).message
    );
    res.status(500).json({ message: "Internal Server Error" } as ErrorResponse);
  }
};
