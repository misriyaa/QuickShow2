import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  UsersIcon,
  StarIcon,
  TicketIcon,
  CalendarIcon,
  ClockIcon,
  RefreshCwIcon,
} from "lucide-react";
import Title from "../../components/admin/Title";
import Loading from "../../components/Loading";

const currency = import.meta.env.VITE_CURRENCY || "₹";

const formatTime = (t) => {
  if (!t) return "—";
  const [h, m] = t.split(":");
  const hr = parseInt(h, 10);
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
};

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

// ── Sub-components ──────────────────────────────────────────────────────────

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-primary/10 border border-primary/20 p-5 rounded-2xl flex items-center gap-4 hover:bg-primary/15 transition-colors">
    <div className="p-3 bg-primary/20 rounded-xl text-primary shrink-0">
      <Icon size={26} />
    </div>
    <div>
      <p className="text-gray-400 text-xs uppercase tracking-widest mb-0.5">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const EmptyCard = ({ icon: Icon, label }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-600 gap-3">
    <Icon size={40} className="opacity-30" />
    <p className="text-sm">{label}</p>
  </div>
);

// ── Dashboard ───────────────────────────────────────────────────────────────

const Dashboard = () => {
  const [data, setData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUsers: 0,
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/dashboard/data", { withCredentials: true });
      if (res.data.success) {
        const d = res.data.dashboard;
        setData({
          totalBookings:  d.totalBookings  ?? 0,
          totalRevenue:   d.totalRevenue   ?? 0,
          activeShows:    Array.isArray(d.activeShows)    ? d.activeShows    : [],
          totalUsers:     d.totalUsers     ?? 0,
          recentBookings: Array.isArray(d.recentBookings) ? d.recentBookings : [],
        });
      } else {
        setError(res.data.message || "Failed to load dashboard.");
      }
    } catch (err) {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <Loading />;

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-red-400 text-sm">{error}</p>
      <button onClick={fetchData}
        className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm">
        <RefreshCwIcon size={14} /> Retry
      </button>
    </div>
  );

  const stats = [
    { title: "Total Bookings", value: data.totalBookings,                                         icon: ChartLineIcon },
    { title: "Total Revenue",  value: `${currency}${data.totalRevenue.toLocaleString("en-IN")}`, icon: CircleDollarSignIcon },
    { title: "Active Shows",   value: data.activeShows.length,                                    icon: PlayCircleIcon },
    { title: "Total Users",    value: data.totalUsers,                                            icon: UsersIcon },
  ];

  return (
    <div className="flex flex-col gap-10">

      {/* Header */}
      <div className="flex items-center justify-between">
        <Title text1="Admin" text2="Dashboard" />
        <button onClick={fetchData} title="Refresh"
          className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors">
          <RefreshCwIcon size={16} />
        </button>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* ── ACTIVE SHOWS ── */}
      <section>
        <Title text1="Active" text2="Shows" />

        {data.activeShows.length === 0
          ? <EmptyCard icon={PlayCircleIcon} label="No active shows yet." />
          : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
              {data.activeShows.map((show, i) => (
                <div key={show._id || i}
                  className="bg-[#120b0e] border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-colors group">

                  {/* Poster */}
                  <div className="relative overflow-hidden">
                    <img
                      src={show.movie?.posterUrl}
                      alt={show.movie?.title || "Movie"}
                      className="aspect-video w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/640x360/1a0a0f/555?text=No+Image";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-base font-semibold text-white truncate">
                      {show.movie?.title || "Unknown Movie"}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-primary font-bold text-sm">
                        {currency}{show.showPrice}
                      </span>
                      <span className="flex items-center gap-1 text-gray-400 text-xs">
                        <StarIcon className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        {show.movie?.rating || "N/A"}
                      </span>
                    </div>

                    {/* Dates & times */}
                    {show.showDateTimes?.slice(0, 2).map((dt, j) => (
                      <div key={j} className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <CalendarIcon size={11} className="text-primary/60 shrink-0" />
                        <span className="text-gray-400">{dt.date}</span>
                        <ClockIcon size={11} className="text-primary/60 shrink-0" />
                        <span>{dt.times?.join(", ")}</span>
                      </div>
                    ))}

                    <p className="text-xs text-gray-600 mt-3">
                      Added {formatDate(show.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </section>

      {/* ── RECENT BOOKINGS ── */}
      <section>
        <Title text1="Recent" text2="Bookings" />

        {data.recentBookings.length === 0
          ? <EmptyCard icon={TicketIcon} label="No bookings yet." />
          : (
            <div className="mt-4 overflow-x-auto rounded-2xl border border-white/5">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest">
                    <th className="px-5 py-4">User</th>
                    <th className="px-5 py-4">Movie</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Time</th>
                    <th className="px-5 py-4">Seats</th>
                    <th className="px-5 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.recentBookings.map((b, i) => (
                    <tr key={b._id || i} className="hover:bg-white/[0.03] transition-colors">

                      {/* User */}
                      <td className="px-5 py-4">
                        <p className="text-white font-medium truncate max-w-[130px]">
                          {b.user?.name || "—"}
                        </p>
                        <p className="text-gray-500 text-xs truncate max-w-[130px]">
                          {b.user?.email || ""}
                        </p>
                      </td>

                      {/* Movie */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {b.show?.movie?.posterUrl && (
                            <img src={b.show.movie.posterUrl} alt=""
                              className="w-8 h-8 rounded object-cover shrink-0"
                              onError={(e) => { e.target.style.display = "none"; }} />
                          )}
                          <span className="text-gray-300 truncate max-w-[140px]">
                            {b.show?.movie?.title || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-gray-400 whitespace-nowrap">
                        {b.date || "—"}
                      </td>

                      {/* Time */}
                      <td className="px-5 py-4 text-gray-400 whitespace-nowrap">
                        {formatTime(b.time)}
                      </td>

                      {/* Seats */}
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[110px]">
                          {(b.seats || []).map((seat) => (
                            <span key={seat}
                              className="px-1.5 py-0.5 bg-primary/20 text-primary text-xs rounded font-mono">
                              {seat}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4 text-right font-semibold text-white whitespace-nowrap">
                        {currency}{(b.amount || 0).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </section>
    </div>
  );
};

export default Dashboard;