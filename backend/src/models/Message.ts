import mongoose, { Document, Schema, Model } from "mongoose";

export interface IMessage extends Document {
  senderId: mongoose.Schema.Types.ObjectId;
  receiverId: mongoose.Schema.Types.ObjectId;
  text?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema: Schema<IMessage> = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
    },

    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message: Model<IMessage> = mongoose.model<IMessage>(
  "Message",
  messageSchema
);

export default Message;
