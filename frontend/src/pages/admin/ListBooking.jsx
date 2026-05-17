import React, { useEffect, useState } from "react";
import axiosInstance from "../../library/axios";
import {
  RefreshCwIcon,
  TicketIcon,
  CircleDollarSignIcon,
  UsersIcon,
  CalendarIcon,
  ClockIcon,
} from "lucide-react";
import Title from "../../components/admin/Title";
import Loading from "../../components/Loading";

const currency = "₹";

// ── helpers ───────────────────────────────────────────────────────────────────
const formatTime = (timeStr) => {
  if (!timeStr) return "—";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
};

// ── sub-components ────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-primary/10 border border-primary/20 p-5 rounded-2xl flex items-center gap-4 hover:bg-primary/15 transition-colors">
    <div className="p-3 bg-primary/20 rounded-xl text-primary shrink-0">
      <Icon size={22} />
    </div>
    <div>
      <p className="text-gray-400 text-xs uppercase tracking-widest mb-0.5">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-gray-600 gap-3">
    <TicketIcon size={40} className="opacity-30" />
    <p className="text-sm">No bookings found</p>
  </div>
);

// ── main component ────────────────────────────────────────────────────────────
const ListBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAllBookings = async () => {
    try {
      setLoading(true);
      setError(null);

    const res = await axiosInstance.get("/api/bookings/all");

      if (res.data.success) {
        setBookings(res.data.bookings);
      } else {
        setError(res.data.message || "Failed to load bookings.");
      }
    } catch (err) {
      setError("Could not reach the server. Please try again.");
      console.error("ListBooking fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBookings();
  }, []);

  // ── derived stats ──────────────────────────────────────────────────────────
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
  const uniqueUsers = new Set(bookings.map((b) => b.user?.email).filter(Boolean)).size;

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-400 text-sm">{error}</p>
        <button
          onClick={getAllBookings}
          className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm transition-colors"
        >
          <RefreshCwIcon size={14} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* ── header ── */}
      <div className="flex items-center justify-between">
        <Title text1="List" text2="Bookings" />
        <button
          onClick={getAllBookings}
          title="Refresh"
          className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <RefreshCwIcon size={16} />
        </button>
      </div>

      {/* ── stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Bookings" value={bookings.length} icon={TicketIcon} />
        <StatCard
          title="Total Revenue"
          value={`${currency}${totalRevenue.toLocaleString("en-IN")}`}
          icon={CircleDollarSignIcon}
        />
        <StatCard title="Unique Users" value={uniqueUsers} icon={UsersIcon} />
      </div>

      {/* ── table ── */}
      {bookings.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/5">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest">
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Movie</th>
                <th className="px-5 py-4">
                  <span className="flex items-center gap-1">
                    <CalendarIcon size={12} /> Date
                  </span>
                </th>
                <th className="px-5 py-4">
                  <span className="flex items-center gap-1">
                    <ClockIcon size={12} /> Time
                  </span>
                </th>
                <th className="px-5 py-4">Seats</th>
                <th className="px-5 py-4 text-right">Amount</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {bookings.map((item, i) => (
                <tr
                  key={item._id || i}
                  className="hover:bg-white/3 transition-colors"
                >
                  {/* User */}
                  <td className="px-5 py-4">
                    <p className="text-white font-medium truncate max-w-[120px]">
                      {item.user?.name || "—"}
                    </p>
                    <p className="text-gray-500 text-xs truncate max-w-[120px]">
                      {item.user?.email || ""}
                    </p>
                  </td>

                  {/* Movie */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {item.show?.movie?.posterUrl && (
                        <img
                          src={item.show.movie.posterUrl}
                          alt=""
                          className="w-8 h-8 rounded object-cover shrink-0"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      )}
                      <span className="text-gray-300 truncate max-w-[140px]">
                        {item.show?.movie?.title || "—"}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4 text-gray-400 whitespace-nowrap">
                    {item.date || "—"}
                  </td>

                  {/* Time */}
                  <td className="px-5 py-4 text-gray-400 whitespace-nowrap">
                    {formatTime(item.time)}
                  </td>

                  {/* Seats */}
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[120px]">
                      {(item.seats || []).map((seat) => (
                        <span
                          key={seat}
                          className="px-1.5 py-0.5 bg-primary/20 text-primary text-xs rounded font-mono"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-4 text-right font-semibold text-white whitespace-nowrap">
                    {currency}
                    {(item.amount || 0).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListBooking;