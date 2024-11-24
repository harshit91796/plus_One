import React, { useReducer, useEffect, useCallback, useRef, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ChatWindow from './ChatWindow';
import { getMessageRequest, getMessages, handleMessageRequest, sendMessage } from '../../Api';
import { initSocket, joinChatRoom, leaveRoom, onMessageReceived, socketSendMessage } from '../../socket';
import './DirectMessage.css';
import { ArrowBackIos, Call, VideoCall } from '@mui/icons-material';

interface Message {
  _id: string;
  content: string;
  contentType: 'text' | 'image' | 'video' | 'audio';
  mediaUrl?: string;
  sender: {
    _id: string;
    name: string;
  };
  createdAt: string;
  isGroupChat: boolean;
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
  const { chatId ,newChat } = useParams<{ chatId: string ,newChat:string}>();
  const { darkMode } = useSelector((state: any) => state.theme);
  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.user.user);
  const [messages, dispatch] = useReducer(messageReducer, []);
  const [currentChat, setCurrentChat] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef<any>(null);
  const lastSentMessageRef = useRef<string | null>(null);
  const [messageRequest, setMessageRequest] = useState<any>(null);

  // console.log("currentChat", currentChat.isGroupChat);

  // console.log("newChat", newChat);

  useEffect(() => {
    if (newChat === "true") {
      setTimeout(() => {
        loadMessages();
      }, 1000);
    }
  }, [newChat]);

  const loadMessages = useCallback(async () => {
    if (!chatId) return;
    setIsLoading(true);
    try {
      const fetchedData = await getMessages(chatId);
      if (fetchedData.chat.messageRequests) {
        const requestResponse = await getMessageRequest(fetchedData.chat.messageRequests);
        console.log("requestResponseMessageRequestPage", requestResponse);
        setMessageRequest(requestResponse.messageRequest);
      }
      if (Array.isArray(fetchedData.messages) && fetchedData.messages.length > 0) {
        dispatch({ type: 'SET_MESSAGES', payload: fetchedData.messages });
        setCurrentChat(fetchedData.chat);
      } else {
        dispatch({ type: 'SET_MESSAGES', payload: [] });
        setCurrentChat(fetchedData.chat);
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

  const handleSendMessage = useCallback(async (chatId: string, content: string, fileUrl?: string, fileType?: string) => {
    console.log('handleSendMessage function called with:', 'fileType:', fileType ,"fileUrl:", fileUrl , "content:", content , "chatId:", chatId);
    if (!chatId) return;
    const tempId = Date.now().toString();
    const tempMessage: Message = {
      _id: tempId,
      content,
      contentType: (fileType as "audio" | "video" | "text" | "image") || 'text',
      mediaUrl: fileUrl,
      sender: currentUser,
      createdAt: new Date().toISOString(),
      isGroupChat: currentChat.isGroupChat
    };
    lastSentMessageRef.current = tempId;
    dispatch({ type: 'ADD_MESSAGE', payload: tempMessage });
    try {
      const response = await sendMessage(chatId, content, fileUrl ?? '', fileType ?? '');
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
      darkMode={darkMode}
      chatId={chatId!}
      messages={messages}
      onSendMessage={(chatId: string, content: string, fileUrl?: string, fileType?: string) => 
        handleSendMessage(chatId, content, fileUrl || '', fileType || '')
      }
      currentChat={currentChat}
      currentUser={currentUser}
      // isGroupChat={currentChat.isGroupChat}
    />
  ), [chatId, messages, handleSendMessage, currentChat, currentUser]);

  const handleBack = () => {
    navigate('/conversations');
  };

  if (!currentUser) {
    return <div>Loading user...</div>;
  }

  const handleAccept = async () => {
    const response = await handleMessageRequest(currentChat.messageRequests, "accept");
    if (response.status === "accepted") {
      loadMessages();
    }
  };

  const handleUserProfileClick = () => {

    if (currentChat) {
      const otherUser = currentChat.users.find((u: any) => u._id !== currentUser._id);
      navigate(`/user/${otherUser._id}/chat/${chatId}/media`);
    }
  };

  return (
    <div className={`chat-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Header Section */}
      <div className="chat-header">
        <ArrowBackIos onClick={() => navigate('/conversations')} />
        <div className="profile-info-chatPage-container" onClick={handleUserProfileClick} style={{ cursor: 'pointer' }}>
          {currentChat && currentChat.users && (
            <img
              src={currentChat.isGroupChat 
                ? currentChat.profilePic || currentChat.users.find((u: any) => u._id === currentUser._id)?.profilePic 
                : currentChat.users.find((u: any) => u._id !== currentUser._id)?.profilePic || 'https://via.placeholder.com/40'}
              alt={currentChat.isGroupChat 
                ? currentChat.chatName 
                : currentChat.users.find((u: any) => u._id !== currentUser._id)?.name}
              className="profile-pic"
            />
          )}
          <div className="user-status">
            <p className="user-name">
              {currentChat?.isGroupChat 
                ? currentChat.chatName 
                : currentChat?.users?.find((u: any) => u._id !== currentUser._id)?.name}
            </p>
            <p className="status">Online</p>
          </div>
        </div>
        <div className="header-icons">
          <button className="icon-button"><Call /></button>
          <button className="icon-button"><VideoCall /></button>
        </div>
      </div>

      {/* Message Request Banner - Moved and Redesigned */}
      {currentChat?.isTemporary && messageRequest?.status === "pending" && messageRequest?.sender !== currentUser._id && messageRequest?.receiver === currentUser._id && (
        <div className="message-request-banner">
          <div className="message-request-content">
            <span>Message Request</span>
            <p>Would you like to accept messages from this user?</p>
            <div className="message-request-actions">
              <button className="accept-button" onClick={handleAccept}>Accept</button>
              <button className="decline-button">Decline</button>
            </div>
          </div>
        </div>
      )}

      {/* Back button */}
      <div className="back-button" onClick={handleBack}>
        <i className="fas fa-arrow-left">
          <span className='back-button-text'>Back</span>
        </i>
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
