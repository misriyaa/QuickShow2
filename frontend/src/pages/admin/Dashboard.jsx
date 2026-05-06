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

// ── helpers ──────────────────────────────────────────────────────────────────
const currency = "₹";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (timeStr) => {
  if (!timeStr) return "—";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${m} ${ampm}`;
};

// ── empty state ───────────────────────────────────────────────────────────────
const EmptyState = ({ icon: Icon, label }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-600 gap-3">
    <Icon size={40} className="opacity-30" />
    <p className="text-sm">{label}</p>
  </div>
);

// ── stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, sub }) => (
  <div className="bg-primary/10 border border-primary/20 p-5 rounded-2xl flex items-center gap-4 hover:bg-primary/15 transition-colors">
    <div className="p-3 bg-primary/20 rounded-xl text-primary shrink-0">
      <Icon size={26} />
    </div>
    <div>
      <p className="text-gray-400 text-xs uppercase tracking-widest mb-0.5">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-gray-500 text-xs mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ── main component ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUsers: 0,
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get("/api/dashboard/data", {
        withCredentials: true,
      });

      if (res.data.success) {
        const d = res.data.dashboard;
        setDashboardData({
          totalBookings: d.totalBookings ?? 0,
          totalRevenue: d.totalRevenue ?? 0,
          activeShows: d.activeShows ?? [],
          totalUsers: d.totalUsers ?? 0,
          recentBookings: d.recentBookings ?? [],
        });
      } else {
        setError(res.data.message || "Failed to load dashboard data.");
      }
    } catch (err) {
      setError("Could not reach the server. Please try again.");
      console.error("Dashboard fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Bookings",
      value: dashboardData.totalBookings,
      icon: ChartLineIcon,
    },
    {
      title: "Total Revenue",
      value: `${currency}${dashboardData.totalRevenue.toLocaleString("en-IN")}`,
      icon: CircleDollarSignIcon,
    },
    {
      title: "Active Shows",
      value: dashboardData.activeShows.length,
      icon: PlayCircleIcon,
    },
    {
      title: "Total Users",
      value: dashboardData.totalUsers,
      icon: UsersIcon,
    },
  ];

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-400 text-sm">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm transition-colors"
        >
          <RefreshCwIcon size={14} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <Title text1="Admin" text2="Dashboard" />
        <button
          onClick={fetchDashboardData}
          title="Refresh"
          className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <RefreshCwIcon size={16} />
        </button>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      {/* ── ACTIVE SHOWS ── */}
      <section>
        <Title text1="Active" text2="Shows" />

        {dashboardData.activeShows.length === 0 ? (
          <EmptyState icon={PlayCircleIcon} label="No active shows yet." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
            {dashboardData.activeShows.map((show, i) => (
              <div
                key={show._id || i}
                className="bg-[#120b0e] border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-colors group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={show.movie?.posterUrl || "/placeholder.jpg"}
                    alt={show.movie?.title}
                    className="aspect-video object-cover w-full group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/640x360/1a0a0f/555?text=No+Image";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="p-4">
                  <p className="text-base font-semibold truncate text-white">
                    {show.movie?.title || "Unknown Movie"}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-primary font-bold text-sm">
                      {currency}
                      {show.showPrice}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400 text-xs">
                      <StarIcon className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      {show.movie?.rating || "N/A"}
                    </span>
                  </div>

                  {/* Show dates & times */}
                  {show.showDateTimes?.length > 0 && (
                    <div className="mt-3 flex flex-col gap-1.5">
                      {show.showDateTimes.slice(0, 2).map((dt, j) => (
                        <div key={j} className="flex items-start gap-2 text-xs text-gray-500">
                          <CalendarIcon size={12} className="mt-0.5 shrink-0 text-primary/60" />
                          <span className="font-medium text-gray-400 mr-1">
                            {dt.date}
                          </span>
                          <ClockIcon size={12} className="mt-0.5 shrink-0 text-primary/60" />
                          <span>{dt.times?.join(", ")}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-gray-600 mt-3">
                    Added {formatDate(show.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

     
    </div>
  );
};

export default Dashboard;