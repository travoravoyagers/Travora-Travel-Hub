import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Mail, Lock, User, Phone, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const RegisterScreen = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailRegex.test(email) ? "" : "Please enter a valid email address");
  };

  const validateName = (name) => {
    setNameError(name.trim() ? "" : "Full name is required");
  };

  const validateMobile = (mobile) => {
    setMobileError(/^\d{10}$/.test(mobile) ? "" : "Enter a valid 10-digit mobile number");
  };

  const handleRegister = async () => {
    setError("");
    validateName(formData.name);
    validateEmail(formData.email);
    validateMobile(formData.mobile);

    if (nameError || emailError || mobileError) return;

    if (formData.password.length < 8) {
      return setError("Password must be at least 8 characters long.");
    }

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match!");
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password,
    };

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.message || "Registration failed");
      }

      navigate("/login");

    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#264653]/70 to-[#238a7e]/90" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="glass rounded-3xl p-8 shadow-2xl my-8">
          <div className="text-center mb-6">
            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <UserPlus className="text-white w-8 h-8" />
            </motion.div>
            <h2 className="text-3xl font-bold text-[#12213e] tracking-tight">Join Travora</h2>
            <p className="text-[#264653]/70 mt-1">Start your global exploration today</p>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-[#264653] uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#264653]/40 group-focus-within:text-[#238a7e] transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-[#238a7e]/50 focus:bg-white transition-all text-[#12213e]"
                  value={formData.name}
                  onChange={(e) => {
                    handleChange(e);
                    setNameError("");
                  }}
                  onBlur={() => validateName(formData.name)}
                  required
                />
              </div>
              {nameError && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{nameError}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#264653] uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#264653]/40 group-focus-within:text-[#238a7e] transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-[#238a7e]/50 focus:bg-white transition-all text-[#12213e]"
                  value={formData.email}
                  onChange={(e) => {
                    handleChange(e);
                    setEmailError("");
                  }}
                  onBlur={() => validateEmail(formData.email)}
                  required
                />
              </div>
              {emailError && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{emailError}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#264653] uppercase tracking-wider ml-1">Mobile</label>
              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#264653]/40 group-focus-within:text-[#238a7e] transition-colors" />
                <input
                  type="tel"
                  name="mobile"
                  placeholder="10-digit number"
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-[#238a7e]/50 focus:bg-white transition-all text-[#12213e]"
                  value={formData.mobile}
                  onChange={(e) => {
                    handleChange(e);
                    setMobileError("");
                  }}
                  onBlur={() => validateMobile(formData.mobile)}
                  required
                />
              </div>
              {mobileError && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{mobileError}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#264653] uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#264653]/40 group-focus-within:text-[#238a7e] transition-colors" />
                <input
                  type="password"
                  name="password"
                  placeholder="Min. 8 chars"
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-[#238a7e]/50 focus:bg-white transition-all text-[#12213e]"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#264653] uppercase tracking-wider ml-1">Confirm</label>
              <div className="relative group">
                <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#264653]/40 group-focus-within:text-[#238a7e] transition-colors" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat password"
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-[#238a7e]/50 focus:bg-white transition-all text-[#12213e]"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] uppercase font-bold text-center flex items-center justify-center gap-2 md:col-span-2"
                >
                  <AlertCircle className="w-3 h-3" /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="button"
              disabled={loading}
              className="w-full py-4 bg-gradient-primary text-white rounded-xl font-bold shadow-lg shadow-[#238a7e]/20 flex items-center justify-center gap-2 disabled:opacity-70 transition-all mt-4 md:col-span-2"
              onClick={handleRegister}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Travel Profile"
              )}
            </motion.button>
          </form>

          <p className="text-center mt-6 text-[#264653]/70 font-medium">
            Already a voyager?{" "}
            <Link
              className="text-[#af8d4a] hover:text-[#238a7e] transition-colors underline decoration-2 underline-offset-4"
              to="/login"
            >
              Log in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterScreen;

