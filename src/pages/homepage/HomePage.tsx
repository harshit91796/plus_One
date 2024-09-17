import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { fetchPosts, createPost } from '../../Api';
import './home.css';
import { FaHome, FaPlus, FaSearch, FaUser, FaEnvelope } from 'react-icons/fa';
import { IoNotifications } from 'react-icons/io5';
import { useAppDispatch } from '../../redux/hooks/hooks';
import { clearUser } from '../../redux/user/userSlice';

interface Post {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  title: string;
  description: string;
  location: string;
  image: string[];
  createdAt: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    peopleNeeded: 0
  });
  const [messageRequests, setMessageRequests] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetchPosts();
      if (response.success && Array.isArray(response.posts)) {
        setPosts(response.posts);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClick = () => {
    if (user) {
      navigate('/conversations');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createPost(newPost);
      if (response.success) {
        setIsModalOpen(false);
        setNewPost({ title: '', description: '', location: '', date: '', peopleNeeded: 0 });
        loadPosts(); // Reload posts to include the new one
      } else {
        throw new Error('Failed to create post');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    }
  };

  const handleAuthenticatedAction = (action: () => void) => {
    if (user) {
      action();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleLogin = () => {
    setIsAuthModalOpen(false);
    navigate('/login');
  };

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
  };

  const handleMessageRequestChange = (postId: string, message: string) => {
    setMessageRequests({ ...messageRequests, [postId]: message });
  };

  const handleSendMessageRequest = async (postId: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const message = messageRequests[postId];
    if (!message) return;

    try {
      await sendMessageRequest(postId, message);
      // Clear the message input after sending
      setMessageRequests({ ...messageRequests, [postId]: '' });
      // You might want to show a success message to the user here
    } catch (err) {
      console.error('Error sending message request:', err);
      setError('Failed to send message request. Please try again.');
    }
  };

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="home-container">
      <header className="header">
        <div className="app-logo">Logo</div>
        <div className="header-icons">
          <IoNotifications className="icon" />
          <FaEnvelope className="icon" onClick={handleMessageClick} />
          <FaUser className="icon" />
        </div>
        <div>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <main className="main-content">
        <div className="posts-container">
          {posts.map((post) => (
            <div key={post._id} className="post">
              <div className="post-header">
                <img src={post.user.avatar || 'default-avatar.png'} alt={post.user.name} className="user-avatar" />
                <div className="post-info">
                  <span className="user-name">{post.user.name}</span>
                  <span className="post-location">{post.location}</span>
                </div>
              </div>
              {post.image && post.image.length > 0 && (
                <img src={post.image[0]} alt="Post" className="post-image" />
              )}
              <div className="post-content">
                <h2 className="post-title">{post.title}</h2>
                <p className="post-description">{post.description}</p>
              </div>
              {user && (
                <div className="message-request-box">
                  <input
                    type="text"
                    placeholder="Send a message to join this group"
                    value={messageRequests[post._id] || ''}
                    onChange={(e) => handleMessageRequestChange(post._id, e.target.value)}
                  />
                  <button onClick={() => handleSendMessageRequest(post._id)}>Send Request</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      <nav className="bottom-nav">
        <div className="nav-item active">
          <FaHome className="nav-icon" />
         
        </div>
        <div className="nav-item" onClick={() => handleAuthenticatedAction(() => setIsModalOpen(true))}>
          <FaPlus className="nav-icon" />
        
        </div>
        <div className="nav-item" onClick={() => handleAuthenticatedAction(() => navigate('/search'))}>
          <FaSearch className="nav-icon" />
         
        </div>
        <div className="nav-item" onClick={() => handleAuthenticatedAction(() => navigate('/profile'))}>
          <FaUser className="nav-icon" />
         
        </div>
      </nav>
      {isModalOpen && user && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Post</h2>
            <form onSubmit={handleCreatePost}>
              <input
                type="text"
                placeholder="Title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                value={newPost.description}
                onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                required
              ></textarea>
              <input
                type="text"
                placeholder="Location"
                value={newPost.location}
                onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
                required
              />
              <input
                type="date"
                placeholder="Date"
                value={newPost.date}
                onChange={(e) => setNewPost({ ...newPost, date: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="People Needed"
                value={newPost.peopleNeeded}
                onChange={(e) => setNewPost({ ...newPost, peopleNeeded: parseInt(e.target.value) })}
                required
              />
              <div className="modal-buttons">
                <button type="submit">Create Post</button>
                <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isAuthModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Authentication Required</h2>
            <p>Please log in to perform this action.</p>
            <div className="modal-buttons">
              <button onClick={handleLogin}>Log In</button>
              <button onClick={() => setIsAuthModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
