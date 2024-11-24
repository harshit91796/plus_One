import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tab, Tabs, Button } from '@mui/material';
import { ArrowBack, Block, Report, PersonAdd, AdminPanelSettings, ExitToApp, Delete } from '@mui/icons-material';
import api from '../../Api';
import { getChatDetails } from '../../Api';
import './UserChatMedia.css';

const UserChatMedia = () => {
  const { userId, chatId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [userData, setUserData] = useState(null);
  const [mediaData, setMediaData] = useState({
    images: [],
    videos: [],
    audio: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [members, setMembers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [groupDetails, setGroupDetails] = useState(null);
  const [groupAdmin, setGroupAdmin] = useState([]);

  useEffect(() => {
    fetchChatDetails();
  }, [chatId]);

  const fetchChatDetails = async () => {
    try {
      setIsLoading(true);
      const response = await getChatDetails(chatId);
      
      if (response.success) {
        setIsGroupChat(response.chat.isGroupChat);
        setGroupDetails(response.chat);
        setMembers(response.chat.users);
        setIsAdmin(response.chat.admins?.includes(userId));
        setGroupAdmin(response.chat.groupAdmin);
        
        if (!response.chat.isGroupChat) {
          const otherUser = response.chat.users.find(user => user._id === userId);
          setUserData(otherUser);
        }
        
        setMediaData({
          images: response.mediaContent.images || [],
          videos: response.mediaContent.videos || [],
          audio: response.mediaContent.audio || []
        });
      }
    } catch (error) {
      console.error('Error fetching chat details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakeAdmin = async (memberId) => {
    try {
      await api.post(`/chat/${chatId}/make-admin`, { userId: memberId });
      fetchChatDetails();
    } catch (error) {
      console.error('Error making user admin:', error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await api.post(`/chat/${chatId}/remove-member`, { userId: memberId });
        fetchChatDetails();
      } catch (error) {
        console.error('Error removing member:', error);
      }
    }
  };

  const handleLeaveGroup = async () => {
    if (window.confirm('Are you sure you want to leave this group?')) {
      try {
        await api.post(`/chat/${chatId}/leave`);
        navigate('/conversations');
      } catch (error) {
        console.error('Error leaving group:', error);
      }
    }
  };

  // Add debugging logs
  useEffect(() => {
    console.log('Current Media Data:', mediaData);
  }, [mediaData]);

  useEffect(() => {
    console.log('Current User Data:', userData);
  }, [userData]);

  const handleBlock = async () => {
    if (window.confirm('Are you sure you want to block this user?')) {
      try {
        await api.post('/user/block', { userId });
        navigate('/conversations');
      } catch (error) {
        console.error('Error blocking user:', error);
      }
    }
  };

  const handleReport = () => {
    // TODO: Implement report functionality
    console.log('Report user:', userId);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="user-chat-media">
      <div className="media-header">
        <ArrowBack onClick={() => navigate(-1)} />
        <h2>{isGroupChat ? 'Group Info' : 'User Profile'}</h2>
      </div>

      <div className="user-info-section">
        {isGroupChat ? (
          <>
            <img 
              src={groupDetails?.groupImage || groupDetails?.profilePic} 
              alt="Group" 
              className="profile-image"
            />
            <h3>{groupDetails?.chatName}</h3>
            <p>{members.length} members</p>
            
            <div className="action-buttons">
              {isAdmin && (
                <Button 
                  variant="outlined" 
                  startIcon={<PersonAdd />}
                  onClick={() => navigate(`/chat/${chatId}/add-members`)}
                >
                  Add Members
                </Button>
              )}
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<ExitToApp />}
                onClick={handleLeaveGroup}
              >
                Leave Group
              </Button>
            </div>

            <div className="members-list">
              <h4>Members</h4>
              {members.map((member) => (
                <div key={member._id} className="member-item">
                  <img 
                    src={member.profilePic || '/default-avatar.png'} 
                    alt={member.name} 
                  />
                  <span>{member.name}</span>
                 
                    {groupAdmin.includes(member._id) && <AdminPanelSettings style={{marginLeft: '10px'}} />}
                    {!groupAdmin.includes(member._id) && 
                      <div className="member-actions">
                      <AdminPanelSettings 
                        onClick={() => handleMakeAdmin(member._id)}
                        className="admin-icon"
                      />
                      <Delete 
                        onClick={() => handleRemoveMember(member._id)}
                        className="remove-icon"
                      />
                    </div>
                    }
                 
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <img 
              src={userData?.profilePic || '/default-avatar.png'} 
              alt="Profile" 
              className="profile-image"
            />
            <h3>{userData?.name}</h3>
            <p>{userData?.email}</p>
            
            <div className="action-buttons">
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<Block />}
                onClick={handleBlock}
              >
                Block User
              </Button>
              <Button 
                variant="outlined" 
                color="warning" 
                startIcon={<Report />}
                onClick={handleReport}
              >
                Report User
              </Button>
            </div>
          </>
        )}
      </div>

      <Tabs 
        value={activeTab} 
        onChange={(_, newValue) => setActiveTab(newValue)}
        centered
      >
        <Tab label={`Images (${mediaData.images.length})`} />
        <Tab label={`Videos (${mediaData.videos.length})`} />
        <Tab label={`Audio (${mediaData.audio.length})`} />
      </Tabs>

      <div className="media-content">
        {activeTab === 0 && (
          <div className="media-grid">
            {mediaData.images.map((image, index) => (
              <div key={index} className="media-item">
                <img src={image.url} alt={`Shared by ${image.sender.name}`} />
                <div className="media-info">
                  <span>{new Date(image.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 1 && (
          <div className="media-grid">
            {mediaData.videos.map((video, index) => (
              <div key={index} className="media-item">
                <video src={video.url} controls />
                <div className="media-info">
                  <span>{new Date(video.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 2 && (
          <div className="audio-list">
            {mediaData.audio.map((audio, index) => (
              <div key={index} className="audio-item">
                <audio src={audio.url} controls />
                <div className="media-info">
                  <span>{new Date(audio.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

  );

};


export default UserChatMedia;
