import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid'; 
import CustomAudioPlayer from './customAudio/CustomAudioPlayer';
import { AttachFile, Send } from '@mui/icons-material';

// const addAudioElement = (blob) => {
//   const url = URL.createObjectURL(blob);
//   const audio = document.createElement("audio");
//   audio.src = url;
//   audio.controls = true;
//   document.body.appendChild(audio);
// };

// Initialize Supabase client
const supabaseUrl = 'https://ziruawrcztsttxzvlsuz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppcnVhd3JjenRzdHR4enZsc3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY5MDUyNjcsImV4cCI6MjA0MjQ4MTI2N30.YIYgAo7Z8Kb2PuLZtYYQaymdjAySWqdnzraa-0Loj20';
const supabase = createClient(supabaseUrl, supabaseKey);

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
}

interface ChatWindowProps {
  chatId: string;
  messages: Message[];
  onSendMessage: (chatId: string, content: string, fileUrl?: string, fileType?: string) => Promise<void>;
  currentChat: {isGroupChat: boolean}; // Replace 'any' with the correct type
  currentUser: any; // Replace 'any' with the correct type
}

const getRandomColor = (userId: string) => {
  // Predefined chat colors (similar to WhatsApp)
  const colors = [
    '#FF7675', // pastel red
    '#74B9FF', // light blue
    '#55EFC4', // mint
    '#A8E6CF', // light green
    '#FFB6C1', // light pink
    '#DDA0DD', // plum
    '#87CEEB', // sky blue
    '#98FB98', // pale green
    '#FFA07A', // light salmon
    '#9370DB'  // medium purple
  ];
  
  // Use the userId to consistently get the same color for each user
  const hash = userId.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
};

const MessageItem = memo(({ 
  message, 
  isUser, 
  isGroupChat 
  // currentChat
}: { 
  message: Message; 
  isUser: boolean;
  isGroupChat: boolean;
  // currentChat: object;
}) => {
  const senderColor = useMemo(() => getRandomColor(message.sender._id), [message.sender._id]);
  // console.log("currentChatWindow", currentChat);
  console.log("isGroupChat", isGroupChat);
  return (
    <div className={`message ${isUser ? 'user' : 'other'}`}>
      {isGroupChat && !isUser && (
        <div 
          className="message-sender-name" 
          style={{ color: senderColor }}
        >
          {message.sender.name}
        </div>
      )}
      {message.contentType === 'text' && <p>{message.content}</p>}
      {message.contentType === 'image' && (
        <img className='message-image' src={message.mediaUrl} alt="sent image" />
      )}
      {message.contentType === 'video' && (
        <video className='message-video' src={message.mediaUrl as string} controls />
      )}
      {message.contentType === 'audio' && (
        <CustomAudioPlayer audioSrc={message.mediaUrl as string} />
      )}
      <span className="timestamp">
        {new Date(message.createdAt).toLocaleTimeString()}
      </span>
    </div>
  );
});

