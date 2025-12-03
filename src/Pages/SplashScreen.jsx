import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3200); 

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <img
        src="/logo-transparent.png"
        alt="Travora Logo"
        className="splash-logo"
      />
    </div>
  );
};

export default SplashScreen;
