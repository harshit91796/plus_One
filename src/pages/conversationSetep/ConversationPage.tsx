import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import { getChats, getMessages, accessChat, searchUsers, sendMessage as apiSendMessage, logout } from '../../Api';
import { useAppSelector, useAppDispatch } from '../../redux/hooks/hooks';
import { setUser, clearUser } from '../../redux/user/userSlice';
import './Conversation.css';
import { initSocket, joinChatRoom, leaveRoom, socketSendMessage as socketSendMessage, onMessageReceived, disconnectSocket } from '../../socket';

const ConversationPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChats = useCallback(async () => {
    console.log('ConversationPage: Loading chats');
    setLoading(true);
    setError(null);
    try {
      const fetchedChats = await getChats();
      console.log('ConversationPage: Fetched chats:', fetchedChats);
      setChats(fetchedChats);
      if (fetchedChats.length > 0) {
        setSelectedChatId(fetchedChats[0]._id);
      }
    } catch (error) {
      console.error('ConversationPage: Error loading chats:', error);
      setError('Failed to load chats. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      console.log('ConversationPage: Initializing socket for user:', user._id);
      const socket = initSocket(user._id);
      
      onMessageReceived((newMessage) => {
        console.log('New message received:', newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === newMessage.chat._id ? { ...chat, latestMessage: newMessage } : chat
          )
        );
      });

      loadChats();
    }

    return () => {
      console.log('ConversationPage: Cleanup - Disconnecting socket');
      disconnectSocket();
    };
  }, [user, loadChats]);

  useEffect(() => {
    if (selectedChatId) {
      joinChatRoom(selectedChatId);
      loadMessages(selectedChatId);
    }
    return () => {
      if (selectedChatId) {
        leaveRoom(selectedChatId);
      }
    };
  }, [selectedChatId]);

  const loadMessages = async (chatId: string) => {
    setError(null);
    try {
      const fetchedMessages = await getMessages(chatId);
      console.log('Fetched messages:', fetchedMessages);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Failed to load messages. Please try again.');
    }
  };

  const handleSendMessage = async (content: string) => {
    if (selectedChatId) {
      setError(null);
      try {
        console.log('Sending message:', content);
        const newMessage = await apiSendMessage(selectedChatId, content);
        console.log('New message sent:', newMessage);
        socketSendMessage({
          ...newMessage,
          chat: { _id: selectedChatId, users: chats.find(c => c._id === selectedChatId)?.users }
        });
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === selectedChatId ? { ...chat, latestMessage: newMessage } : chat
          )
        );
      } catch (error) {
        console.error('Error sending message:', error);
        setError('Failed to send message. Please try again.');
      }
    }
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      try {
        const results = await searchUsers(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching users:', error);
        setError('Failed to search users. Please try again.');
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectSearchResult = async (userId: string) => {
    setError(null);
    try {
      const chat = await accessChat(userId);
      if (!chats.find(c => c._id === chat._id)) {
        setChats([chat, ...chats]);
      }
      setSelectedChatId(chat._id);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error accessing chat:', error);
      setError('Failed to access chat. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(clearUser());
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      setError('Failed to logout. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading conversations...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="app-logo">A</div>
          <input 
            type="text" 
            placeholder="Search" 
            className="search-input" 
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        {searchResults.length > 0 && (
         <div className="search-results-container">
           <ul className="search-results">
            {searchResults.map((user) => (
              <li key={user._id} onClick={() => handleSelectSearchResult(user._id)}>
                {user.name}
              </li>
            ))}
          </ul>
         </div>
        )}
        <nav className="sidebar-nav">
          <button className="nav-item active">All chats</button>
          <button className="nav-item">Groups</button>
          <button className="nav-item">Friends</button>
          <button className="nav-item">News</button>
          <button className="nav-item">Archive chats</button>
        </nav>
        <div className="user-profile">
          <img src={user?.avatar || 'default-avatar.png'} alt="Profile" className="user-avatar" />
          <span className="user-name">{user?.name}</span>
        </div>
        <button className="logout-button" onClick={handleLogout}>Log out</button>
      </aside>
      <main className="main-content">
        <ConversationList
          chats={chats}
          onSelectChat={handleSelectChat}
          selectedChatId={selectedChatId}
          user={user}
        />
        <ChatWindow
          chatId={selectedChatId}
          messages={messages}
          onSendMessage={handleSendMessage}
          currentChat={chats.find(c => c._id === selectedChatId)}
          currentUser={user}
        />
        <div className="group-info">
          <h3>Group Info</h3>
          {/* Add group info content here */}
        </div>
      </main>
    </div>
  );
};

export default ConversationPage;
