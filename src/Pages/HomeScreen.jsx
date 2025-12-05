import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaSuitcase, FaUserFriends, FaUser, FaBell, FaSignOutAlt } from "react-icons/fa";

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

  const tabClass = (tab) =>
    `flex flex-col items-center text-sm p-2 ${
      activeTab === tab ? "font-bold border-b-2" : "opacity-50"
    }`;

 return (
  <div className="relative min-h-screen" style={{ backgroundColor: "#fcf9f2" }}>
    
    {/* Sticky Navbar */}
<div
  className="fixed top-0 left-0 w-full flex justify-between items-center p-4 shadow-md z-50"
  style={{ backgroundColor: "#fcf9f2", color: "#12213e" }}
>
  <h1 className="text-2xl font-bold">Travora</h1>

  <div className="flex gap-4 items-center">
    <FaBell className="text-xl cursor-pointer" />

    <FaSignOutAlt
      className="text-xl cursor-pointer"
      onClick={() => {
        localStorage.removeItem("token");
        navigate("/login");
      }}
    />
  </div>
</div>


    {/* Scrollable Content */}
    <div
      className="pt-20 pb-20 flex-1 flex justify-center"
      style={{ color: "#12213e" }}
    >
      {renderTabContent()}
    </div>

    {/* Sticky Bottom Navigation */}
    <div
      className="fixed bottom-0 left-0 w-full flex justify-around py-2 border-t shadow-md z-50"
      style={{ backgroundColor: "#fcf9f2", color: "#12213e" }}
    >
      <button className={tabClass("feed")} onClick={() => setActiveTab("feed")}>
        <FaHome className="text-lg mb-1" />
        Feed
      </button>

      <button className={tabClass("trips")} onClick={() => setActiveTab("trips")}>
        <FaSuitcase className="text-lg mb-1" />
        Trips
      </button>

      <button className={tabClass("friends")} onClick={() => setActiveTab("friends")}>
        <FaUserFriends className="text-lg mb-1" />
        Friends
      </button>

      <button className={tabClass("profile")} onClick={() => setActiveTab("profile")}>
        <FaUser className="text-lg mb-1" />
        Profile
      </button>
    </div>

  </div>
);

};

export default HomeScreen;
