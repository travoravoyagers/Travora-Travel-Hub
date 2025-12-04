import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomeScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen gap-6"
      style={{ backgroundColor: "#fcf9f2" }}
    >
      <h1
        className="text-3xl font-bold"
        style={{ color: "#12213e" }}
      >
        Welcome to Travora 🌍
      </h1>

      <p style={{ color: "#12213e" }}>
        More features coming soon...
      </p>

      <button
        onClick={handleLogout}
        className="px-6 py-3 rounded-lg font-semibold"
        style={{ backgroundColor: "#12213e", color: "#fcf9f2" }}
      >
        Logout
      </button>
    </div>
  );
};

export default HomeScreen;
