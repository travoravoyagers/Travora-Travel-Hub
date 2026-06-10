import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit3, Calendar, MapPin, X, Info, ChevronRight, Clock } from "lucide-react";
import axios from "axios";

const Trips = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [ongoingTrips, setOngoingTrips] = useState([]);
  const [historyTrips, setHistoryTrips] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [invites, setInvites] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: ""
  });

  const token = localStorage.getItem("token");
  const todayDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchTrips();
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/trips/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJoinRequests(res.data.joinRequests);
      setInvites(res.data.invites);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTrips = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/trips`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const trips = res.data.trips;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcoming = [];
      const ongoing = [];
      const history = [];

      trips.forEach(trip => {
        const start = new Date(trip.start_date);
        const end = new Date(trip.end_date);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        if (today < start) upcoming.push(trip);
        else if (today >= start && today <= end) ongoing.push(trip);
        else history.push(trip);
      });

      setUpcomingTrips(upcoming);
      setOngoingTrips(ongoing);
      setHistoryTrips(history);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTrip = () => setShowModal(true);
  const handleTripClick = (trip) => {
    navigate(`/trips/${trip.id}`);
  };

  const getTripDays = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    return Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "startDate") {
      setFormData(prev => ({ ...prev, startDate: value, endDate: "" }));
    }
  };

  const createTrip = async () => {
    try {
      if (!formData.title || !formData.startDate) {
        alert("Please fill all required fields");
        return;
      }
      await axios.post(`${API_URL}/api/trips`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setFormData({ title: "", description: "", startDate: "", endDate: "" });
      fetchTrips();
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const deleteTrip = async (e, tripId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this trip?")) return;
    try {
      await axios.delete(`${API_URL}/api/trips/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTrips();
    } catch (error) {
      console.log(error);
    }
  };

  const respondToRequest = async (memberId, action) => {
    try {
      await axios.post(`${API_URL}/api/trips/requests/${memberId}/respond`, { action }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRequests();
      fetchTrips(); 
    } catch (error) {
      console.log(error);
    }
  };

  const TripSection = ({ title, trips, status }) => (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4 px-2">
        <h3 className="font-bold text-lg text-[#264653]">{title}</h3>
        <span className="bg-[#264653]/10 text-[#264653] text-[10px] font-bold px-2 py-0.5 rounded-full">
          {trips.length}
        </span>
      </div>
      <div className="space-y-4">
        {trips.length === 0 ? (
          <div className="text-center py-8 bg-white/50 rounded-3xl border border-dashed border-[#264653]/20 text-[#264653]/40 text-sm">
            No {title.toLowerCase()} yet
          </div>
        ) : (
          trips.map((trip) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={trip.id}
              onClick={() => handleTripClick(trip)}
              className="group relative bg-white rounded-3xl p-5 shadow-lg shadow-[#264653]/5 border border-white/40 cursor-pointer overflow-hidden"
            >
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[#264653] text-lg group-hover:text-[#238a7e] transition-colors">
                      {trip.title}
                    </h4>
                    {status === "ongoing" && (
                      <span className="animate-pulse bg-green-500 w-2 h-2 rounded-full" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#264653]/60 font-medium">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#af8d4a]" />
                      {formatDate(trip.start_date)}
                    </div>
                    <ChevronRight className="w-3 h-3 text-[#264653]/20" />
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#af8d4a]" />
                      {getTripDays(trip.start_date, trip.end_date)} Days
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => deleteTrip(e, trip.id)}
                    className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              
              {/* Decorative accent */}
              <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-5 pointer-events-none transition-all duration-500 group-hover:scale-150 ${
                status === "ongoing" ? "bg-green-500" : status === "upcoming" ? "bg-[#af8d4a]" : "bg-gray-500"
              }`} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full px-4 relative">
      {/* Header Area */}
      <div className="flex justify-between items-end mb-8 px-2">
        <div>
          <h2 className="text-3xl font-extrabold text-[#264653] tracking-tight">Your Journeys</h2>
          <p className="text-[#264653]/50 text-sm font-medium">Plan, track and relive your travels</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddTrip}
          className="bg-gradient-primary text-white p-4 rounded-2xl shadow-lg shadow-[#238a7e]/30 flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Invites Section */}
      {invites.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 px-2">
            <h3 className="font-bold text-lg text-[#264653]">Trip Invites</h3>
            <span className="bg-[#238a7e]/10 text-[#238a7e] text-[10px] font-bold px-2 py-0.5 rounded-full">
              {invites.length}
            </span>
          </div>
          <div className="space-y-4">
            {invites.map((invite) => (
              <div key={invite.id} className="bg-white rounded-3xl p-5 shadow-lg shadow-[#264653]/5 border border-white/40 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-[#264653] text-sm">You were invited to {invite.trip.title}</h4>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => respondToRequest(invite.id, "accept")} className="px-3 py-1.5 bg-[#238a7e]/10 text-[#238a7e] hover:bg-[#238a7e]/20 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors">
                    Accept
                  </button>
                  <button onClick={() => respondToRequest(invite.id, "reject")} className="px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Join Requests Section */}
      {joinRequests.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 px-2">
            <h3 className="font-bold text-lg text-[#264653]">Join Requests</h3>
            <span className="bg-[#af8d4a]/10 text-[#af8d4a] text-[10px] font-bold px-2 py-0.5 rounded-full">
              {joinRequests.length}
            </span>
          </div>
          <div className="space-y-4">
            {joinRequests.map((req) => (
              <div key={req.id} className="bg-white rounded-3xl p-5 shadow-lg shadow-[#264653]/5 border border-white/40 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                    {req.user.profileImage ? (
                      <img src={req.user.profileImage} alt={req.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs">?</div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#264653] text-sm">{req.user.name}</h4>
                    <p className="text-xs text-[#264653]/60">wants to join <strong>{req.trip.title}</strong></p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => respondToRequest(req.id, "accept")} className="px-3 py-1.5 bg-[#238a7e]/10 text-[#238a7e] hover:bg-[#238a7e]/20 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors">
                    Accept
                  </button>
                  <button onClick={() => respondToRequest(req.id, "reject")} className="px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <TripSection title="Ongoing Trips" trips={ongoingTrips} status="ongoing" />
      <TripSection title="Upcoming Adventures" trips={upcomingTrips} status="upcoming" />
      <TripSection title="Past Memories" trips={historyTrips} status="history" />

      {/* Add Trip Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-[#264653]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-[#264653]">New Adventure</h3>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <X className="w-6 h-6 text-[#264653]" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#264653] uppercase ml-1">Destination Name</label>
                    <input
                      type="text"
                      name="title"
                      placeholder="e.g. Paris Getaway"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#238a7e]/30 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#264653] uppercase ml-1">Notes</label>
                    <textarea
                      name="description"
                      placeholder="What are you most excited about?"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#238a7e]/30 transition-all h-24 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#264653] uppercase ml-1">Starts</label>
                      <input
                        type="date"
                        name="startDate"
                        min={todayDate}
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#238a7e]/30 transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#264653] uppercase ml-1">Ends</label>
                      <input
                        type="date"
                        name="endDate"
                        min={formData.startDate || todayDate}
                        value={formData.endDate}
                        onChange={handleChange}
                        disabled={!formData.startDate}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#238a7e]/30 transition-all text-sm disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={createTrip}
                    className="w-full py-4 bg-gradient-primary text-white rounded-2xl font-bold shadow-lg shadow-[#238a7e]/20 mt-4"
                  >
                    Start Trip
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Trips;
