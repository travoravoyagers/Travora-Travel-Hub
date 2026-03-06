import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";

const Trips = () => {

  const API_URL = import.meta.env.VITE_API_URL;
  
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [ongoingTrips, setOngoingTrips] = useState([]);
  const [historyTrips, setHistoryTrips] = useState([]);
  const [showTripModal, setShowTripModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

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
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/trips`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
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

        if (today < start) {
          upcoming.push(trip);
        }
        else if (today >= start && today <= end) {
          ongoing.push(trip);
        }
        else {
          history.push(trip);
        }

      });

      setUpcomingTrips(upcoming);
      setOngoingTrips(ongoing);
      setHistoryTrips(history);

    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTrip = () => {
    setShowModal(true);
  };

  const handleTripClick = (trip) => {
    setSelectedTrip(trip);
    setShowTripModal(true);
  };

  const getTripDays = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);

    const diff = e - s;

    const days = diff / (1000 * 60 * 60 * 24) + 1;

    return days;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    if (name === "startDate") {
      setFormData(prev => ({
        ...prev,
        startDate: value,
        endDate: ""
      }));
    }
  };

  const createTrip = async () => {
    try {

      if (!formData.title || !formData.startDate || !formData.endDate) {
        alert("Please fill all required fields");
        return;
      }

      if (formData.endDate < formData.startDate) {
        alert("End date cannot be before start date");
        return;
      }

      await axios.post(
        `${API_URL}/api/trips`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setShowModal(false);

      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: ""
      });

      fetchTrips();

    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short"
    });
  };

  const deleteTrip = async (tripId) => {

    const confirmDelete = window.confirm("Delete this trip?");

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `${API_URL}/api/trips/${tripId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchTrips();

    } catch (error) {
      console.log(error);
    }
  };

  const editTrip = (trip) => {

    alert("Edit trip")
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 pb-16">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold" style={{ color: "#12213e" }}>
          Trips
        </h2>

        <button
          onClick={handleAddTrip}
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
          style={{ backgroundColor: "#12213e", color: "#fcf9f2" }}
        >
          <FaPlus />
        </button>
      </div>

      <h3 className="font-semibold mb-2" style={{ color: "#12213e" }}>
        Ongoing Trips
      </h3>

      <div className="flex flex-col gap-3 mb-6">
        {ongoingTrips.map((trip) => (
          <div
            key={trip.id}
            onClick={() => handleTripClick(trip)}
            className="rounded-xl p-4 shadow cursor-pointer"
            style={{ backgroundColor: "#e8f5e9", color: "#12213e" }}
          >

            <div className="flex justify-between items-center">

              <div className="flex items-center gap-2">
                <div className="font-semibold">{trip.title}</div>

                <span className="text-xs px-2 py-1 rounded-full bg-green-600 text-white">
                  Ongoing
                </span>
              </div>

              <div
                className="flex gap-3 text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={() => editTrip(trip)} className="text-blue-600">
                  <FaEdit />
                </button>

                <button onClick={() => deleteTrip(trip.id)} className="text-red-600">
                  <FaTrash />
                </button>
              </div>

            </div>

            <div className="text-sm mt-1">
              {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
            </div>

          </div>
        ))}
      </div>

      <h3 className="font-semibold mb-2" style={{ color: "#12213e" }}>
        Upcoming Trips
      </h3>

      <div className="flex flex-col gap-3 mb-6">
        {upcomingTrips.map((trip) => (
          <div
            key={trip.id}
            onClick={() => handleTripClick(trip)}
            className="rounded-xl p-4 shadow cursor-pointer"
            style={{ backgroundColor: "#f5efe3", color: "#12213e" }}
          >

            <div className="flex justify-between items-center">

              <div className="font-semibold">{trip.title}</div>

              <div
                className="flex gap-3 text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={() => editTrip(trip)} className="text-blue-600">
                  <FaEdit />
                </button>

                <button onClick={() => deleteTrip(trip.id)} className="text-red-600">
                  <FaTrash />
                </button>
              </div>

            </div>

            <div className="text-sm mt-1">
              {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
            </div>

          </div>
        ))}
      </div>



      <h3 className="font-semibold mb-2" style={{ color: "#12213e" }}>
        Trip History
      </h3>

      <div className="flex flex-col gap-3 mb-6">
        {historyTrips.map((trip) => (
          <div
            key={trip.id}
            onClick={() => handleTripClick(trip)}
            className="rounded-xl p-4 shadow cursor-pointer"
            style={{ backgroundColor: "#e8e3d7", color: "#12213e" }}
          >

            <div className="flex justify-between items-center">

              <div className="font-semibold">{trip.title}</div>

              <div
                className="flex gap-3 text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={() => editTrip(trip)} className="text-blue-600">
                  <FaEdit />
                </button>

                <button onClick={() => deleteTrip(trip.id)} className="text-red-600">
                  <FaTrash />
                </button>
              </div>

            </div>

            <div className="text-sm mt-1">
              {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
            </div>

          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">

            <h3 className="text-lg font-semibold mb-4" style={{ color: "#12213e" }}>
              Create Trip
            </h3>

            <div className="flex flex-col gap-3">

              <input
                type="text"
                name="title"
                placeholder="Place name"
                value={formData.title}
                onChange={handleChange}
                className="border rounded-lg p-2"
              />

              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="border rounded-lg p-2"
              />

              <div>
                <label className="text-sm font-medium">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  min={todayDate}
                  value={formData.startDate}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  min={formData.startDate || todayDate}
                  value={formData.endDate}
                  onChange={handleChange}
                  disabled={!formData.startDate}
                  className="border rounded-lg p-2 w-full"
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">

                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>

                <button
                  onClick={createTrip}
                  className="px-4 py-2 rounded-lg"
                  style={{ backgroundColor: "#12213e", color: "#fcf9f2" }}
                >
                  Create
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

      {showTripModal && selectedTrip && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">

            <h3 className="text-xl font-semibold mb-3" style={{ color: "#12213e" }}>
              {selectedTrip.title}
            </h3>

            {selectedTrip.description && (
              <p className="text-sm mb-3 text-gray-600">
                {selectedTrip.description}
              </p>
            )}

            <div className="flex flex-col gap-2 text-sm">

              <div>
                <strong>Start:</strong>{" "}
                {new Date(selectedTrip.start_date).toDateString()}
              </div>

              <div>
                <strong>End:</strong>{" "}
                {new Date(selectedTrip.end_date).toDateString()}
              </div>

              <div>
                <strong>Duration:</strong>{" "}
                {getTripDays(selectedTrip.start_date, selectedTrip.end_date)} Days
              </div>

            </div>

            <div className="flex justify-end mt-4">

              <button
                onClick={() => setShowTripModal(false)}
                className="px-4 py-2 rounded-lg"
                style={{ backgroundColor: "#12213e", color: "#fcf9f2" }}
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Trips;