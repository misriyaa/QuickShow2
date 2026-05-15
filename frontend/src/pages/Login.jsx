import { useState, useContext } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContent";
import axiosInstance from "../library/axios";
import { Eye, EyeOff, ArrowRight, User, Mail, Lock } from "lucide-react";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const navigate = useNavigate();

  const { saveToken, setUserData, isLoggedin, userData, isLoading } = useContext(AppContent);

  if (isLoading) return null;

  if (isLoggedin && userData) {
    return <Navigate to={userData?.isAdmin ? "/admin" : "/"} replace />;
  }

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isSignUp ? "/api/auth/register" : "/api/auth/login";
      const payload = isSignUp
        ? { name: form.name, email: form.email, password: form.password }
        : { email: form.email, password: form.password };

      const { data } = await axiosInstance.post(endpoint, payload);

      if (data.success) {
        saveToken(data.token);

        const me = await axiosInstance.get("/api/user/data", {
          headers: { Authorization: `Bearer ${data.token}` },
        });

        if (me.data.success) {
          setUserData(me.data.userData);
          toast.success(isSignUp ? "Account created! Welcome 🎉" : "Welcome back!");
          navigate(me.data.userData?.isAdmin ? "/admin" : "/");
        } else {
          toast.error("Failed to load user data");
        }
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md z-10">
        <div className="mb-10 flex flex-col items-center">
          <Link to="/" className="flex items-center gap-1 mb-2">
            <span className="text-primary text-4xl font-bold">Q</span>
            <span className="text-white text-2xl font-semibold tracking-tight">
              uickShow
            </span>
          </Link>
          <p className="text-gray-500 text-sm">Elevate your cinema experience</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="flex bg-black/40 rounded-2xl p-1 mb-8 border border-white/5">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                !isSignUp ? "bg-primary text-white shadow-lg" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                isSignUp ? "bg-primary text-white shadow-lg" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Join Now
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="relative group">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors"
                />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-primary text-white placeholder-gray-600 transition-all"
                />
              </div>
            )}

            <div className="relative group">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-primary text-white placeholder-gray-600 transition-all"
              />
            </div>

            <div className="relative group">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors"
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="w-full pl-12 pr-12 py-3.5 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-primary text-white placeholder-gray-600 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {!isSignUp && (
              <div className="text-right">
                <Link
                  to="/reset-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-[#ff3653] disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isSignUp ? "Create Account" : "Sign In"} <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}