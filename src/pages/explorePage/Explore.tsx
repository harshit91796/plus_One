import React, { useState } from "react";
import "./explore.css";
import { useAppSelector } from "../../redux/hooks/hooks";

import { ArrowBackIosNew } from "@mui/icons-material";
import { Link } from "react-router-dom";

interface Post {
  id: number;
  title: string;
  image: string;
  author: string;
  authorImage?: string;
  description?: string;
  likes?: number;
  comments?: number;
  timestamp?: string;
  matchPercentage?: number;
}

const getMatchColor = (percentage: number): string => {
  if (percentage >= 70) return "#278f7a"; // Green for high match
  if (percentage >= 40) return "#ffd700"; // Yellow for medium match
  return "#ff4d4d"; // Red for low match
};

const Explore: React.FC = () => {
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  
  // Sample data for posts
  const posts: Post[] = [{ id: 1,
    title: "Austrian Alps",
    image: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    author: "Travel and Leisure",
    authorImage: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    description: "Exploring the beautiful landscapes and sharing amazing moments with the community. #Travel #Adventure #Photography",
    likes: 234,
    comments: 42,
    timestamp: "2 hours ago",
    matchPercentage: 85},
   {id: 2,
      title: "Mount Fuji",
    image: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    author: "bhoomika",
    authorImage: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    description: "Exploring the beautiful landscapes and sharing amazing moments with the community. #Travel #Adventure #Photography",
    likes: 234,
    comments: 42,
    timestamp: "2 hours ago",
    matchPercentage: 80},
    {id: 3,
      title: "New York City",
    image: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    author: "dinesh",
    authorImage: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    description: "Exploring the beautiful landscapes and sharing amazing moments with the community. #Travel #Adventure #Photography",
    likes: 234,
    comments: 42,
    timestamp: "2 hours ago",
    matchPercentage: 75},
    {id: 4,
      title: "Paris",
    image: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    author: "karthik",
    authorImage: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    description: "Exploring the beautiful landscapes and sharing amazing moments with the community. #Travel #Adventure #Photography",
    likes: 234,
    comments: 42,
    timestamp: "2 hours ago",
    matchPercentage: 70},
    {id: 5,
      title: "Tokyo",
    image: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    author: "karthik",
    authorImage: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    description: "Exploring the beautiful landscapes and sharing amazing moments with the community. #Travel #Adventure #Photography",
    likes: 234,
    comments: 42,
    timestamp: "2 hours ago",
    matchPercentage: 65},
    {id: 6,
      title: "London",
    image: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    author: "karthik",
    authorImage: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    description: "Exploring the beautiful landscapes and sharing amazing moments with the community. #Travel #Adventure #Photography",
    likes: 234,
    comments: 42,
    timestamp: "2 hours ago",
    matchPercentage: 60},
    {id: 7,
      title: "San Francisco",
    image: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    author: "karthik",
    authorImage: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    description: "Exploring the beautiful landscapes and sharing amazing moments with the community. #Travel #Adventure #Photography",
    likes: 234,
    comments: 42,
    timestamp: "2 hours ago",
    matchPercentage: 55},
    {id: 8,
      title: "Sydney",
    image: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    author: "karthik",
    authorImage: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    description: "Exploring the beautiful landscapes and sharing amazing moments with the community. #Travel #Adventure #Photography",
    likes: 234,
    comments: 42,
    timestamp: "2 hours ago",
    matchPercentage: 50},
    {id: 9,
      title: "Toronto",
    image: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    author: "karthik",
    authorImage: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    description: "Exploring the beautiful landscapes and sharing amazing moments with the community. #Travel #Adventure #Photography",
    likes: 234,
    comments: 42,
    timestamp: "2 hours ago",
    matchPercentage: 45},
    {id: 10,
      title: "Vancouver",
    image: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    author: "karthik",
    authorImage: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    description: "Exploring the beautiful landscapes and sharing amazing moments with the community. #Travel #Adventure #Photography",
    likes: 234,
    comments: 42,
    timestamp: "2 hours ago",
    matchPercentage: 40},
    {id: 11,
      title: "Zurich",
    image: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    author: "karthik",
    authorImage: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    description: "Exploring the beautiful landscapes and sharing amazing moments with the community. #Travel #Adventure #Photography",
    likes: 234,
    comments: 42,
    timestamp: "2 hours ago",
    matchPercentage: 35},
    {id: 12,
      title: "Zurich",
    image: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    author: "karthik",
    authorImage: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    description: "Exploring the beautiful landscapes and sharing amazing moments with the community. #Travel #Adventure #Photography",
    likes: 234,
    comments: 42,
    timestamp: "2 hours ago",
    matchPercentage: 30},
    {id: 13,
      title: "Zurich",
    image: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    author: "karthik",
    authorImage: "https://cdn.usegalileo.ai/sdxl10/040d9b06-95c7-4d87-9975-cfbe22342acb.png",
    description: "Exploring the beautiful landscapes and sharing amazing moments with the community. #Travel #Adventure #Photography",
    likes: 234,
    comments: 42,
    timestamp: "2 hours ago",
    matchPercentage: 25}
  ]

  // State to track selected post
  const [selectedPost, setSelectedPost] = useState<Post>(posts[0]);

  // Handler for grid item click
  const handleGridItemClick = (post: Post) => {
    setSelectedPost(post);
    // Scroll to show card if needed
    document.querySelector('.show-post-card')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`design-root ${darkMode ? "dark" : ""}`}>
      <div className={`header ${darkMode ? "dark" : ""}`}>
        <div className="bell-icon-container">
          {/* <button className="bell-button">
            <div className="bell-icon" data-icon="Bell" data-size="24px" data-weight="regular">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
              </svg>
            </div>
          </button> */}
        </div>
        <Link style={{ textDecoration: "none" ,display: "flex", alignItems: "center" }} to="/">
          <ArrowBackIosNew style={{ color: darkMode ? "white" : "black"  }} className="back-icon" />
        </Link>
        <h1 className="explore-text">Explore</h1>
      </div>

      <div className={`search-bar ${darkMode ? "dark" : ""}`}>
        <label className="search-container">
          <div className="input-wrapper">
            <div className="search-icon" data-icon="MagnifyingGlass" data-size="24px" data-weight="regular">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
              </svg>
            </div>
            <input
              placeholder="Search for anything..."
              className="search-input"
            />
          </div>
        </label>
      </div>

      <div className={`tags-container ${darkMode ? "dark" : ""}`}>
        {["Travel", "Sports", "Movies", "Tech", "Music", "Fashion", "Art"].map((tag) => (
          <div className="tag" key={tag}>
            <p>{tag}</p>
          </div>
        ))}
      </div>

      <div className={`show-post-card ${darkMode ? "dark" : ""}`}>
        <div className="post-header">
          <div className="author-info">
            <img 
              src={selectedPost.authorImage || "default-avatar.png"} 
              alt={selectedPost.author} 
              className="author-avatar"
            />
            <div className="author-details">
              <h3>{selectedPost.author}</h3>
              <span className="timestamp">{selectedPost.timestamp || "2 hours ago"}</span>
            </div>
          </div>
          <div className="match-percentage">
            <svg className="circular-progress" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#444"
                strokeWidth="2"
                strokeDasharray="100, 100"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={getMatchColor(selectedPost.matchPercentage || 0)}
                strokeWidth="2"
                strokeDasharray={`${selectedPost.matchPercentage || 0}, 100`}
              />
            </svg>
            <div className="percentage-text">
              <span 
                className="percentage-value"
                style={{ color: getMatchColor(selectedPost.matchPercentage || 0) }}
              >
                {selectedPost.matchPercentage || 0}
              </span>
              <span className="percentage-symbol" style={{ color: getMatchColor(selectedPost.matchPercentage || 0) }}>%</span>
            </div>
          </div>
        </div>

        <div className="post-content">
          <h2 className="post-title">{selectedPost.title}</h2>
          <img
            src={selectedPost.image}
            alt={selectedPost.title}
            className="post-image"
          />
          <p className="post-description">
            {selectedPost.description || "Exploring the beautiful landscapes and sharing amazing moments with the community. #Travel #Adventure #Photography"}
          </p>
        </div>

        <div className="post-actions">
          <div className="action-buttons">
            <button className="action-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span>{selectedPost.likes || 234}</span>
            </button>
            <button className="action-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
              <span>{selectedPost.comments || 42}</span>
            </button>
          </div>
          <button className="share-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
            Share
          </button>
        </div>
      </div>

      <div className={`grid-container ${darkMode ? "dark" : ""}`}>
        {posts.map((post) => (
          <div
            className={`grid-item ${selectedPost.id === post.id ? 'selected' : ''}`}
            key={post.id}
            onClick={() => handleGridItemClick(post)}
          >
            <img src={post.image} alt={post.title} className="grid-item-image" />
            <div className="grid-item-overlay">
              <div className="grid-item-details">
                <h4>{post.title}</h4>
                <div className="people-needed">
                  <div className="avatar-stack">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="avatar-circle" />
                    ))}
                    <div className="more-people">+2</div>
                  </div>
                  <span className="needed-text">needed</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
