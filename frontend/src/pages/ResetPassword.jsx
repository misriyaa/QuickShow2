import { useRef, useState, useContext } from "react"; // Added useContext
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContent";

import {
  Truck,
  Mail,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

export default function ResetPassword() {
  // Access backendUrl from Context
  const { backendUrl } = useContext(AppContent);

  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Use backendUrl and correct path
      const { data } = await axios.post(backendUrl + "/api/auth/send-reset-otp", { email });
      if (data.success) {
        toast.success("OTP sent to your email!");
        setStep(2);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // OTP input handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleOtpNext = () => {
    if (otp.join("").length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }
    setStep(3);
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      // Use backendUrl and include /api/auth/ segment
      const { data } = await axios.post(backendUrl + "/api/auth/reset-password", {
        email,
        otp: otp.join(""),
        newPassword,
      });
      if (data.success) {
        setDone(true);
      } else {
        toast.error(data.message);
        if (data.message?.toLowerCase().includes("otp")) {
          setOtp(["", "", "", "", "", ""]);
          setStep(2);
        }
      }
    } catch (error) {
      toast.error("Reset failed");
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ["Enter Email", "Verify OTP", "New Password"];

  return (
 <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* Navbar Section */}
      <div className="bg-transparent border-b border-white/10 px-6 md:px-16 lg:px-36 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1">
            <span className="text-[#FF4D67] text-3xl font-bold">Q</span>
            <span className="text-white text-xl font-semibold tracking-tight">uickShow</span>
        </Link>
        <Link
          to="/login"
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-semibold transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
          {done ? (
            <div className="text-center">
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                  <CheckCircle2 size={52} className="text-green-500" />
                </div>
              </div>
              <h1 className="text-3xl font-extrabold text-white mb-3">
                Password Reset!
              </h1>
              <p className="text-gray-400 mb-8">
                Your password has been successfully updated.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-[#FF4D67] hover:bg-[#ff3653] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#FF4D67]/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                Sign In Now
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 bg-[#FF4D67]/10 rounded-full flex items-center justify-center border border-[#FF4D67]/20">
                  <ShieldCheck size={40} className="text-[#FF4D67]" />
                </div>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-white mb-2">
                  Reset Password
                </h1>
                <p className="text-gray-400 text-sm">
                  {step === 1 && "Enter your registered email to receive an OTP"}
                  {step === 2 && "Enter the 6-digit code sent to your email"}
                  {step === 3 && "Set a new password for your account"}
                </p>
              </div>

              {/* Step Indicator */}
              <div className="flex items-center justify-center gap-2 mb-10">
                {stepLabels.map((label, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all border ${
                          i + 1 < step
                            ? "bg-green-500 border-green-500 text-white"
                            : i + 1 === step
                            ? "bg-[#FF4D67] border-[#FF4D67] text-white shadow-lg shadow-[#FF4D67]/30"
                            : "bg-white/5 border-white/10 text-gray-500"
                        }`}
                      >
                        {i + 1 < step ? "✓" : i + 1}
                      </div>
                      <span className={`text-[10px] mt-1 font-semibold whitespace-nowrap ${i + 1 === step ? "text-[#FF4D67]" : "text-gray-600"}`}>
                        {label}
                      </span>
                    </div>
                    {i < 2 && (
                      <div className={`w-12 h-0.5 mb-5 ${i + 1 < step ? "bg-green-500" : "bg-white/10"}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1 Form */}
              {step === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-[#FF4D67] text-white placeholder-gray-600 transition-all"
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-[#FF4D67] hover:bg-[#ff3653] disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#FF4D67]/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Send OTP"}
                  </button>
                </form>
              )}

              {/* Step 2 Form */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex gap-3 justify-center" onPaste={handleOtpPaste}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className={`w-12 h-14 text-center text-xl font-black border rounded-xl outline-none transition-all duration-300
                          ${digit ? "border-[#FF4D67] bg-[#FF4D67]/10 text-white" : "border-white/10 bg-black/40 text-white"} 
                          focus:border-[#FF4D67] focus:bg-[#FF4D67]/5`}
                      />
                    ))}
                  </div>
                  <button onClick={handleOtpNext} className="w-full bg-[#FF4D67] hover:bg-[#ff3653] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#FF4D67]/20 flex items-center justify-center gap-2 active:scale-[0.98]">
                    Continue <ArrowRight size={18} />
                  </button>
                  <button onClick={() => setStep(1)} className="w-full text-gray-500 text-sm font-semibold flex items-center justify-center gap-2 hover:text-white transition-colors">
                    <ArrowLeft size={14} /> Change Email
                  </button>
                </div>
              )}

              {/* Step 3 Form */}
              {step === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">New Password</label>
                    <div className="relative">
                      <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        placeholder="Minimum 6 characters"
                        className="w-full pl-11 pr-12 py-3.5 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-[#FF4D67] text-white transition-all"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">Confirm Password</label>
                    <div className="relative">
                      <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-[#FF4D67] text-white transition-all"
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-[#FF4D67] hover:bg-[#ff3653] disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#FF4D67]/20 transition-all active:scale-[0.98]">
                    {loading ? "Processing..." : "Reset Password"}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}