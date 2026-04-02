import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getMyChatsAPI } from '../../api/axios.js';
import ChatList from '../../components/chat/ChatList.jsx';
import ChatWindow from '../../components/chat/ChatWindow.jsx';
import Loader from '../../components/common/Loader.jsx';
import { FiMessageSquare, FiSearch, FiMoreVertical } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (location.state?.selectedChat) {
      setSelectedChat(location.state.selectedChat);
    }
  }, [location.state]);

  const fetchChats = async () => {
    try {
      const { data } = await getMyChatsAPI();
      if (data.success) {
        setChats(data.chats);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-light via-cream to-cream-dark">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-mint/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sage/15 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-forest/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 animate-slide-down">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-forest/20">
                <FiMessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-forest-dark">
                  Messages
                </h1>
                <p className="text-sm text-rose-beige">
                  {chats.length} conversation{chats.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-3 rounded-xl glass hover:bg-mint/30 transition-all duration-300 group">
                <FiSearch className="w-5 h-5 text-forest group-hover:scale-110 transition-transform" />
              </button>
              <button className="p-3 rounded-xl glass hover:bg-mint/30 transition-all duration-300 group">
                <FiMoreVertical className="w-5 h-5 text-forest group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Chat Container */}
        <div className="glass rounded-3xl shadow-xl shadow-forest/10 overflow-hidden animate-scale-in">
          <div className="flex h-[calc(100vh-200px)] min-h-[500px] max-h-[800px]">
            {/* Chat List - Hidden on mobile when chat is selected */}
            <div 
              className={`
                w-full md:w-96 lg:w-[400px] border-r border-rose-beige/30
                flex-shrink-0 transition-all duration-300
                ${selectedChat ? 'hidden md:flex' : 'flex'}
                flex-col
              `}
            >
              <ChatList 
                chats={chats} 
                selectedChat={selectedChat} 
                onSelectChat={setSelectedChat} 
              />
            </div>

            {/* Chat Window / Empty State */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <ChatWindow 
                  chat={selectedChat} 
                  onBack={() => setSelectedChat(null)} 
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-mint to-sage flex items-center justify-center shadow-lg shadow-sage/30 animate-bounce-soft">
                      <FiMessageSquare className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-forest flex items-center justify-center animate-pulse-soft">
                      <HiOutlineSparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-forest-dark mb-2 text-center">
                    Select a Conversation
                  </h3>
                  <p className="text-rose-beige text-center max-w-xs">
                    Choose a chat from the list to start messaging with your campus community
                  </p>
                  
                  {/* Decorative elements */}
                  <div className="mt-8 flex gap-3">
                    {[...Array(3)].map((_, i) => (
                      <div 
                        key={i}
                        className="w-3 h-3 rounded-full bg-mint animate-bounce-soft"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;