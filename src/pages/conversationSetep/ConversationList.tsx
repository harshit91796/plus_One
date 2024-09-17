import React from 'react';
import { Link } from 'react-router-dom';

interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: Array<{ _id: string; name: string }>;
  latestMessage?: {
    content: string;
    sender: { name: string };
  };
}

interface ConversationListProps {
  chats: Chat[];
  onSelectChat: (chatId: string) => void;
  selectedChatId: string | null;
  user: { _id: string; name: string };
}

const ConversationList: React.FC<ConversationListProps> = ({ chats, selectedChatId, user }) => {
  if (!chats || chats.length === 0) {
    return <div className="no-conversations">No conversations yet.</div>;
  }

  return (
    <div className="conversation-list">
      {chats.map((chat) => (
        <Link
          key={chat._id}
          to={`/conversation/direct/message/${chat._id}`}
          className={`chat-item ${chat._id === selectedChatId ? 'selected' : ''}`}
        >
          <div className="chat-avatar">
            {chat.isGroupChat ? 'G' : chat.users.find(u => u._id !== user._id)?.name.charAt(0)}
          </div>
          <div className="chat-info">
            <h3>{chat.isGroupChat ? chat.chatName : chat.users.find(u => u._id !== user._id)?.name}</h3>
            <p>{chat.latestMessage ? `${chat.latestMessage.sender.name}: ${chat.latestMessage.content}` : 'No messages yet'}</p>
          </div>
          {chat.latestMessage && (
            <div className="chat-time">
              {new Date(chat.latestMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </Link>
      ))}
    </div>
  );
};

export default ConversationList;
