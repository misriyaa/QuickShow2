import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Movies from "./pages/Movies";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import MovieDetails from "./pages/MovieDetails";
import SeatLayout from "./pages/SeatLayout";
import MyBookings from "./pages/MyBookings";
import { Toaster } from "react-hot-toast"; //for notification
import Footer from "./components/Footer";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import ListShows from "./pages/admin/ListShows";
import ListBooking from "./pages/admin/ListBooking";
import AddShows from "./pages/admin/AddShows";
import AddMovie from "./pages/admin/AddMovies";
const App = () => {
  // navbar display when not in admin route
  const isAdminRoute = useLocation().pathname.startsWith("/admin");
  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/login" element={<Login />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
    <Route path="/seat-layout/:showId/:date/:time" element={<SeatLayout />} />
        <Route path="/my-booking" element={<MyBookings />} />
        <Route path="/favorite" element={<Favorites />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/admin" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-shows" element={<AddShows />} />
          <Route path="add-movies" element={<AddMovie />} />

          <Route path="list-shows" element={<ListShows />} />
          {/* Ensure this path matches your Sidebar NavLink */}
          <Route path="list-bookings" element={<ListBooking />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;
