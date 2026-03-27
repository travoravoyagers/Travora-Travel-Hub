import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import whiteLogo from "../assets/logo_white.png"

const LoginScreen = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email || !password) return setError("Please fill all fields");
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Invalid credentials");
      localStorage.setItem("token", data.token);
      navigate("/home");
    } catch {
      setError("Something went wrong, try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col">
      {/* Full bleed background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2070&q=80")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Gradient overlay — darker at bottom for card contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#264653]/40 via-[#264653]/50 to-[#1a2f3a]/80" />

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 items-center justify-center px-6 py-12">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-10"
        >
          <img
            src={whiteLogo}
            alt="Travora Logo"
            className="w-28 md:w-32 object-contain drop-shadow-xl"
          />
        </motion.div>

        {/* Card — self-contained, never overflows */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full bg-white rounded-[2.5rem] shadow-2xl p-10"
          style={{ maxWidth: 420 }}
        >
          {/* Heading */}
          <div className="mb-10">
            <h2 className="text-3xl font-black text-[#264653] tracking-tight">Welcome back</h2>
            <p className="text-sm text-[#264653]/50 mt-2 font-medium mb-10">Sign in to continue your journey</p>
          </div>

          {/* Form */}
          <div className="space-y-10">

            {/* Email field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#264653]/40 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#264653]/20 group-focus-within:text-[#238a7e] transition-colors" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="w-full py-4 pl-12 pr-4 rounded-2xl bg-[#f8fafb] border border-transparent text-sm text-[#264653] font-semibold placeholder:text-gray-300 outline-none focus:bg-white focus:border-[#238a7e]/30 focus:ring-4 focus:ring-[#238a7e]/5 transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#264653]/40 uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#264653]/20 group-focus-within:text-[#238a7e] transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="w-full py-4 pl-12 pr-4 rounded-2xl bg-[#f8fafb] border border-transparent text-sm text-[#264653] font-semibold placeholder:text-gray-300 outline-none focus:bg-white focus:border-[#238a7e]/30 focus:ring-4 focus:ring-[#238a7e]/5 transition-all"
                />
              </div>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-50/50 p-4 rounded-2xl border border-red-100"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Login button */}
            <motion.button
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-5 rounded-2xl text-white text-sm font-black tracking-widest uppercase shadow-xl shadow-[#238a7e]/20 flex items-center justify-center gap-2 disabled:opacity-60 transition-all mt-4"
              style={{ background: "linear-gradient(135deg, #264653 0%, #238a7e 100%)" }}
            >
              {loading
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                : "Sign In"
              }
            </motion.button>
          </div>

          {/* Register link */}
          <p className="text-center text-[#264653]/40 text-xs font-bold uppercase tracking-wider mt-10">
            New here?{" "}
            <Link to="/register" className="text-[#af8d4a] hover:text-[#238a7e] transition-colors border-b-2 border-[#af8d4a]/20">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginScreen;
