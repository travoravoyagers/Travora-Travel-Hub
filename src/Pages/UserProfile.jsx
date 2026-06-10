import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, MapPin, Calendar, Clock, User } from "lucide-react";
import axios from "axios";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [profRes, tripsRes] = await Promise.all([
        axios.get(`${API_URL}/api/user/${userId}`, { headers }),
        axios.get(`${API_URL}/api/user/${userId}/trips`, { headers })
      ]);
      setProfile(profRes.data);
      setTrips(tripsRes.data.trips);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-[#fcf9f2] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#238a7e] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getTripDays = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    return Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-[#fcf9f2] text-[#264653] pb-32">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-[#fcf9f2]/80 backdrop-blur-md px-4 py-4 flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-2xl shadow-sm border border-white/40 hover:bg-gray-50"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        <h1 className="text-xl font-extrabold truncate flex-1 tracking-tight text-[#264653]">
          {profile.name}&apos;s Profile
        </h1>
      </div>

      <div className="px-4 py-4 space-y-8 max-w-2xl mx-auto">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-[#264653]/5 border border-white/40 flex flex-col items-center"
        >
          <div className="w-24 h-24 rounded-[2rem] bg-gray-100 flex items-center justify-center overflow-hidden ring-4 ring-[#238a7e]/10 shadow-lg mb-4">
            {profile.profileImage ? (
              <img src={profile.profileImage} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-gray-400" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-[#264653]">{profile.name}</h2>
          <p className="text-xs font-bold text-[#264653]/40 uppercase tracking-widest mt-1">Voyager</p>

          <div className="grid grid-cols-2 gap-4 w-full mt-6">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
              <div className="text-[10px] font-bold text-[#264653]/40 uppercase tracking-widest mb-1">Trips</div>
              <div className="text-xl font-bold text-[#238a7e]">{profile.tripCount || trips.length}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
              <div className="text-[10px] font-bold text-[#264653]/40 uppercase tracking-widest mb-1">Joined</div>
              <div className="text-sm font-bold text-[#264653] mt-1">{new Date(profile.joinedDate).getFullYear()}</div>
            </div>
          </div>
        </motion.div>

        {/* Public Trips Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2 px-2">
            <MapPin className="w-4 h-4 text-[#af8d4a]" />
            <h3 className="font-bold text-sm uppercase tracking-widest text-[#264653]/40">Public Trips</h3>
          </div>

          {trips.length === 0 ? (
             <div className="text-center py-8 bg-white/50 rounded-3xl border border-dashed border-[#264653]/20 text-[#264653]/40 text-sm">
               No public trips yet
             </div>
          ) : (
            trips.map((trip, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={trip.id}
                onClick={() => navigate(`/profile/${userId}/trips/${trip.id}`)}
                className="group bg-white rounded-3xl p-5 shadow-lg shadow-[#264653]/5 border border-white/40 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#264653] text-lg group-hover:text-[#238a7e] transition-colors">
                    {trip.title}
                  </h4>
                  <div className="bg-blue-50 text-blue-500 text-[10px] font-black uppercase px-2 py-1 rounded-full">
                    Public
                  </div>
                </div>
                {trip.description && (
                  <p className="text-sm text-[#264653]/60 mb-4 line-clamp-2">{trip.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs font-semibold text-[#264653]/60 bg-gray-50 p-3 rounded-2xl">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#af8d4a]" />
                    {formatDate(trip.start_date)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#af8d4a]" />
                    {getTripDays(trip.start_date, trip.end_date)} Days
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
