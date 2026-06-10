import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, UserPlus, MessageCircle, MoreVertical, Star, Compass, Check, X, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Friends = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [requestedMap, setRequestedMap] = useState({}); // To track which users we just sent requests to

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const [sugRes, reqRes, friRes] = await Promise.all([
        axios.get(`${API_URL}/api/friends/suggestions`, { headers }),
        axios.get(`${API_URL}/api/friends/requests`, { headers }),
        axios.get(`${API_URL}/api/friends`, { headers })
      ]);

      setSuggestions(sugRes.data);
      setRequests(reqRes.data);
      setFriends(friRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      await axios.post(
        `${API_URL}/api/friends/request`,
        { receiverId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequestedMap((prev) => ({ ...prev, [userId]: true }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await axios.post(
        `${API_URL}/api/friends/accept`,
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.post(
        `${API_URL}/api/friends/reject`,
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const navigateToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="w-full px-4">
      {/* Search Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-[#264653] tracking-tight mb-4">Voyagers</h2>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#264653]/40 group-focus-within:text-[#238a7e] transition-colors" />
          <input 
            type="text" 
            placeholder="Search fellow travelers..." 
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm outline-none border border-white focus:ring-2 focus:ring-[#238a7e]/20 transition-all text-sm font-medium"
          />
        </div>
      </div>

      {/* Suggested Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 px-2">
          <Compass className="w-4 h-4 text-[#af8d4a]" />
          <h3 className="font-bold text-sm uppercase tracking-widest text-[#264653]/40">Suggested for you</h3>
        </div>
        
        {suggestions.length === 0 ? (
          <div className="text-center py-6 bg-white/50 rounded-3xl border border-dashed border-[#264653]/20 text-[#264653]/40 text-sm">
            No suggestions at the moment
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
            {suggestions.map((user) => (
              <motion.div 
                key={user.id}
                whileHover={{ y: -5 }}
                className="min-w-[140px] bg-white p-5 rounded-[2.5rem] shadow-lg shadow-[#264653]/5 flex flex-col items-center text-center border border-white/40 cursor-pointer"
                onClick={() => navigateToProfile(user.id)}
              >
                <div className="relative mb-3">
                  <div className="w-16 h-16 rounded-2xl bg-[#238a7e]/10 flex items-center justify-center overflow-hidden ring-4 ring-white shadow-md">
                     {user.profileImage ? (
                       <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                     ) : (
                       <User className="w-8 h-8 text-[#238a7e]" />
                     )}
                  </div>
                  {!requestedMap[user.id] && (
                    <div className="absolute -bottom-1 -right-1 bg-[#af8d4a] p-1 rounded-lg border-2 border-white">
                      <UserPlus className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
                <p className="font-bold text-[#264653] text-[10px] mb-2 truncate w-full">{user.name || "Adventurer"}</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!requestedMap[user.id]) handleSendRequest(user.id);
                  }}
                  className={`text-[8px] font-black uppercase tracking-tighter px-3 py-1.5 rounded-full transition-colors ${
                    requestedMap[user.id] ? "bg-gray-100 text-gray-400" : "bg-[#238a7e]/10 text-[#238a7e] hover:bg-[#238a7e]/20"
                  }`}
                >
                  {requestedMap[user.id] ? "REQUESTED" : "FOLLOW"}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Friend Requests Section */}
      {requests.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 px-2">
             <UserPlus className="w-4 h-4 text-[#af8d4a]" />
             <h3 className="font-bold text-sm uppercase tracking-widest text-[#264653]/40">Friend Requests</h3>
          </div>

          <div className="space-y-4">
            {requests.map((req) => (
              <motion.div
                key={req.id}
                className="group bg-white p-4 rounded-3xl shadow-xl shadow-[#264653]/5 border border-white/40 flex items-center justify-between cursor-pointer"
                onClick={() => navigateToProfile(req.sender.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden ring-2 ring-gray-50 shadow-sm">
                    {req.sender.profileImage ? (
                      <img src={req.sender.profileImage} alt={req.sender.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#264653] text-sm">{req.sender.name || "Adventurer"}</h4>
                    <p className="text-[10px] text-[#264653]/50 font-medium">wants to connect</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); handleAccept(req.id); }}
                    className="p-3 bg-[#238a7e]/10 text-[#238a7e] hover:bg-[#238a7e]/20 rounded-2xl transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </motion.button>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); handleReject(req.id); }}
                    className="p-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-2xl transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="space-y-4 pb-32">
        <div className="flex items-center gap-2 mb-4 px-2">
           <Star className="w-4 h-4 text-[#af8d4a]" />
           <h3 className="font-bold text-sm uppercase tracking-widest text-[#264653]/40">My Friends</h3>
        </div>

        {friends.length === 0 ? (
          <div className="text-center py-8 bg-white/50 rounded-3xl border border-dashed border-[#264653]/20 text-[#264653]/40 text-sm">
            No friends yet
          </div>
        ) : (
          friends.map((friend, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={friend.id}
              className="group bg-white p-4 rounded-3xl shadow-xl shadow-[#264653]/5 border border-white/40 flex items-center justify-between cursor-pointer"
              onClick={() => navigateToProfile(friend.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden ring-2 ring-gray-50 shadow-sm">
                  {friend.profileImage ? (
                    <img src={friend.profileImage} alt={friend.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-[#264653] text-sm">{friend.name || "Adventurer"}</h4>
                  <div className="flex items-center gap-1.5 capitalize text-[10px] font-semibold text-[#238a7e] bg-[#238a7e]/5 px-2 py-0.5 rounded-full mt-1 w-fit">
                     <span className="w-1 h-1 rounded-full bg-[#238a7e] animate-pulse" />
                     Voyager
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); navigate(`/chat/${friend.id}`); }}
                  className="p-3 bg-gray-50 text-[#264653] hover:text-[#238a7e] rounded-2xl transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </motion.button>
                <button className="p-3 text-[#264653]/10 hover:text-[#264653]/40 transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Friends;
