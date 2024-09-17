import React, { useState, useEffect, useRef, useCallback, memo } from 'react';

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface ChatWindowProps {
  chatId: string;
  messages: Message[];
  onSendMessage: (content: string) => void;
  currentChat: any;
  currentUser: { _id: string; name: string; avatar?: string };
}

const MessageItem = memo(({ message, isUser }: { message: Message; isUser: boolean }) => (
  <div className={`message ${isUser ? 'user' : 'other'}`}>
    <p>{message.content}</p>
    <span className="timestamp">{new Date(message.createdAt).toLocaleTimeString()}</span>
  </div>
));

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId, messages, onSendMessage, currentChat, currentUser }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2>{currentChat?.isGroupChat ? currentChat.chatName : currentChat?.users.find((u: any) => u._id !== currentUser._id)?.name}</h2>
      </div>
      <div className="messages">
        {messages.map((message) => (
          <MessageItem 
            key={message._id} 
            message={message} 
            isUser={message.sender._id === currentUser._id} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default memo(ChatWindow);
