import { Routes, Route } from "react-router-dom";
import SplashScreen from "./Pages/SplashScreen.jsx";
import Login from "./Pages/LoginScreen.jsx";
import Register from "./Pages/RegisterScreen.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
