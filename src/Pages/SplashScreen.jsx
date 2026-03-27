import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem("token");
      if (token) navigate("/home");
      else navigate("/login");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center overflow-hidden relative px-6">
      
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-[#af8d4a]/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-[#238a7e]/30 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 text-center">

        {/* Logo */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <img 
            src={logo} 
            alt="Travora Logo"
            className="w-20 h-20 object-contain drop-shadow-xl"
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-5xl font-black text-white tracking-[0.2em] uppercase"
        >
          Travora
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="h-[2px] bg-[#af8d4a] w-14 mx-auto rounded-full mt-4"
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-white/50 text-xs font-semibold tracking-[0.4em] uppercase mt-6"
        >
          Your Travel Hub
        </motion.p>

      </div>
    </div>
  );
};

export default SplashScreen;