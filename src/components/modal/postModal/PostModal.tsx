import React, { useState } from 'react';
import './PostModal.css';
import { Male, Female, SupervisedUserCircle, Diversity2, Close, CalendarMonth, LocationOn, FmdGoodOutlined, KeyboardArrowDown, KeyboardArrowUp, Send } from '@mui/icons-material';
import { sendMessageRequest } from '../../../Api';
import { toast } from 'react-toastify';

interface PostModalProps {
  post: {
    _id: string;
    user: {
      _id: string;
      name: string;
      avatar?: string;
      profilePic?: string;
    };
    image: Array<{ imageUrl: string; imageDescription: string }>;
    title: string;
    description: string;
    location: {
      type: string;
      coordinates: number[];
      formatted: string;
    };
    peopleNeeded: number;
    maleNeeded: number;
    femaleNeeded: number;
    joined: number;
    maleJoined: number;
    femaleJoined: number;
    checkpoints: string[];
    createdAt: string;
    requests: Array<{ user: string }>;
    budget: {
      tier: string;
      min: number;
      max: number;
    };
    joinedCounts: {
      total: number;
      male: number;
      female: number;
      remainingSpots: number;
      remainingMale: number;
      remainingFemale: number;
    };
  }
  onClose: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ post, onClose }) => {
  const [isRouteVisible, setIsRouteVisible] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendRequest = async () => {
    try {
      await sendMessageRequest( post.user._id, post._id, message);
      toast.success('Request sent successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to send request');
    }
  };

  const hasCheckpoints = post.checkpoints && post.checkpoints.length > 0;
  const startPoint = hasCheckpoints ? post.checkpoints[0] : '';
  const endPoint = hasCheckpoints ? post.checkpoints[post.checkpoints.length - 1] : '';
  const middleCheckpoints = hasCheckpoints && post.checkpoints.length >= 3 
    ? post.checkpoints.slice(1, -1) 
    : [];


  console.log('postModal', post);

  return (
    <div className="post-modal-overlay" onClick={onClose}>
      <div className="post-modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <Close />
        </button>

        {/* Image Carousel */}
        <div className="modal-carousel">
          {post.image.map((img, index) => (
            <div key={index} className="modal-image">
              <img src={img.imageUrl} alt={`Post Image ${index + 1}`} />
            </div>
          ))}
        </div>

        {/* Post Details */}
        <div className="modal-details">
          {/* User Info */}
          <div className="modal-user-info">
            <img 
              src={post.user.profilePic || '/default-avatar.png'} 
              alt={post.user.name} 
              className="user-avatar"
            />
            <div className="user-details">
              <h4>{post.user.name}</h4>
              <p>{post.location.formatted}</p>
            </div>
          </div>

          {/* Title and Description */}
          <h2 className='modal-title'>{post.title}</h2>
          <p className="description">{post.description}</p>

          {/* Stats Section */}
          <div className="modal-stats">
            <div className="total-needed">
              <Diversity2 style={{ color: '#dbd553' }} />
              <span>{post.peopleNeeded} People Needed</span>
            </div>

            <div className="gender-stats">
              <div className="stat-item">
                <Male style={{ color: '#4a93e7' }} />
                <span>{post.maleNeeded} Needed ({post.joinedCounts.male} Joined)</span>
              </div>
              <div className="stat-item">
                <Female style={{ color: 'pink' }} />
                <span>{post.femaleNeeded} Needed ({post.joinedCounts.female} Joined)</span>
              </div>
              <div className="stat-item">
                <SupervisedUserCircle />
                <span>{post.joinedCounts.total} Total Joined</span>
              </div>
            </div>

            <div className='trip-date'>
              <div className='trip-date-icon'>
                <h1>Date</h1>
                <CalendarMonth />
              </div>
              <div className='trip-date-text'>
                <h3>From</h3>
                <span>5 Aug 2024</span>
                <h3>To</h3>
                <span>10 Aug 2024</span>
              </div>
            </div>

            <div className='trip-map'>
              {/* Toggle Button */}
              <div 
                className='trip-map-header'
                onClick={() => setIsRouteVisible(!isRouteVisible)}
              >
                <div className="header-content">
                  <h1>Trip Route</h1>
                  <LocationOn />
                </div>
                <button className="toggle-button">
                  {isRouteVisible ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </button>
              </div>
              
              {/* Route Container with animation */}
              <div className={`route-container ${isRouteVisible ? 'visible' : ''}`}>
                {/* Only render route points if checkpoints exist */}
                {hasCheckpoints && (
                  <>
                    {/* Starting Point */}
                    <div className='route-point start'>
                      <div className='point-marker'>
                        <FmdGoodOutlined />
                      </div>
                      <div className='point-details'>
                        <h3>Starting Point</h3>
                        <span>{startPoint}</span>
                      </div>
                    </div>

                    {/* Middle Checkpoints */}
                    {middleCheckpoints.map((checkpoint, index) => (
                      <div key={index} className='route-point checkpoint'>
                        <div className='point-marker'>
                          <div className='checkpoint-dot'></div>
                        </div>
                        <div className='point-details'>
                          <h3>Checkpoint {index + 2}</h3>
                          <span>{checkpoint}</span>
                        </div>
                      </div>
                    ))}

                    {/* Destination */}
                    <div className='route-point destination'>
                      <div className='point-marker'>
                        <LocationOn />
                      </div>
                      <div className='point-details'>
                        <h3>Destination</h3>
                        <span>{endPoint}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className='trip-budget'>
              <h1>Budget</h1>
              <div className='budget-tier-container'>
                {post.budget && (
                  <>
                    {post.budget.tier === 'backpacker' && (
                      <div className='budget-tier backpacker'>
                        <h3>Backpacker</h3>
                        <span className='price'>₹2,000 - ₹5,000</span>
                        <span className='description'>Budget-friendly, basic accommodations and local transport</span>
                      </div>
                    )}

                    {post.budget.tier === 'Comfort Seeker' && (
                      <div className='budget-tier comfort'>
                        <h3>Comfort Seeker</h3>
                        <span className='price'>₹5,000 - ₹12,000</span>
                        <span className='description'>Mid-range hotels and comfortable travel options</span>
                      </div>
                    )}

                    {post.budget.tier === 'Luxury Explorer' && (
                      <div className='budget-tier luxury'>
                        <h3>Luxury Explorer</h3>
                        <span className='price'>₹12,000+</span>
                        <span className='description'>Premium resorts and exclusive experiences</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="request-section">
            <div className="message-request-box">
              <input
                type="text"
                placeholder="Write a message to join..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button 
                className="send-request-button"
                onClick={handleSendRequest}
                disabled={!message.trim()}
              >
                <Send /> Send Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
