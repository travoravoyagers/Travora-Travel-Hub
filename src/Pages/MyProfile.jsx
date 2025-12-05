import { useState } from "react";
import { FaBars } from "react-icons/fa";

const MyProfile = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Dummy
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
    alert(`Clicked: ${item}`);
  };

  const handlePostClick = (post) => {
    alert(`Open post ${post.id}`);
  };

  return (
    <div
      className="w-full max-w-5xl mx-auto px-4 pb-20 flex gap-6"
      style={{ color: "#12213e" }}
    >
     
      <div className="flex-1">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Profile</h2>

          {/* Hamburger -> only on mobile */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <FaBars className="text-2xl" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src="https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=200&q=80"
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border-2"
            style={{ borderColor: "#12213e" }}
          />
          <div>
            <div className="font-semibold text-lg">User Name</div>
            <div className="text-sm opacity-80">Status: On Trip 🌍</div>
          </div>
        </div>

        <button
          className="px-4 py-2 rounded-lg text-sm font-medium shadow"
          style={{ backgroundColor: "#12213e", color: "#fcf9f2" }}
          onClick={() => handleMenuClick("Edit Details")}
        >
          Edit Profile
        </button>

        {/* My Posts Section */}
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

      {/* RIGHT: Sidebar (always visible on desktop) */}
      <aside
        className="hidden md:flex flex-col gap-4 w-56 p-4 rounded-xl shadow-md h-fit"
        style={{ backgroundColor: "#f5efe3" }}
      >
        <button
          className="text-left hover:font-semibold"
          onClick={() => handleMenuClick("Edit Details")}
        >
          Edit Details
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

      {/* MOBILE SLIDE-IN MENU (right side) */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* overlay */}
        <div
          className="absolute inset-0 bg-black/30"
          onClick={() => setMenuOpen(false)}
        />

        {/* drawer */}
        <div
          className={`absolute top-0 right-0 h-full w-64 p-6 shadow-lg transform transition-transform duration-300
          ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
          style={{ backgroundColor: "#fcf9f2", color: "#12213e" }}
        >
          <h3 className="font-semibold mb-6 text-lg">Menu</h3>

          <button
            className="block w-full text-left mb-4"
            onClick={() => handleMenuClick("Edit Details")}
          >
            Edit Details
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
       
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
