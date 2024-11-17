import React, { useState, useEffect } from "react";
import "./explore.css";
import { useAppSelector } from "../../redux/hooks/hooks";
import { ArrowBackIosNew } from "@mui/icons-material";
import { Link } from "react-router-dom";
import {  searchPosts } from '../../Api'; // Import your API functions
import useDebounce from '../../redux/hooks/useDebounce';

interface Post {
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
  matchPercentage?: number;
}

const getMatchColor = (percentage: number): string => {
  if (percentage >= 70) return "#278f7a";
  if (percentage >= 40) return "#ffd700";
  return "#ff4d4d";
};

const Explore: React.FC = () => {
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [skip, setSkip] = useState(0);
  const [postLimit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm !== searchQuery) {
      setSearchQuery(debouncedSearchTerm);
      setSkip(0);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadPosts();
  }, [skip, searchQuery]);

  const loadPosts = async () => {
    try {
      const query = new URLSearchParams({
        query: searchQuery,
        skip: skip.toString(),
        limit: postLimit.toString(),
      }).toString();

      const response = await searchPosts(query);
      if (response.success) {
        if (skip > 0) {
          setPosts(prevPosts => [...prevPosts, ...response.data.posts]);
        } else {
          setPosts(response.data.posts);
        }
        setHasMore(response.data.posts.length === postLimit);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleInfiniteScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setLoading(true);
      setSkip(prev => prev + postLimit);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);
    return () => window.removeEventListener("scroll", handleInfiniteScroll);
  }, []);

  const handleGridItemClick = (post: Post) => {
    setSelectedPost(post);
    document.querySelector('.show-post-card')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (loading && posts.length === 0) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

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
        <span className="explore-text">Explore</span>
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
              value={searchTerm}
              onChange={handleSearch}
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

      {selectedPost && (
        <div className={`show-post-card ${darkMode ? "dark" : ""}`}>
          <div className="post-header">
            <div className="author-info">
              <img 
                src={selectedPost.user.profilePic || "default-avatar.png"} 
                alt={selectedPost.user.name} 
                className="author-avatar"
              />
              <div className="author-details">
                <h3>{selectedPost.user.name}</h3>
                <span className="timestamp">2 hours ago</span>
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
            {selectedPost.image && selectedPost.image[0] && (
              <img
                src={selectedPost.image[0].imageUrl}
                alt={selectedPost.title}
                className="post-image"
              />
            )}
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
                <span>{selectedPost.joined || 234}</span>
              </button>
              <button className="action-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                <span>{selectedPost.joined || 42}</span>
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
      )}

      <div className={`grid-container ${darkMode ? "dark" : ""}`}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              className={`grid-item ${selectedPost?._id === post._id ? 'selected' : ''}`}
              key={post._id}
              onClick={() => handleGridItemClick(post)}
            >
              {post.image && post.image[0] && (
                <img src={post.image[0].imageUrl} alt={post.title} className="grid-item-image" />
              )}
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
          ))
        ) : (
          <div className="no-posts">
            <h2>No posts found</h2>
          </div>
        )}
      </div>

      {hasMore && !loading && (
        <button 
          className="load-more-button"
          onClick={() => setSkip(prev => prev + postLimit)}
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default Explore;
