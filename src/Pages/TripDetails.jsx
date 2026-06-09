import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Calendar, MapPin, Plus, X, Edit3, Trash2 } from "lucide-react";
import axios from "axios";

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [trip, setTrip] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingDay, setEditingDay] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);

  const [showEditTrip, setShowEditTrip] = useState(false);
  const [tripForm, setTripForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: ""
  });

  const [entryForm, setEntryForm] = useState({
    type: "",
    time: "",
    description: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTripDetails();
    fetchItinerary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/trips`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const currentTrip = res.data.trips.find(t => t.id === id);
      if (currentTrip) {
        setTrip(currentTrip);
        setTripForm({
          title: currentTrip.title,
          description: currentTrip.description || "",
          startDate: currentTrip.start_date ? new Date(currentTrip.start_date).toISOString().split('T')[0] : "",
          endDate: currentTrip.end_date ? new Date(currentTrip.end_date).toISOString().split('T')[0] : ""
        });
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchItinerary = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/trips/${id}/itinerary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItinerary(res.data.days || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

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

  const getStatus = (start, end) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const s = new Date(start);
    const e = new Date(end);
    s.setHours(0, 0, 0, 0);
    e.setHours(0, 0, 0, 0);

    if (today < s) return "Upcoming";
    if (today >= s && today <= e) return "Ongoing";
    return "Completed";
  };

  const typeIcons = {
    Walk: "🚶",
    Bus: "🚌",
    Train: "🚆",
    Flight: "✈️",
    Taxi: "🚕",
    Bike: "🏍",
    Ferry: "⛴",
    Food: "🍽",
    Hotel: "🏨",
    Activity: "📍",
    Sight_Seeing: "👓",
    Trek: "⛰️"
  };

  const handleAddEntry = async (dayNumber) => {
    if (!entryForm.description) {
      alert("Description is required");
      return;
    }

    let contentStr = "";
    if (entryForm.type) {
      contentStr += `${typeIcons[entryForm.type] || "📍"} ${entryForm.type}\n`;
    }
    if (entryForm.time) {
      const timeParts = entryForm.time.split(":");
      const ampm = timeParts[0] >= 12 ? "PM" : "AM";
      const hours = timeParts[0] % 12 || 12;
      const formattedTime = `${hours}:${timeParts[1]} ${ampm}`;
      contentStr += `⏰ ${formattedTime}\n`;
    }
    contentStr += entryForm.description;

    try {
      if (editingEntry) {
        await axios.put(
          `${API_URL}/api/trips/${id}/itinerary/${editingEntry.id}`,
          { content: contentStr },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${API_URL}/api/trips/${id}/itinerary`,
          {
            day_number: dayNumber,
            content: contentStr
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setEditingDay(null);
      setEditingEntry(null);
      setEntryForm({ type: "", time: "", description: "" });
      fetchItinerary();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await axios.delete(`${API_URL}/api/trips/${id}/itinerary/${entryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchItinerary();
    } catch (err) {
      console.log(err);
    }
  };

  const openEditModal = (entry, dayNum) => {
    setEditingEntry(entry);
    setEditingDay(dayNum);

    let type = "";
    let time = "";
    let lines = entry.content.split('\n');
    let remainingLines = [];

    lines.forEach(line => {
      let isParsed = false;

      for (const t of Object.keys(typeIcons)) {
        if (line.trim() === `${typeIcons[t]} ${t}`) {
          type = t;
          isParsed = true;
          break;
        }
      }

      if (!isParsed && line.startsWith("⏰ ")) {
        const timeStr = line.replace("⏰ ", "").trim();
        const parts = timeStr.split(' ');
        if (parts.length === 2) {
          let [hrs, mins] = parts[0].split(':');
          let hrsNum = parseInt(hrs);
          if (parts[1] === 'PM' && hrsNum < 12) hrsNum += 12;
          if (parts[1] === 'AM' && hrsNum === 12) hrsNum = 0;
          time = `${hrsNum.toString().padStart(2, '0')}:${mins}`;
          isParsed = true;
        }
      }

      if (!isParsed) {
        remainingLines.push(line);
      }
    });

    setEntryForm({ type, time, description: remainingLines.join('\n').trim() });
  };

  const handleUpdateTrip = async () => {
    try {
      await axios.put(
        `${API_URL}/api/trips/${id}`,
        {
          title: tripForm.title,
          description: tripForm.description,
          startDate: tripForm.startDate,
          endDate: tripForm.endDate
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowEditTrip(false);
      fetchTripDetails();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading || !trip) {
    return (
      <div className="min-h-screen bg-[#fcf9f2] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#238a7e] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalDays = getTripDays(trip.start_date, trip.end_date);
  const maxItineraryDay = itinerary.length > 0 ? Math.max(...itinerary.map(i => i.day_number)) : 0;
  const maxDays = Math.max(totalDays, maxItineraryDay);
  const finalDaysArray = Array.from({ length: maxDays > 0 ? maxDays : 1 }, (_, i) => i + 1);

  const currentStatus = getStatus(trip.start_date, trip.end_date);
  const statusColors = {
    Upcoming: "text-[#af8d4a]",
    Ongoing: "text-[#238a7e]",
    Completed: "text-gray-500"
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
          {trip.title}
        </h1>
      </div>

      <div className="px-4 py-4 space-y-8 max-w-2xl mx-auto">

        {/* Top Section Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-[#264653]/5 border border-white/40"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-50 text-[#264653] rounded-2xl shadow-inner">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#264653]">{trip.title}</h3>
              <div className="flex items-center gap-1 text-[#264653]/40 text-xs font-bold uppercase tracking-wide">
                Trip Overview
              </div>
            </div>
            <button
              onClick={() => setShowEditTrip(true)}
              className="ml-auto p-2 bg-gray-50 text-[#238a7e] rounded-xl hover:bg-[#238a7e]/10 transition-colors"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          </div>

          {trip.description && (
            <div className="mb-6">
              <p className="text-[#264653]/80 text-[15px] italic leading-relaxed bg-[#fcf9f2] p-5 rounded-3xl border border-[#264653]/5">
                "{trip.description}"
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="text-[10px] font-bold text-[#264653]/40 uppercase tracking-widest mb-1">Duration</div>
              <div className="text-xl font-bold text-[#264653]">
                {totalDays} <span className="text-sm font-medium text-[#264653]/60">Days</span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="text-[10px] font-bold text-[#264653]/40 uppercase tracking-widest mb-1">Status</div>
              <div className={`text-xl font-bold ${statusColors[currentStatus]}`}>
                {currentStatus}
              </div>
            </div>
            <div className="col-span-2 flex items-center justify-between bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-[#264653]/40 uppercase tracking-widest">Timeline</div>
                <div className="text-sm font-bold text-[#264653]">
                  {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                </div>
              </div>
              <div className="p-2.5 bg-white rounded-xl shadow-sm">
                <Calendar className="w-5 h-5 text-[#af8d4a]" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Itinerary Section */}
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-extrabold text-[#264653] tracking-tight ml-2">Itinerary</h2>

          {finalDaysArray.map((dayNum, index) => {
            let dayEntries = itinerary.filter(item => item.day_number === dayNum);

            dayEntries.sort((a, b) => {
              const getTime = (content) => {
                const match = content.match(/⏰\s*(\d{1,2}):(\d{2})\s*(AM|PM)/);
                if (!match) return Infinity;
                let hrs = parseInt(match[1]);
                const mins = parseInt(match[2]);
                const period = match[3];
                if (period === 'PM' && hrs < 12) hrs += 12;
                if (period === 'AM' && hrs === 12) hrs = 0;
                return hrs * 60 + mins;
              };
              return getTime(a.content) - getTime(b.content);
            });

            const isEditing = editingDay === dayNum;

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={dayNum}
                className="bg-white rounded-[2rem] p-6 shadow-lg shadow-[#264653]/5 border border-white/40"
              >
                <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
                  <span className="text-xs font-black text-[#af8d4a] uppercase tracking-widest bg-[#af8d4a]/10 px-4 py-2 rounded-full">
                    Day {dayNum}
                  </span>
                </div>

                {dayEntries.length > 0 ? (
                  <div className="flex flex-col mb-6">
                    {dayEntries.map((entry) => (
                      <div key={entry.id} className="group flex gap-4">
                        {/* Timeline Column */}
                        <div className="flex flex-col items-center relative w-3 shrink-0">
                          {/* Dot */}
                          <div className="w-2.5 h-2.5 rounded-full bg-[#238a7e] mt-6 z-10 shrink-0 ring-4 ring-white" />
                          {/* Line */}
                          <div className="w-[2px] bg-gray-100 absolute top-[36px] bottom-[-24px] group-last:hidden z-0" />
                        </div>

                        {/* Content Column */}
                        <div className="flex-1 pb-6">
                          <div className="text-[14px] text-[#264653]/90 whitespace-pre-line leading-[1.8] font-medium bg-gray-50/40 p-4 rounded-[1.25rem] border border-gray-100 shadow-sm relative overflow-hidden transition-all hover:border-[#238a7e]/30">
                            {entry.content}

                            {/* Entry Actions */}
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openEditModal(entry, dayNum)}
                                className="p-1.5 bg-white rounded-lg shadow-sm text-[#238a7e] hover:bg-gray-50 border border-gray-50"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteEntry(entry.id)}
                                className="p-1.5 bg-white rounded-lg shadow-sm text-red-500 hover:bg-gray-50 border border-gray-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-sm text-[#264653]/40 bg-gray-50/50 rounded-2xl mb-6 border border-dashed border-gray-200">
                    No plans for this day yet
                  </div>
                )}

                {/* Add Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    setEditingDay(dayNum);
                    setEntryForm({ type: "", time: "", description: "" });
                  }}
                  className="w-full py-4 flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 text-[#264653]/60 rounded-2xl hover:border-[#238a7e]/50 hover:text-[#238a7e] hover:bg-[#238a7e]/5 transition-all text-sm font-bold"
                >
                  <Plus className="w-5 h-5" /> Add Entry
                </motion.button>

              </motion.div>
            );
          })}

        </div>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {editingDay !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setEditingDay(null); setEditingEntry(null); }}
              className="absolute inset-0 bg-[#264653]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-[#fcf9f2] rounded-[1.5rem] p-6 shadow-2xl space-y-5"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-black uppercase tracking-widest text-[#238a7e]">
                  {editingEntry ? "Edit Entry" : "New Entry"} (Day {editingDay})
                </span>
                <button onClick={() => { setEditingDay(null); setEditingEntry(null); }} className="p-1.5 hover:bg-black/5 rounded-full transition-colors">
                  <X className="w-5 h-5 text-[#264653]" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#264653]/60 uppercase ml-1 block mb-1.5">Type (Opt)</label>
                  <select
                    className="w-full bg-white px-4 py-3.5 rounded-xl text-sm border border-gray-200 outline-none focus:border-[#238a7e] transition-colors"
                    value={entryForm.type}
                    onChange={e => setEntryForm({ ...entryForm, type: e.target.value })}
                  >
                    <option value="">Select Type</option>
                    {Object.keys(typeIcons).map(t => <option key={t} value={t}>{typeIcons[t]} {t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#264653]/60 uppercase ml-1 block mb-1.5">Time (Opt)</label>
                  <input
                    type="time"
                    className="w-full bg-white px-4 py-3.5 rounded-xl text-sm border border-gray-200 outline-none focus:border-[#238a7e] transition-colors"
                    value={entryForm.time}
                    onChange={e => setEntryForm({ ...entryForm, time: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#264653]/60 uppercase ml-1 block mb-1.5">Description</label>
                <textarea
                  placeholder="What's happening?"
                  className="w-full bg-white p-4 rounded-xl text-sm border border-gray-200 outline-none focus:border-[#238a7e] transition-colors resize-none h-28"
                  value={entryForm.description}
                  onChange={e => setEntryForm({ ...entryForm, description: e.target.value })}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAddEntry(editingDay)}
                className="w-full py-4 bg-[#238a7e] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#238a7e]/20 mt-2"
              >
                Save Entry
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Trip Modal */}
      <AnimatePresence>
        {showEditTrip && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditTrip(false)}
              className="absolute inset-0 bg-[#264653]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-[#264653]">Edit Trip</h3>
                <button onClick={() => setShowEditTrip(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-[#264653]" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#264653] uppercase ml-1">Title</label>
                  <input
                    type="text"
                    value={tripForm.title}
                    onChange={e => setTripForm({ ...tripForm, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#238a7e]/30 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#264653] uppercase ml-1">Notes</label>
                  <textarea
                    value={tripForm.description}
                    onChange={e => setTripForm({ ...tripForm, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#238a7e]/30 transition-all h-24 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#264653] uppercase ml-1">Starts</label>
                    <input
                      type="date"
                      value={tripForm.startDate}
                      onChange={e => setTripForm({ ...tripForm, startDate: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#238a7e]/30 transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#264653] uppercase ml-1">Ends</label>
                    <input
                      type="date"
                      value={tripForm.endDate}
                      onChange={e => setTripForm({ ...tripForm, endDate: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#238a7e]/30 transition-all text-sm"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpdateTrip}
                  className="w-full py-4 bg-[#264653] text-white rounded-2xl font-bold shadow-lg shadow-[#264653]/20 mt-4"
                >
                  Save Changes
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TripDetails;
