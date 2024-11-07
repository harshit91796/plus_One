import React, { useState } from 'react';
import './PostModal.css';
import { Male, Female, SupervisedUserCircle, Diversity2, Close, CalendarMonth, LocationOn, FmdGoodOutlined, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

interface PostModalProps {
  post: {
    title: string;
    description: string;
    image: Array<{ imageUrl: string }>;
    peopleNeeded: number;
    maleNeeded: number;
    femaleNeeded: number;
    joined: number;
    maleJoined: number;
    femaleJoined: number;
    user: {
      name: string;
      profilePic?: string;
    };
    location: {
      formatted: string;
    };
  };
  onClose: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ post, onClose }) => {
  const [isRouteVisible, setIsRouteVisible] = useState(false);

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
              <h3>{post.user.name}</h3>
              <p>{post.location.formatted}</p>
            </div>
          </div>

          {/* Title and Description */}
          <h2>{post.title}</h2>
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
                <span>{post.maleNeeded} Needed ({post.maleJoined} Joined)</span>
              </div>
              <div className="stat-item">
                <Female style={{ color: 'pink' }} />
                <span>{post.femaleNeeded} Needed ({post.femaleJoined} Joined)</span>
              </div>
              <div className="stat-item">
                <SupervisedUserCircle />
                <span>{post.joined} Total Joined</span>
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
                {/* Starting Point */}
                <div className='route-point start'>
                  <div className='point-marker'>
                    <FmdGoodOutlined />
                  </div>
                  <div className='point-details'>
                    <h3>Starting Point</h3>
                    <span>Mumbai, Maharashtra</span>
                  </div>
                </div>

                {/* Checkpoints */}
                <div className='route-point checkpoint'>
                  <div className='point-marker'>
                    <div className='checkpoint-dot'></div>
                  </div>
                  <div className='point-details'>
                    <h3>Checkpoint 1</h3>
                    <span>Lonavala</span>
                  </div>
                </div>

                <div className='route-point checkpoint'>
                  <div className='point-marker'>
                    <div className='checkpoint-dot'></div>
                  </div>
                  <div className='point-details'>
                    <h3>Checkpoint 2</h3>
                    <span>Pune</span>
                  </div>
                </div>

                {/* Destination */}
                <div className='route-point destination'>
                  <div className='point-marker'>
                    <LocationOn />
                  </div>
                  <div className='point-details'>
                    <h3>Destination</h3>
                    <span>Mahabaleshwar</span>
                  </div>
                </div>


              </div>

              
            </div>

            <div className='trip-budget'>
                <h1>Budget</h1>
                <div className='budget-tier-container'>
                  <div className='budget-tier backpacker'>
                    <h3>Backpacker</h3>
                    <span className='price'>₹2,000 - ₹5,000</span>
                    <span className='description'>Budget-friendly, basic accommodations and local transport</span>
                  </div>

                  <div className='budget-tier comfort'>
                    <h3>Comfort Seeker</h3>
                    <span className='price'>₹5,000 - ₹12,000</span>
                    <span className='description'>Mid-range hotels and comfortable travel options</span>
                  </div>

                  <div className='budget-tier luxury'>
                    <h3>Luxury Explorer</h3>
                    <span className='price'>₹12,000+</span>
                    <span className='description'>Premium resorts and exclusive experiences</span>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
