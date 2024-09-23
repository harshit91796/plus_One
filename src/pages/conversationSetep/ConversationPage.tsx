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
  const [selectedTab, setSelectedTab] = useState<'general' | 'groups' | 'requests'>('general');
  const [filteredChats, setFilteredChats] = useState([]);


  useEffect(() => {
    if (selectedTab === 'general') {
      setFilteredChats(chats.filter(chat => chat.isTemporary === false && chat.isGroupChat === false));
    } else if (selectedTab === 'groups') {
      setFilteredChats(chats.filter(chat => chat.isTemporary === false && chat.isGroupChat === true));
    } else if (selectedTab === 'requests') {
      setFilteredChats(chats.filter(chat => chat.isTemporary === true ));
    }
  }, [selectedTab, chats]);

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
    <div className="chat-container">
      {/* Header Section */}
      <div className="chat-header">
        <h1>Chats</h1>
        <i className="fas fa-search"></i>
      </div>

      {/* Story Section */}
      <div className="story-section">
        <div className="story">
          <div className="add-story">
            <span>+</span>
          </div>
          <p>Add story</p>
        </div>
        {['Terry', 'Craig', 'Roger', 'Nolan'].map((user, index) => (
          <div className="story" key={index}>
            <img src={`user${index + 1}.png`} alt={user} />
            <p>{user}</p>
          </div>
        ))}
      </div>

      {/* Tabs Section */}
      <div className="tabs">
         <button className={`tab ${selectedTab === 'general' ? 'active' : ''}`} onClick={() => setSelectedTab('general')}>General</button>
        <button className={`tab ${selectedTab === 'groups' ? 'active' : ''}`} onClick={() => setSelectedTab('groups')}>Groups</button>
        <button className={`tab ${selectedTab === 'requests' ? 'active' : ''}`} onClick={() => setSelectedTab('requests')}>Requests</button>
      </div>

      {/* Chat List */}
      <div className="chat-list">
        <ConversationList
          chats={filteredChats}
          onSelectChat={handleSelectChat}
          selectedChatId={selectedChatId}
          user={user}
        />
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <i className="fas fa-home"></i>
        <button className="new-chat-btn">+ New Chat</button>
        <i className="fas fa-bars"></i>
      </div>
    </div>
  );
};

export default ConversationPage;
