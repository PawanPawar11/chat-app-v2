import express, { Application } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import messageRoutes from "./routes/message.route";
import { connectDB } from "./lib/db";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5001;
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
