import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContent";

import { MailCheck, Truck, ArrowLeft, RefreshCw } from "lucide-react";

export default function EmailVerify() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { userData, isLoggedin, getUserData } = useAppContext();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedin) {
      navigate("/login");
    }
  }, [isLoggedin]);

  // Redirect if already verified
  useEffect(() => {
    if (userData?.isAccountVerified) {
      navigate("/dashboard");
    }
  }, [userData]);

  // Send OTP on page load
  useEffect(() => {
    if (isLoggedin && userData && !userData.isAccountVerified) {
      sendOtp();
    }
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const sendOtp = async () => {
    setResending(true);
    try {
      const { data } = await axios.post("/api/auth/send-verify-otp");
      if (data.success) {
        toast.success("OTP sent to your email!");
        setCountdown(60);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setResending(false);
    }
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/verify-account", {
        otp: otpString,
      });
      if (data.success) {
        toast.success("Email verified successfully! 🎉");
        await getUserData();
        navigate("/dashboard");
      } else {
        toast.error(data.message);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch {
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 relative">
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
      
      <div className="w-full max-w-md z-10 bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] text-center shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
            <MailCheck size={40} className="text-primary" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">Verify Account</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          We’ve sent a code to your inbox. <br/> Enter it below to unlock your access.
        </p>

        <div className="flex gap-3 justify-center mb-8" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-12 h-14 text-center text-xl font-bold border rounded-xl outline-none transition-all duration-300
                ${digit ? "border-primary bg-primary/10 text-white" : "border-white/10 bg-black/40 text-white"}
                focus:border-primary focus:shadow-[0_0_15px_rgba(255,77,103,0.3)]`}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || otp.join("").length !== 6}
          className="w-full bg-primary hover:bg-[#ff3653] disabled:opacity-40 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 mb-6"
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>

        {countdown > 0 ? (
          <p className="text-gray-600 text-xs italic">Resend available in {countdown}s</p>
        ) : (
          <button onClick={sendOtp} disabled={resending} className="text-primary text-sm font-semibold hover:underline flex items-center gap-2 mx-auto">
            <RefreshCw size={14} className={resending ? "animate-spin" : ""} /> Resend OTP
          </button>
        )}
      </div>
    </div>
  );
}
