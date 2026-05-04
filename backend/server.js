import dotenv from "dotenv";
dotenv.config(); // Must be first

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5174",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("AutoAid server is running ✅");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port http://localhost:${PORT}`);
});
