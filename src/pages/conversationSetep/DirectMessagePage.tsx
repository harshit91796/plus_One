import React, { useReducer, useEffect, useCallback, useRef, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ChatWindow from './ChatWindow';
import { getMessages, sendMessage } from '../../Api';
import { initSocket, joinChatRoom, leaveRoom, onMessageReceived, socketSendMessage } from '../../socket';
import './DirectMessage.css';

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

type MessageAction = 
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: { tempId: string; actualMessage: Message } };

const messageReducer = (state: Message[], action: MessageAction): Message[] => {
  switch (action.type) {
    case 'SET_MESSAGES':
      return action.payload;
    case 'ADD_MESSAGE':
      return [...state, action.payload];
    case 'UPDATE_MESSAGE':
      return state.map(msg => 
        msg._id === action.payload.tempId ? action.payload.actualMessage : msg
      );
    default:
      return state;
  }
};

const DirectMessagePage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.user.user);
  const [messages, dispatch] = useReducer(messageReducer, []);
  const [currentChat, setCurrentChat] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef<any>(null);
  const lastSentMessageRef = useRef<string | null>(null);

  console.log("currentChat",currentChat);
  

  const loadMessages = useCallback(async () => {
    if (!chatId) return;
    setIsLoading(true);
    try {
      const fetchedData = await getMessages(chatId);
      if (Array.isArray(fetchedData.messages) && fetchedData.messages.length > 0) {
        dispatch({ type: 'SET_MESSAGES', payload: fetchedData.messages });
        console.log("fetchedData",fetchedData);
        setCurrentChat(fetchedData.chat);
      } else {
        dispatch({ type: 'SET_MESSAGES', payload: [] });
        setCurrentChat(null);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    if (currentUser && chatId) {
      loadMessages();
      if (!socketRef.current) {
        socketRef.current = initSocket(currentUser._id);
        onMessageReceived((newMessage) => {
          if (newMessage.chat._id === chatId) {
            if (newMessage.sender._id !== currentUser._id) {
              dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
            } else {
              dispatch({ type: 'UPDATE_MESSAGE', payload: { tempId: lastSentMessageRef.current!, actualMessage: newMessage } });
              lastSentMessageRef.current = null;
            }
          }
        });
      }
      joinChatRoom(chatId);
      return () => {
        leaveRoom(chatId);
      };
    }
  }, [currentUser, chatId, loadMessages]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!chatId) return;
    const tempId = Date.now().toString();
    const tempMessage: Message = {
      _id: tempId,
      content,
      sender: currentUser,
      createdAt: new Date().toISOString(),
    };
    lastSentMessageRef.current = tempId;
    dispatch({ type: 'ADD_MESSAGE', payload: tempMessage });
    try {
      const response = await sendMessage(chatId, content);
      socketSendMessage({
        ...response,
        chat: { _id: chatId, users: currentChat.users }
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [chatId, currentUser, currentChat]);

  const memoizedChatWindow = useMemo(() => (
    <ChatWindow
      chatId={chatId!}
      messages={messages}
      onSendMessage={handleSendMessage}
      currentChat={currentChat}
      currentUser={currentUser}
    />
  ), [chatId, messages, handleSendMessage, currentChat, currentUser]);

  const handleBack = () => {
    navigate('/conversations');
  };

  if (!currentUser) {
    return <div>Loading user...</div>;
  }

  return (
    <div className="chat-container">
      {/* Header Section */}
      <div className="chat-header">
        <div className="profile-info">
          <img
            src="https://via.placeholder.com/40"
            alt={currentChat?.isGroupChat ? currentChat.chatName : currentChat?.users.find((u: any) => u._id !== currentUser._id)?.name}
            className="profile-pic"
          />
          <div className="user-status">
            <p className="user-name">{currentChat?.isGroupChat ? currentChat.chatName : currentChat?.users.find((u: any) => u._id !== currentUser._id)?.name}</p>
            <p className="status">Online</p>
          </div>
        </div>
        <div className="header-icons">
          <button className="icon-button">📞</button>
          <button className="icon-button">🎥</button>
        </div>
      </div>

      {/* Chat Window */}
      {isLoading ? (
        <div>Loading chat...</div>
      ) : currentChat ? (
        memoizedChatWindow
      ) : (
        <div>Failed to load chat. Please try again.</div>
      )}
    </div>
  );
};

export default DirectMessagePage;
