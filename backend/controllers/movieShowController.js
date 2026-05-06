import { bookingModel } from "../models/BookingSchema.js";
import { movieModel } from "../models/movieSchema.js";
import Show from "../models/showSchema.js"; // ✅ FIXED

// ================= MOVIES =================

// ADD MOVIE
export const AddMovie = async (req, res) => {
  try {
    const {
      language, year, title, rating, runtime,
      genres, tagline, overview, posterUrl, trailerUrl, cast,
    } = req.body;
 
    const newMovie = new movieModel({
      language, year, title, rating, runtime,
      genres: Array.isArray(genres)
        ? genres
        : genres?.split(",").map((g) => g.trim()).filter(Boolean) || [],
      tagline, overview, posterUrl, trailerUrl,
      cast: typeof cast === "string" ? JSON.parse(cast) : cast || [],
    });
 
    await newMovie.save();
    res.json({ success: true, message: "Movie added successfully", movie: newMovie });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
 
export const getAllMovies = async (req, res) => {
  try {
    const movies = await movieModel.find().sort({ createdAt: -1 });
    res.json({ success: true, movies });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
 
export const getMovieById = async (req, res) => {
  try {
    const movie = await movieModel.findById(req.params.id);
    if (!movie) return res.json({ success: false, message: "Movie not found" });
    res.json({ success: true, movie });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};



// ================= SHOWS =================

// ADD SHOW
export const addShow = async (req, res) => {
  try {
    const { movie, showPrice, date, times } = req.body;
 
    if (!movie || !date || !times || times.length === 0 || !showPrice) {
      return res.json({ success: false, message: "Missing required fields" });
    }
 
    const newShow = new Show({
      movie,
      showPrice,
      showDateTimes: [{ date, times }],
    });
 
    await newShow.save();
    res.json({ success: true, message: "Show added successfully", show: newShow });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
 
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find().populate("movie");
    res.json({ success: true, shows });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
 
export const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.showId).populate("movie");
    if (!show) return res.json({ success: false, message: "Show not found" });
    res.json({ success: true, show });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};



// BOOK SEATS
export const bookSeats = async (req, res) => {
  try {
    const { showId, date, time, seats } = req.body;
    const userId = req.user.id;
 
    if (!showId || !date || !time || !seats || seats.length === 0) {
      return res.json({ success: false, message: "Missing booking details" });
    }
 
    // ✅ FIX 1: null check for show
    const show = await Show.findById(showId);
    if (!show) {
      return res.json({ success: false, message: "Show not found" });
    }
 
    const key = `${date}_${time}`;
    const alreadyBooked = show.occupiedSeats?.[key] || [];
 
    // Prevent double booking
    const conflict = seats.filter((s) => alreadyBooked.includes(s));
    if (conflict.length > 0) {
      return res.json({
        success: false,
        message: `Seats already booked: ${conflict.join(", ")}`,
      });
    }
 
    // Atomic update — only proceeds if none of the seats exist yet
    const updated = await Show.updateOne(
      {
        _id: showId,
        [`occupiedSeats.${key}`]: { $nin: seats },
      },
      {
        $addToSet: {
          [`occupiedSeats.${key}`]: { $each: seats },
        },
      }
    );
 
    // If no doc was modified, a concurrent booking beat us to it
    if (updated.modifiedCount === 0) {
      return res.json({
        success: false,
        message: "Seats were just booked by someone else. Please choose different seats.",
      });
    }
 
    // ✅ FIX 2: use show.showPrice instead of hardcoded 150
    const amount = seats.length * show.showPrice;
 
    await bookingModel.create({
      user: userId,
      show: showId,
      date,
      time,
      seats,
      amount,
    });
 
    return res.json({
      success: true,
      message: "Booking confirmed!",
      amount,
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
 
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const bookings = await bookingModel
     .find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "show",
        populate: { path: "movie" },
      });
 
    res.json({ success: true, bookings });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingModel
      .find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate({
        path: "show",
        populate: { path: "movie" },
      });

    res.json({ success: true, bookings });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};