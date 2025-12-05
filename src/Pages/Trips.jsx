import { useState } from "react";
import { FaPlus } from "react-icons/fa";

const Trips = () => {
  const [upcomingTrips] = useState([
    { id: 1, name: "Mysore", start: "12 Dec", end: "15 Dec", friends: 2 },
    { id: 2, name: "Shimla", start: "12 Jan", end: "20 Jan", friends: 6 },
  ]);

  const [historyTrips] = useState([
    { id: 3, name: "Munnar Trip", start: "5 Oct", end: "7 Oct" },
  ]);

  const handleAddTrip = () => {
    alert("Open Add Trip Screen");
    // API ("/add-trip");
  };

  const handleTripClick = (trip) => {
    alert(`Open Trip Details → ${trip.name}`);
    // API (`/trip/${trip.id}`);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 pb-16">

      {/* Header Row */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold" style={{ color: "#12213e" }}>
          Trips
        </h2>

        {/* Add Trip Button */}
        <button
          onClick={handleAddTrip}
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
          style={{ backgroundColor: "#12213e", color: "#fcf9f2" }}
        >
          <FaPlus />
        </button>
      </div>

      {/* Upcoming Trips */}
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
      <div className="font-semibold">{trip.name}</div>
      <div className="flex justify-between text-sm mt-1">
        <span>{trip.start} - {trip.end}</span>
        <span>{trip.friends} Friends</span>
      </div>
    </div>
  ))}
</div>

{/* Trip History */}
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
      <div className="font-semibold">{trip.name}</div>
      <div className="text-sm mt-1">
        {trip.start} - {trip.end}
      </div>
    </div>
  ))}
</div>


      

    </div>
  );
};

export default Trips;
