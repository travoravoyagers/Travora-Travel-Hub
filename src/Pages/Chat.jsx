import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Send, User } from "lucide-react";
import axios from "axios";
import io from "socket.io-client";

let socket;

const Chat = () => {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const [friend, setFriend] = useState(null);
  const [me, setMe] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchData();
    socket = io(API_URL);

    return () => {
      socket.disconnect();
    };
  }, [friendId, API_URL]);

  useEffect(() => {
    if (me && socket) {
      socket.emit("join_chat", me.id);
      
      socket.on("receive_message", (message) => {
        if (message.sender_id === friendId) {
          setMessages((prev) => [...prev, message]);
        }
      });
    }

    return () => {
      if (socket) socket.off("receive_message");
    }
  }, [me, friendId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [chatRes, friendRes, meRes] = await Promise.all([
        axios.get(`${API_URL}/api/chat/${friendId}`, { headers }),
        axios.get(`${API_URL}/api/user/${friendId}`, { headers }),
        axios.get(`${API_URL}/api/auth/me`, { headers })
      ]);
      setMessages(chatRes.data);
      setFriend(friendRes.data);
      setMe(meRes.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await axios.post(`${API_URL}/api/chat/${friendId}`, { content: newMessage }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  if (!friend || !me) {
    return (
      <div className="min-h-screen bg-[#fcf9f2] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#238a7e] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf9f2] text-[#264653] flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-[#fcf9f2]/80 backdrop-blur-md px-4 py-4 flex items-center gap-4 shadow-sm">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-2xl shadow-sm border border-white/40 hover:bg-gray-50"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white">
            {friend.profileImage ? (
              <img src={friend.profileImage} alt={friend.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 m-2.5 text-gray-400" />
            )}
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-[#264653]">
              {friend.name}
            </h1>
            <p className="text-[10px] uppercase font-bold text-[#238a7e]">Friend</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto pb-24 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-sm text-[#264653]/40 bg-white/50 rounded-3xl border border-dashed border-[#264653]/20">
            Say hi to {friend.name}!
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender_id === me.id;
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[75%] px-4 py-3 rounded-[1.5rem] shadow-sm ${
                  isMe 
                    ? "bg-[#238a7e] text-white rounded-tr-sm" 
                    : "bg-white text-[#264653] border border-white/40 rounded-tl-sm"
                }`}>
                  <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                  <p className={`text-[9px] mt-1 text-right uppercase font-bold tracking-wider ${
                    isMe ? "text-white/70" : "text-[#264653]/40"
                  }`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 w-full bg-[#fcf9f2] p-4 pb-6">
        <form onSubmit={handleSendMessage} className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-5 py-4 bg-white rounded-3xl outline-none focus:ring-2 focus:ring-[#238a7e]/30 shadow-lg shadow-[#264653]/5 border border-gray-100 text-sm"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!newMessage.trim()}
            className="p-4 bg-[#264653] text-white rounded-3xl shadow-lg shadow-[#264653]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
