import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Heart, MessageCircle, Share2, MapPin, MoreHorizontal } from "lucide-react";

const Feed = () => {
  const [posts] = useState([
    {
      id: 1,
      username: "alex_travels",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      caption: "Watching the sunset in Bali was a dream come true! 🌊✨",
      location: "Bali, Indonesia",
      likes: 124,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    {
      id: 2,
      username: "sara_explorer",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      caption: "The air is thinner up here, but the view is worth every step. 🏔️",
      location: "Swiss Alps",
      likes: 89,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    }
  ]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full px-4">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6 pb-24"
      >
        {posts.map((post) => (
          <motion.div 
            key={post.id} 
            variants={item}
            className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-[#264653]/5 border border-white/40"
          >
            {/* Post Header */}
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img 
                  src={post.avatar} 
                  alt={post.username} 
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#238a7e]/20"
                />
                <div>
                  <h3 className="font-bold text-[#264653] text-sm">@{post.username}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-[#264653]/50 font-medium">
                    <MapPin className="w-3 h-3" />
                    {post.location}
                  </div>
                </div>
              </div>
              <button className="p-2 text-[#264653]/40">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Post Image */}
            <div className="relative group overflow-hidden mx-2">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
                src={post.image} 
                alt="Post" 
                className="w-full h-[400px] object-cover rounded-[1.5rem]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.5rem]" />
            </div>

            {/* Post Actions */}
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-4">
                  <motion.button whileTap={{ scale: 0.8 }} className="flex items-center gap-1 text-[#264653] hover:text-red-500 transition-colors">
                    <Heart className="w-6 h-6" />
                    <span className="text-xs font-bold">{post.likes}</span>
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.8 }} className="text-[#264653] hover:text-[#238a7e] transition-colors">
                    <MessageCircle className="w-6 h-6" />
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.8 }} className="text-[#264653] hover:text-[#238a7e] transition-colors">
                    <Share2 className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              {/* Caption */}
              <div className="text-[#264653]/80 text-sm leading-relaxed">
                <span className="font-bold mr-2 text-[#264653]">@{post.username}</span>
                {post.caption}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Floating Add Post Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-2xl bg-gradient-primary text-white shadow-lg shadow-[#238a7e]/40 flex items-center justify-center z-50 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-500" />
        <Plus className="w-8 h-8" />
      </motion.button>
    </div>
  );
};

export default Feed;

