import { Routes, Route } from "react-router-dom";
import SplashScreen from "./Pages/SplashScreen.jsx";
import Login from "./Pages/LoginScreen.jsx";
import Register from "./Pages/RegisterScreen.jsx";
import HomeScreen from "./Pages/HomeScreen.jsx";
import TripDetails from "./Pages/TripDetails.jsx";
import UserProfile from "./Pages/UserProfile.jsx";
import Chat from "./Pages/Chat.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/trips/:id" element={<TripDetails />} />
      <Route path="/profile/:userId" element={<UserProfile />} />
      <Route path="/profile/:userId/trips/:id" element={<TripDetails />} />
      <Route path="/chat/:friendId" element={<Chat />} />
    </Routes>
  );
}

export default App;
