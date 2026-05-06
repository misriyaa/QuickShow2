import { bookingModel } from "../models/BookingSchema.js";
import { userModel } from "../models/userModel.js";
import Show from "../models/showSchema.js";

export const getDashboardData = async (req, res) => {
  try {
    // 1. Total users
    const totalUsers = await userModel.countDocuments();

    // 2. All bookings for stats
    const bookings = await bookingModel.find();
    const totalBookings = bookings.length;

    // 3. Total revenue (uses stored amount field)
    const totalRevenue = bookings.reduce((acc, b) => acc + (b.amount || 0), 0);

    // 4. Active shows — latest 6, with movie populated
    const activeShows = await Show.find()
      .populate("movie")
      .sort({ createdAt: -1 })
      .limit(6);

    // ✅ FIX: Recent bookings — latest 8, fully populated for the table
    const recentBookings = await bookingModel
      .find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate("user", "name email")
      .populate({
        path: "show",
        populate: { path: "movie", select: "title posterUrl" },
      });

    res.json({
      success: true,
      dashboard: {
        totalUsers,
        totalBookings,
        totalRevenue,
        activeShows,
        recentBookings, // ✅ added
      },
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};