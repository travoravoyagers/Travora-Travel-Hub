import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, LogOut, Grid, Bookmark, MapPin, Edit2, ShieldCheck, ChevronRight, X, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changing, setChanging] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const posts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=500&q=80",
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const closeChangePasswordPopup = () => {
    setShowChangePwd(false);
    setCurrentPassword("");
    setNewPassword("");
    setPwdError("");
    setPwdSuccess("");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess("");

    if (!currentPassword || !newPassword) {
      setPwdError("Please fill both fields");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      setChanging(true);
      const res = await fetch(`${API_URL}/api/user/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPwdError(data.message || "Failed to change password");
        return;
      }

      setPwdSuccess("Password updated successfully!");
      setTimeout(closeChangePasswordPopup, 1500);
    } catch (error) {
      setPwdError("Something went wrong");
    } finally {
      setChanging(false);
    }
  };

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        setLoadingUser(true);
        const res = await fetch(`${API_URL}/api/auth/me`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) {
          localStorage.removeItem("token");
          return navigate("/login");
        }
        setUser(data.user);
      } catch (err) {
        navigate("/login");
      } finally {
        setLoadingUser(false);
      }
    };
    fetchMe();
  }, [API_URL, navigate]);

  return (
    <div className="w-full px-4">
      {/* Profile Header Card */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-[#264653]/5 border border-white/40 overflow-hidden mb-8">
        {/* Cover Gradient/Image */}
        <div className="h-32 bg-gradient-primary w-full relative">
          <div className="absolute inset-0 bg-black/10" />
        </div>
        
        <div className="px-6 pb-6 relative">
          {/* Avatar & Action Button */}
          <div className="flex justify-between items-end -mt-12 mb-4">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=200&q=80"
                alt="Profile"
                className="w-24 h-24 rounded-[2rem] object-cover ring-4 ring-white shadow-lg"
              />
              <div className="absolute bottom-0 right-0 bg-[#238a7e] p-1.5 rounded-xl border-2 border-white shadow-sm">
                <ShieldCheck className="w-3 h-3 text-white" />
              </div>
            </motion.div>
            
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-gray-50 text-[#264653] hover:bg-gray-100 rounded-2xl transition-all"
                onClick={() => setShowChangePwd(true)}
              >
                <Settings className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-[#264653] text-white rounded-2xl font-bold text-sm shadow-lg shadow-[#264653]/20"
              >
                Edit Profile
              </motion.button>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-[#264653]">
              {loadingUser ? "Loading..." : user?.name || "Global Voyager"}
            </h2>
            <div className="flex items-center gap-1 text-[#264653]/40 text-sm font-medium">
              <MapPin className="w-3.5 h-3.5" />
              Add your location
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-8 mt-6 pt-6 border-t border-gray-50">
            <div>
              <div className="text-xl font-bold text-[#264653]">{posts.length}</div>
              <div className="text-[10px] uppercase font-bold text-[#264653]/40 tracking-widest">Adventures</div>
            </div>
            <div>
              <div className="text-xl font-bold text-[#264653]">1.2k</div>
              <div className="text-[10px] uppercase font-bold text-[#264653]/40 tracking-widest">Followers</div>
            </div>
            <div>
              <div className="text-xl font-bold text-[#264653]">452</div>
              <div className="text-[10px] uppercase font-bold text-[#264653]/40 tracking-widest">Following</div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings Section */}
      <div className="bg-white rounded-[2rem] p-4 shadow-xl shadow-[#264653]/5 border border-white/40 mb-8">
        <h3 className="text-sm font-bold text-[#264653]/40 uppercase tracking-widest mb-4 px-2">Account</h3>
        <div className="space-y-2">
          <button className="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-2xl transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-500 rounded-xl">
                <Bookmark className="w-5 h-5" />
              </div>
              <span className="font-bold text-[#264653] text-sm">Saved Places</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#264653]/20" />
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full flex justify-between items-center p-4 hover:bg-red-50 rounded-2xl transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 text-red-500 rounded-xl">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="font-bold text-[#264653] text-sm">Logout</span>
            </div>
          </button>
        </div>
      </div>

      {/* Grid Tabs */}
      <div className="flex gap-4 mb-4 items-center">
        <button className="flex items-center gap-2 px-6 py-2 bg-[#238a7e]/10 text-[#238a7e] rounded-full text-xs font-bold">
          <Grid className="w-4 h-4" /> Posts
        </button>
      </div>

      {/* Post Grid */}
      <div className="grid grid-cols-2 gap-3 pb-32">
        {posts.map((post, idx) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            key={post.id}
            className="aspect-square rounded-3xl overflow-hidden shadow-lg border-2 border-white cursor-pointer group"
          >
            <img
              src={post.image}
              alt={`Post ${post.id}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </motion.div>
        ))}
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showChangePwd && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeChangePasswordPopup}
              className="absolute inset-0 bg-[#264653]/40 backdrop-blur-sm"
            />
            <motion.form
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onSubmit={handleChangePassword}
              className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl"
            >
              <div className="text-center mb-6">
                 <div className="w-16 h-16 bg-[#af8d4a]/10 text-[#af8d4a] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-bold text-[#264653]">Update Security</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#264653] uppercase ml-1">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#238a7e]/30"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#264653] uppercase ml-1">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#238a7e]/30"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                {pwdError && <div className="text-xs text-red-500 font-bold text-center mt-2">{pwdError}</div>}
                {pwdSuccess && <div className="text-xs text-green-500 font-bold text-center mt-2">{pwdSuccess}</div>}

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={closeChangePasswordPopup}
                    className="flex-1 py-4 bg-gray-50 text-[#264653] rounded-2xl font-bold text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={changing}
                    className="flex-1 py-4 bg-[#264653] text-white rounded-2xl font-bold text-sm shadow-lg shadow-[#264653]/20"
                  >
                    {changing ? "..." : "Save"}
                  </button>
                </div>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyProfile;

