import { motion } from "framer-motion";
import { Search, UserPlus, MessageCircle, MoreVertical, Star, Compass } from "lucide-react";

const Friends = () => {
  const friends = [
    { id: 1, name: "Marcus Wright", handle: "@marcus_w", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=100&q=80", status: "In Tokyo" },
    { id: 2, name: "Elena Rodriguez", handle: "@elena_travel", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=100&q=80", status: "Planning Bali" },
    { id: 3, name: "Jordan Smith", handle: "@jsmith_global", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=100&q=80", status: "In Paris" },
  ];

  return (
    <div className="w-full px-4">
      {/* Search Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-[#264653] tracking-tight mb-4">Voyagers</h2>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#264653]/40 group-focus-within:text-[#238a7e] transition-colors" />
          <input 
            type="text" 
            placeholder="Search fellow travelers..." 
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm outline-none border border-white focus:ring-2 focus:ring-[#238a7e]/20 transition-all text-sm font-medium"
          />
        </div>
      </div>

      {/* Suggested Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 px-2">
          <Compass className="w-4 h-4 text-[#af8d4a]" />
          <h3 className="font-bold text-sm uppercase tracking-widest text-[#264653]/40">Suggested for you</h3>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
          {[1, 2, 3, 4].map((i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="min-w-[140px] bg-white p-5 rounded-[2.5rem] shadow-lg shadow-[#264653]/5 flex flex-col items-center text-center border border-white/40"
            >
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-2xl bg-[#238a7e]/10 flex items-center justify-center overflow-hidden ring-4 ring-white shadow-md">
                   <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#af8d4a] p-1 rounded-lg border-2 border-white">
                  <UserPlus className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <p className="font-bold text-[#264653] text-[10px] mb-1 truncate w-full">Adventurer_{i}</p>
              <button className="text-[8px] font-black uppercase text-[#238a7e] tracking-tighter">Follow</button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Friends List */}
      <div className="space-y-4 pb-32">
        <div className="flex items-center gap-2 mb-4 px-2">
           <Star className="w-4 h-4 text-[#af8d4a]" />
           <h3 className="font-bold text-sm uppercase tracking-widest text-[#264653]/40">My Friends</h3>
        </div>

        {friends.map((friend, idx) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={friend.id}
            className="group bg-white p-4 rounded-3xl shadow-xl shadow-[#264653]/5 border border-white/40 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <img 
                src={friend.avatar} 
                alt={friend.name} 
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-gray-50 shadow-sm"
              />
              <div>
                <h4 className="font-bold text-[#264653] text-sm">{friend.name}</h4>
                <div className="flex items-center gap-1.5 capitalize text-[10px] font-semibold text-[#238a7e] bg-[#238a7e]/5 px-2 py-0.5 rounded-full mt-1 w-fit">
                   <span className="w-1 h-1 rounded-full bg-[#238a7e] animate-pulse" />
                   {friend.status}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-gray-50 text-[#264653] hover:text-[#238a7e] rounded-2xl transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </motion.button>
              <button className="p-3 text-[#264653]/10 hover:text-[#264653]/40 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Friends;

