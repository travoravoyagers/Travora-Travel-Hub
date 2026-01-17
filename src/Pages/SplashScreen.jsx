import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem("token");

      if (token) {
        navigate("/home"); // User already logged in
      } else {
        navigate("/login"); // No token → Login
      }

    }, 3200);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <img
        src="/logo.png"
        alt="Travora Logo"
        className="splash-logo"
      />
    </div>
  );
};

export default SplashScreen;
