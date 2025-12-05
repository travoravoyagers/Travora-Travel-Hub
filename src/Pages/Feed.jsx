import { useState } from "react";
import { FaPlus } from "react-icons/fa";

const Feed = () => {
  const [posts] = useState([
    {
      id: 1,
      username: "User_01",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      caption: "Ocean vibes 🌊",
    },
    {
      id: 2,
      username: "User_02",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      caption: "Mountains calling 🏔️",
    }
  ]);

  const handlePostClick = (post) => {
    alert(`Open profile of: ${post.username}`);
    // Later: navigate(`/user/${post.userId}`)
  };

  const handleAddPost = () => {
    alert("Open Add Post Screen");
    // Later: navigate("/add-post")
  };

  return (
    <div className="w-full">
      {/* Posts */}
      {/* Posts */}
<div className="max-w-xl mx-auto flex flex-col gap-6 px-4 pb-16">
  {posts.map((post) => (
    <div 
      key={post.id} 
      className="bg-white rounded-xl shadow-md cursor-pointer"
      onClick={() => handlePostClick(post)}
    >
      {/* Username */}
      <div className="p-3 font-semibold text-[#12213e]">
        @{post.username}
      </div>

      {/* Image */}
      <img 
        src={post.image} 
        alt="Post" 
        className="w-full h-64 object-cover rounded-md"
      />

      {/* Caption */}
      <div className="p-3 text-[#12213e] text-sm">
        {post.caption}
      </div>
    </div>
  ))}
</div>


      {/* Floating Add Post Button */}
      <button
        onClick={handleAddPost}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-md flex items-center justify-center text-2xl"
        style={{ backgroundColor: "#12213e", color: "#fcf9f2" }}
      >
        <FaPlus />
      </button>
    </div>
  );
};

export default Feed;
