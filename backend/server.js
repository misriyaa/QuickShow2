import dotenv from "dotenv";
dotenv.config(); // Must be first

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path"; // Added import
import { fileURLToPath } from "url"; // Added for ESM __dirname
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import movieRouter from "./routes/showMoviesRoute.js";
import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/BookingRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";


// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Static folder for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/shows", showRouter);
//booking
app.use("/api/bookings", bookingRouter);
//dashboard
app.use("/api/dashboard", dashboardRoutes);
connectDB();

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port http://localhost:${PORT}`);
});