const AudioRecorder = ({ 
  onRecordingComplete, 
  onRecordingStateChange 
}: { 
  onRecordingComplete: (blob: Blob) => void;
  onRecordingStateChange: (isRecording: boolean) => void;
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout>();
  const shouldSendRef = useRef(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      shouldSendRef.current = false;

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        if (shouldSendRef.current && chunksRef.current.length > 0) {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
          onRecordingComplete(audioBlob);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      onRecordingStateChange(true);
      setTimer(0);
      timerIntervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      shouldSendRef.current = true; // Set flag to send the recording
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      onRecordingStateChange(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      shouldSendRef.current = false; // Set flag to not send the recording
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      onRecordingStateChange(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    console.log('isRecording:', isRecording);
  }, [isRecording]);

  return (
    <div className="recorder-container">
      {isRecording ? (
        <>
          <div className="recording-indicator">
            <div className="recording-dot" />
            <div className="wave-animation">
              <div className="wave-bar" />
              <div className="wave-bar" />
              <div className="wave-bar" />
              <div className="wave-bar" />
            </div>
            <span className="recording-timer">
              {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div className="recorder-controls">
            <button className="cancel-button" onClick={cancelRecording}>
              ✕
            </button>
            <button className="send-record-button" onClick={stopRecording}>
              ✓ Send
            </button>
          </div>
        </>
      ) : (
        <button 
          className={`record-button ${isRecording ? 'recording' : ''}`}
          onClick={startRecording}
        >
          🎤
        </button>
      )}
    </div>
  );
};

interface ChatWindowProps {
  chatId: string;
  messages: Message[];
  onSendMessage: (chatId: string, content: string, fileUrl?: string, fileType?: string) => Promise<void>;
  currentUser: any; // Replace 'any' with the correct type
  darkMode: any;
 currentChat : {
  isGroupChat : boolean
 }

}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId, messages, onSendMessage, currentUser, darkMode, currentChat }) => { 
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        });
      }, 100); // Small delay to ensure content is rendered
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, []); // Run once on mount

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() || file) {
      let fileUrl;
      let fileType;
      if (file) {
        const fileName = `${uuidv4()}-${file.name}`;
         const {data, error} = await supabase.storage.from('ghosts').upload(`public/${fileName}`, file, {
          cacheControl: '3600',
          upsert: true,
        });
        if (error) {
          console.error('Error uploading image:', error);
        } else {
          console.log('Image uploaded to Supabase:', data);
          fileUrl = `${supabaseUrl}/storage/v1/object/public/ghosts/${data.path}`;
          
          fileType = file.type==='image/png'?'image':file.type==='image/jpeg'?'image':file.type==='image/jpg'?'image':file.type === 'audio/mpeg'?'audio': file.type === 'audio/wav'?'audio': 'video';
          console.log('handleSend fnction Image uploaded to Supabase:', 'chatId:', chatId, 'newMessage:', newMessage.trim(), 'fileUrl:', fileUrl, 'fileType:', fileType , typeof fileUrl);
          await onSendMessage(chatId, newMessage.trim(), fileUrl, fileType);
          setNewMessage('');
          setFile(null);
          scrollToBottom(); // Add scroll after sending
        }
      }
      else{
        await onSendMessage(chatId,newMessage.trim(), fileUrl, fileType);
        setNewMessage('');
        setFile(null);
        scrollToBottom(); // Add scroll after sending
      }
     
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      console.log('File selected:', e.target.files[0].name);
      // await handleSend(e);
      // setNewMessage('');
      // setFile(null);
      // if (fileInputRef.current) {
      //   fileInputRef.current.value = '';
      // }

    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
    console.log('handleAttachClick fnction');
    
    
  };

  useEffect(() => {
    if (file) {
      console.log('File:', file);
    }
  }, [file]);

  const handleAudioUpload = async (audioBlob: Blob) => {
    let fileUrl;
    let fileType;
    const audioFile = new File([audioBlob], 'voice-message.wav', { type: 'audio/wav' });
     const fileName = `${uuidv4()}-${audioFile.name}`;
     const {data, error} = await supabase.storage.from('ghosts').upload(`public/${fileName}`, audioFile, {
      cacheControl: '3600',
      upsert: true,
    });
    if (error) {
      console.error('Error uploading image:', error);
     
    } else {
      fileUrl = `${supabaseUrl}/storage/v1/object/public/ghosts/${data.path}`;
      fileType = 'audio';
      await onSendMessage(chatId, '', fileUrl, fileType);
      scrollToBottom(); // Add scroll after sending audio
    }
    
  };

  return (
    <div className={`chat-window ${darkMode ? 'dark-mode' : ''}`}>
      <div className="messages">
        {messages.map((message) => (
          <MessageItem 
            key={message._id} 
            message={message} 
            isUser={message.sender._id === currentUser._id} 
            isGroupChat={currentChat.isGroupChat}
          />
        ))}
        <div ref={messagesEndRef} style={{ height: '1px', width: '100%' }} />
      </div>
      <form onSubmit={handleSend} className="chat-input">
        <button type="button" className="attach-button" onClick={handleAttachClick}>
          <AttachFile />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,video/*,audio/*"
          style={{ display: 'none' }}
          
        />
        {!isRecording && (
          <>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message..."
              className="input-box"
            />
            <button type="submit" className="send-button"></button>
          </>
        )}
       {newMessage.length>0 || file ? <button type="submit" className={`send-button ${darkMode ? 'dark-mode' : ''}`}><Send /></button>
        :  <AudioRecorder 
        onRecordingComplete={handleAudioUpload}
        onRecordingStateChange={setIsRecording}
      />}
      </form>
    </div>
  );
};

export default memo(ChatWindow);
