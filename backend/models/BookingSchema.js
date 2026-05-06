import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  show: { type: mongoose.Schema.Types.ObjectId, ref: "Show" },
  date: String,
  time: String,
  seats: [String],
  amount: Number,
  isPaid: { type: Boolean, default: false }
}, { timestamps: true });

export const bookingModel = mongoose.model("Booking", bookingSchema);