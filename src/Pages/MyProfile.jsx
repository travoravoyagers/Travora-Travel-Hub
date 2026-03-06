import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {

  
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changing, setChanging] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const posts = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?auto=format&fit=crop&w=500&q=80",
    },
  ];

  const handleMenuClick = (item) => {
    if (item === "Change Password") {
      setShowChangePwd(true);
      setMenuOpen(false);
    }
  };

  const handlePostClick = (post) => {
    alert(`Open post ${post.id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // clear and close popup
  const closeChangePasswordPopup = () => {
    setShowChangePwd(false);
    setCurrentPassword("");
    setNewPassword("");
    setPwdError("");
    setPwdSuccess("");
  };

  // change password function
  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPwdError("");
    setPwdSuccess("");

    if (!currentPassword || !newPassword) {
      setPwdError("Please fill both fields");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setPwdError("Not authenticated");
      return;
    }

    try {
      setChanging(true);

      const res = await fetch(
        `${API_URL}/api/user/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setPwdError(data.message || "Failed to change password");
        return;
      }

      setPwdSuccess(data.message || "Password changed successfully");

      setTimeout(() => {
        closeChangePasswordPopup();
      }, 1200);

    } catch (error) {
      console.error(error);
      setPwdError("Something went wrong");
    } finally {
      setChanging(false);
    }
  };

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoadingUser(true);

        const res = await fetch(`${API_URL}/api/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setUser(data.user);
      } catch (err) {
        console.log(err);
        navigate("/login");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchMe();
  }, [API_URL, navigate]);

  return (
    <>
      <div
        className="w-full max-w-5xl mx-auto px-4 pb-20 flex gap-6"
        style={{ color: "#12213e" }}
      >
        <div className="flex-1">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Profile</h2>

            <button className="md:hidden" onClick={() => setMenuOpen(true)}>
              <FaBars className="text-2xl" />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <img
              src="https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=200&q=80"
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-2"
              style={{ borderColor: "#12213e" }}
            />

            <div>
              {loadingUser ? (
                <div className="text-sm opacity-80">Loading profile...</div>
              ) : (
                <>
                  <div className="font-semibold text-lg">
                    {user?.name || "User"}
                  </div>
                  <div className="text-sm opacity-80">
                    {user?.email || "No email"}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium shadow"
              style={{ backgroundColor: "#12213e", color: "#fcf9f2" }}
              onClick={() => handleMenuClick("Edit Details")}
            >
              Edit Profile
            </button>

            <button
              className="px-4 py-2 rounded-lg text-sm font-medium shadow"
              style={{ backgroundColor: "#12213e", color: "#fcf9f2" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          <h3 className="font-semibold mt-6 mb-3 text-lg">My Posts</h3>

          <div className="grid grid-cols-3 gap-2">
            {posts.map((post) => (
              <button
                key={post.id}
                className="w-full aspect-square rounded-lg overflow-hidden shadow"
                onClick={() => handlePostClick(post)}
              >
                <img
                  src={post.image}
                  alt={`Post ${post.id}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <aside
          className="hidden md:flex flex-col gap-4 w-56 p-4 rounded-xl shadow-md h-fit"
          style={{ backgroundColor: "#f5efe3" }}
        >
          <button
            className="text-left hover:font-semibold"
            onClick={() => handleMenuClick("Change Password")}
          >
            Change Password
          </button>
          <button
            className="text-left hover:font-semibold"
            onClick={() => handleMenuClick("Suggest a Place")}
          >
            Suggest a Place
          </button>
          <button
            className="text-left hover:font-semibold"
            onClick={() => handleMenuClick("Feedback")}
          >
            Feedback
          </button>
        </aside>

        <div
          className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
            menuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMenuOpen(false)}
          />

          <div
            className={`absolute top-0 right-0 h-full w-64 p-6 shadow-lg transform transition-transform duration-300
            ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
            style={{ backgroundColor: "#fcf9f2", color: "#12213e" }}
          >
            <h3 className="font-semibold mb-6 text-lg">Menu</h3>

            <button
              className="block w-full text-left mb-4"
              onClick={() => handleMenuClick("Change Password")}
            >
              Change Password
            </button>
            <button
              className="block w-full text-left mb-4"
              onClick={() => handleMenuClick("Suggest a Place")}
            >
              Suggest a Place
            </button>
            <button
              className="block w-full text-left mb-4"
              onClick={() => handleMenuClick("Feedback")}
            >
              Feedback
            </button>

            <button
              className="block w-full text-left mt-6 font-semibold"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {showChangePwd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeChangePasswordPopup}
          />

          <form
            onSubmit={handleChangePassword}
            className="relative w-full max-w-sm rounded-xl p-6 shadow-lg"
            style={{ backgroundColor: "#fcf9f2", color: "#12213e" }}
          >
            <h3 className="text-lg font-semibold mb-4">
              Change Password
            </h3>

            <div className="mb-3">
              <label className="text-sm block mb-1">
                Current password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 rounded-md border outline-none"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="text-sm block mb-1">
                New password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 rounded-md border outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            {pwdError && (
              <div className="text-sm text-red-600 mb-2">
                {pwdError}
              </div>
            )}

            {pwdSuccess && (
              <div className="text-sm text-green-600 mb-2">
                {pwdSuccess}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={closeChangePasswordPopup}
                className="px-4 py-2 text-sm rounded-md border"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={changing}
                className="px-4 py-2 text-sm rounded-md shadow"
                style={{ backgroundColor: "#12213e", color: "#fcf9f2" }}
              >
                {changing ? "Updating..." : "Change"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default MyProfile;
