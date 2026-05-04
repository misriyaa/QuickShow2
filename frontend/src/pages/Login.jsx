import { useState, useContext } from "react"; // Added useContext
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContent"; // Import the Context object
import { Eye, EyeOff, Truck, ArrowRight, User, Mail, Lock } from "lucide-react";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const navigate = useNavigate();

  // FIX: Use useContext with your AppContent instead of the undefined useAppContext
  const { setIsLoggedin, getUserData, backendUrl } = useContext(AppContent);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // FIX: Ensure axios defaults are set for cookies
      axios.defaults.withCredentials = true;

      const endpoint = isSignUp ? "/api/auth/register" : "/api/auth/login";
      const payload = isSignUp
        ? { name: form.name, email: form.email, password: form.password }
        : { email: form.email, password: form.password };

      // FIX: Prefix the endpoint with your backendUrl from context
      const { data } = await axios.post(backendUrl + endpoint, payload);

      if (data.success) {
        toast.success(isSignUp ? "Account created! Welcome 🎉" : "Welcome back!");
        setIsLoggedin(true);
        await getUserData();
        navigate("/"); // Redirect to Home or Dashboard
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
      
      <div className="w-full max-w-md z-10">
        {/* Logo Section */}
        <div className="mb-10 flex flex-col items-center">
          <Link to="/" className="flex items-center gap-1 mb-2">
            <span className="text-primary text-4xl font-bold">Q</span>
            <span className="text-white text-2xl font-semibold tracking-tight">uickShow</span>
          </Link>
          <p className="text-gray-500 text-sm">Elevate your cinema experience</p>
        </div>

        {/* Form Container (Glassmorphism) */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          {/* Toggle Tab */}
          <div className="flex bg-black/40 rounded-2xl p-1 mb-8 border border-white/5">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${!isSignUp ? "bg-primary text-white shadow-lg" : "text-gray-500 hover:text-gray-300"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${isSignUp ? "bg-primary text-white shadow-lg" : "text-gray-500 hover:text-gray-300"}`}
            >
              Join Now
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" />
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
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" />
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
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" />
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
                <Link to="/reset-password" name="reset-password" className="text-xs text-primary hover:underline">Forgot Password?</Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-[#ff3653] disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{isSignUp ? "Create Account" : "Sign In"} <ArrowRight size={18} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
