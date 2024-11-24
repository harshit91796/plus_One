import React from 'react';
import { Link } from 'react-router-dom';

// interface Chat {
//   _id: string;
//   chatName: string;
//   isGroupChat: boolean;
//   groupProfilePic?: string; // Add this line
//   users: Array<{ _id: string; name: string , profilePic?: string }>;
//   latestMessage?: {
//     content: string;
//     sender: { name: string };
//   };
// }




interface ConversationListProps {
  chats: any;
  onSelectChat: (chatId: string) => void;
  selectedChatId: string | null;
  user: any
}

const ConversationList: React.FC<ConversationListProps> = ({ chats , selectedChatId, user }) => {
  if (!chats || chats.length === 0) {
    return <div className="no-conversations">No conversations yet.</div>;
  }

  return (
    <div className="chat-list">
      {chats.map((chat: any) => (
        <Link
         style={{textDecoration: 'none'}}
          key={chat._id}
          to={`/conversation/direct/message/${chat._id}/false`}
          className={`chat-item ${chat._id === selectedChatId ? 'selected' : ''}`}
        >
          <img
            src={chat.isGroupChat 
              ? (chat.groupProfilePic || chat.users.find((u: any) => u._id === user._id)?.profilePic ) 
              : chat.users.find((u: any) => u._id !== user._id)?.profilePic 
            }
            alt={chat.name}
            className="chat-item-avatar"
          />
          <div className="chat-item-content">
            <div className="chat-item-header">
            <p className="chat-name" style={{fontFamily: 'var(--font-heading)'}}>{chat.isGroupChat ? chat.chatName : chat.users.find((u: any)  => u._id !== user._id)?.name}</p>
              <span className="chat-item-time">
                {chat.latestMessage?.timestamp ? new Date(chat.latestMessage.timestamp).toLocaleTimeString() : ''}
              </span>
            </div>
            <p className="chat-item-message">
              {chat.latestMessage?.content || 'No messages yet'}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ConversationList;
