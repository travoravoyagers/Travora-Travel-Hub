import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Briefcase, Users, User, Bell, LogOut } from "lucide-react";

// Tab screens
import Feed from "./Feed";
import Trips from "./Trips";
import MyProfile from "./MyProfile";
import Friends from "./Friends";

const HomeScreen = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("feed");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "feed": return <Feed />;
      case "trips": return <Trips />;
      case "friends": return <Friends />;
      case "profile": return <MyProfile />;
      default: return <Feed />;
    }
  };

  const navItems = [
    { id: "feed", label: "Home", icon: Home },
    { id: "trips", label: "Trips", icon: Briefcase },
    { id: "friends", label: "Friends", icon: Users },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="relative min-h-screen bg-[#fcf9f2]">
      
      {/* Top Navbar */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 w-full z-50 px-4 pt-4"
      >
        <div className="glass rounded-2xl p-4 flex justify-between items-center shadow-lg border border-white/40">
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-inner">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            {/* <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent tracking-tight">Travora</h1> */}
          </div>

          <div className="flex gap-2 items-center">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-xl bg-white/50 text-[#264653] hover:text-[#238a7e] transition-colors"
            >
              <Bell className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Scrollable Content */}
      <main className="pt-28 pb-32 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modern Bottom Navigation */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 w-full z-50 px-6 pb-6"
      >
        <div className="glass rounded-3xl p-2 flex justify-around items-center shadow-2xl border border-white/20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="relative flex items-center justify-center py-3 px-6 transition-all"
              >
                <div className="flex flex-col items-center">
                  <Icon 
                    className={`w-6 h-6 transition-all duration-300 ${
                      isActive ? "text-[#238a7e] -translate-y-1" : "text-[#264653]/40"
                    }`} 
                  />
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabPill"
                      className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#238a7e]"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

    </div>
  );
};

export default HomeScreen;

