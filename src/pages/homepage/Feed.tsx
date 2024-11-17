import React, { useEffect, useState} from "react";
import './feedMain.css'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/store';
import {  searchPosts, sendMessageRequest } from '../../Api';
import { fetchPlaceSuggestions } from '../../utils/opencage';
import { v4 as uuidv4 } from 'uuid';

import {  ModeNight,  LightMode, Diversity2, Close, Tune, AllInclusive, Male, SupervisedUserCircle, Female, Group, Bookmark, Event, TrendingUp, HelpOutline } from '@mui/icons-material';

// import '../../assets/styles/react-easy-crop.css'; // Import the CSS file
import {
  HomeIcon,
  SearchIcon,
  NotificationsNoneIcon,
  AutoAwesomeMosaicIcon,
  AccountCircleRoundedIcon,
  AddCircleRoundedIcon,
  ExploreOutlinedIcon,
  SettingsIcon,
  LogoutIcon,
  MessageIcon,
  PeopleIcon,
} from "../../assets/Icons";
import { socket } from "../../utils/socket";
import { Link } from "react-router-dom";
import { useAppDispatch } from '../../redux/hooks/hooks';
import { clearUser } from '../../redux/user/userSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppSelector } from '../../redux/hooks/hooks';
import { toggleDarkMode } from '../../redux/theme/themeSlice';
import { FormControlLabel, Slider, styled, Switch } from "@mui/material";
import PostModal from '../../components/modal/postModal/PostModal';



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
  checkpoints: string[];
  createdAt: string;
  requests: Array<{ user: string }>;
  budget: {
    tier: string;
    min: number;
    max: number;
  };
}

// interface NewPost {
//   title: string;
//   description: string;
//   location: string;
//   date: string;
//   peopleNeeded: number;
//   coordinates: number[];
//   image: Array<{ imageUrl: string; description: string }>;
// }

const marks = [
  {
    value: 0,
    label: '0 km',
  },
  {
    value: 20,
    label: '20 km',
  },
  {
    value: 37,
    label: '37 km',
  },
  {
    value: 100,
    label: '100 km',
  },
];

function valuetext(value: number) {
  return `${value} km`;
}

const Feed = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  // const [searchRadius, setSearchRadius] = useState(10);
  // const [newPost, setNewPost] = useState<NewPost>({
  //   title: '',
  //   description: '',
  //   location: '',
  //   date: '',
  //   peopleNeeded: 0,
  //   coordinates: [] as number[],
  //   image: [] 
  // });
  const [messageRequests, setMessageRequests] = useState<{ [key: string]: string }>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<{ formatted: string, coordinates: { lat: number, lng: number } }[]>([]);
 
  const [sentRequests, setSentRequests] = useState<{ [key: string]: boolean }>({});
  const [isSearchRadius, setIsSearchRadius] = useState(false);
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchResults, setSearchResults] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchTitleQuery, setSearchTitleQuery] = useState<string>('');
  // const [searchRadius, setSearchRadius] = useState<Boolean>(false);
  const [searchRadiusRange, setSearchRadiusRange] = useState<number>(10);
  const [currentLocation, setCurrentLocation] = useState<{ currentLatitude: number, currentLongitude: number } | null>(null);
  const [skip, setSkip] = useState(0);
  // const [postLimit, setPostLimit] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  

const postLimit = 4;


  useEffect(() => {
    loadPosts();
    
    socket.on("connect", () => console.log("socket working"));
    console.log('user:', user, 'currentLocation:', currentLocation, 'searchRadiusRange:', searchRadiusRange);
  }, [currentLocation]);

  // Add this useEffect for getting user's location
useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          currentLatitude: position.coords.latitude,
          currentLongitude: position.coords.longitude
        });
      },
      (error) => console.error('Error getting location:', error)
    );
    }
  }, []);

  const loadPosts = async () => {
    try {
      console.log('Loading posts with skip:', skip); // Debug log
      
      const query = new URLSearchParams({
        query: searchQuery,
        skip: skip.toString(),
        limit: postLimit.toString(),
        currentLatitude: currentLocation?.currentLatitude.toString() || '',
        currentLongitude: currentLocation?.currentLongitude.toString() || '',
        range: currentLocation ? (searchRadiusRange*1000).toString() : ''
      }).toString();

      const response = await searchPosts(query);
      if (response.success) {
        if (skip > 0) {
          setPosts(prevPosts => [...prevPosts, ...response.data.posts]);
        } else {
          setPosts(response.data.posts);
        }
        
        setHasMore(response.data.posts.length === postLimit);
        console.log('Posts loaded:', response.data.posts.length, 'hasMore:', response.data.posts.length === postLimit);
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

  // Add this useEffect to trigger search
useEffect(() => {
  loadPosts();
}, [skip, searchQuery]);

// Load posts when page changes


const handleInfiniteScroll = async () => {
  try {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setLoading(true);
      setSkip(prev => prev + postLimit);
    }
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  window.addEventListener("scroll", handleInfiniteScroll);
  return () => window.removeEventListener("scroll", handleInfiniteScroll);
}, []);

  // Add this function for infinite scroll
const loadMore = () => {
  console.log('loading more posts');
  if (hasMore ) {
    setSkip(prevSkip => prevSkip + postLimit);
    
  }
};

  const handleMessageRequestChange = (postId: string, message: string) => {
    setMessageRequests({ ...messageRequests, [postId]: message });
  };

  const handleSendMessageRequest = async (postId: string, receiverId: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    console.log('postId:', postId);
    console.log('receiverId:', receiverId);
    console.log('messageRequests:', messageRequests);

    const message = messageRequests[postId];
    if (!message) return;

    try {
      await sendMessageRequest(receiverId, postId, message);
      setMessageRequests({ ...messageRequests, [postId]: '' });
      setSentRequests({ ...sentRequests, [postId]: true });
      toast.success('Message request sent successfully!');
    } catch (err) {
      console.error('Error sending message request:', err);
      setError('Failed to send message request. Please try again.');
      toast.error('Failed to send message request.');
    }
  };

  const toggleSearchModal = () => {
    setIsSearchModalOpen(!isSearchModalOpen);
  };

  const toggleSearchRadius = () => {
    setIsSearchRadius(!isSearchRadius);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar && !sidebar.contains(event.target as Node) && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
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

  const handleLocationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTitleQuery(query);
    // setNewPost({ ...newPost, location: query });
    if (query.length > 2) {
      const suggestions = await fetchPlaceSuggestions(query);
      setLocationSuggestions(suggestions);
    } else {
      setLocationSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: { formatted: string, coordinates: { lat: number, lng: number } }) => {
    // setNewPost({ 
    //   ...newPost, 
    //   location: suggestion.formatted,
    //   coordinates: [suggestion.coordinates.lng, suggestion.coordinates.lat] // Store coordinates
    // });
    setSearchQuery(suggestion.formatted);

    
    
  };

  const handleSearch = () => {
    console.log('Searching for posts...');
    // Add your search logic here
    setSkip(0);
    setSearchQuery(searchTitleQuery);
    loadPosts();
    setIsSearchModalOpen(false);
    setLocationSuggestions([]);
    setSearchResults(true);
  };

  const closeSearchResults = () => {
    setSearchResults(false);
    setSearchQuery('');
    setSearchTitleQuery('');
    setLocationSuggestions([]);
    setSkip(0);
  };

 
 

  const Android12Switch = styled(Switch)(({ theme }) => (
     console.log(theme),
     theme.palette.primary.main = "#5ac8b0",
    {
   
    padding: 8,
    '& .MuiSwitch-track': {
      borderRadius: 22 / 2,
      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 16,
        height: 16,
        
      },
      '&::before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main),
        )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
        left: 12,
      },
      '&::after': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main),
        )}" d="M19,13H5V11H19V13Z" /></svg>')`,
        right: 12,
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: 'none',
      width: 16,
      height: 16,
      margin: 2,
    },
  }));

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  if (loading) return <div>Loading posts...</div>;
  if (error) {
    dispatch(clearUser());
    navigate('/login');
  }

  return (
    <div className={`feedmain ${darkMode ? 'dark-mode' : ''}`}>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button onClick={toggleSidebar}>&times;</button>
        </div>
        
        <div className="sidebar-content">
          {/* User Profile Section */}
          <div className="user-profile">
            <img src={user?.profilePic || "/default-avatar.png"} alt="Profile" />
            <div className="user-profile-info">
              <h4>{user?.name || "Guest User"}</h4>
              <p>{user?.email || "Please login"}</p>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">Main</div>
            <Link to="/" className="sidebar-item">
              <HomeIcon />
              <span>Home</span>
            </Link>
            <Link to="/explore" className="sidebar-item">
              <ExploreOutlinedIcon />
              <span>Explore</span>
            </Link>
            <Link to="/notifications" className="sidebar-item">
              <NotificationsNoneIcon />
              <span>Notifications</span>
            </Link>
          </div>

          {/* Social Section */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">Social</div>
            <Link to="/conversations" className="sidebar-item">
              <MessageIcon />
              <span>Messages</span>
            </Link>
            <Link to="/friends" className="sidebar-item">
              <PeopleIcon />
              <span>Friends</span>
            </Link>
            <Link to="/groups" className="sidebar-item">
              <Group />
              <span>Groups</span>
            </Link>
          </div>

          {/* Content Section */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">Content</div>
            <Link to="/saved" className="sidebar-item">
              <Bookmark />
              <span>Saved Posts</span>
            </Link>
            <Link to="/events" className="sidebar-item">
              <Event />
              <span>Events</span>
            </Link>
            <Link to="/trending" className="sidebar-item">
              <TrendingUp />
              <span>Trending</span>
            </Link>
          </div>

          {/* Settings Section */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">Preferences</div>
            <Link to="/settings" className="sidebar-item">
              <SettingsIcon />
              <span>Settings</span>
            </Link>
            <div className="sidebar-item" onClick={() => dispatch(toggleDarkMode())}>
              {darkMode ? <LightMode /> : <ModeNight />}
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
            <Link to="/help" className="sidebar-item">
              <HelpOutline />
              <span>Help & Support</span>
            </Link>
          </div>

          <div className="sidebar-divider" />
          
          <button onClick={handleLogout} className="logout-button">
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>
      </div>
      <div className="feed">
        <div className="feedTop">
          <AutoAwesomeMosaicIcon onClick={toggleSidebar} />
           <h2>Blunt</h2>
          <span>
            <ExploreOutlinedIcon/> 
            <NotificationsNoneIcon />
          </span>
        </div>

        {posts.length > 0 ? posts.map((post) => (
          <div 
            key={uuidv4()} 
            className="post-container"
            onClick={() => handlePostClick(post)}
          >
            <div className="progress-wrapper">
              <div className="progress-ring">
                <div className="progress-circle">
                  <span>75%</span>
                </div>
              </div>
            </div>

            <div className="imgcorosel-wrapper">
              <div className="imgcorosel">
                {post.image && post.image.length > 0 && (
                  post.image.map((img, index) => (
                    <div key={index} className="img-container">
                      <img src={img.imageUrl} alt={`Post Image ${index + 1}`} loading="lazy" />
                    </div>
                  ))
                )}
                
              </div>

              {/* Fixed Gender Stats Overlay */}
              <div className="gender-stats">
              <h3>{post.title}</h3>
                 {/* People Needed */}
                 <div className="people-needed">
                    
                        <Diversity2 style={{ color: '#dbd553', marginRight: '5px' }} />
                        <span style={{ color: 'white' }}>{post.peopleNeeded}</span>
                      </div>
                       <div style={{display: 'flex', alignItems: 'center', gap: '10px'}} >
                      { post.maleNeeded || post.femaleNeeded ? (
                        <>
                         {post.maleNeeded ? (
                          <div className="gender-item">
                            <Male className="gender-icon" style={{ color: '#4a93e7' }} />
                            <span>{post.maleNeeded}</span>
                          </div>
                         ) : (
                          <></>
                         )}
                        {post.femaleNeeded ? (
                          <div className="gender-item">
                            <Female className="gender-icon" style={{ color: 'pink' }} />
                            <span>{post.femaleNeeded}</span>
                          </div>
                        ) : (
                          <></>
                        )}
                        </>
                      ) : (
                        <></>
                      )}
                        </div>
                        <div className="gender-item">
                          <SupervisedUserCircle className="gender-icon" />
                          <span>{post.joined} Joined (M : 1, F : 2)</span>
                        </div>
              </div>
            </div>

            <div className="post-container-bottom">
              <div className="user-info">
                <img src={post.user.profilePic || 'default-avatar.png'} alt={post.user.name} />
                <div>
                  <h3>{post.user.name}</h3>
                  <h5>{post.location.formatted}</h5>
                </div>
              </div>
              <p>{post.description}</p>
              {user && !sentRequests[post._id] && !post.requests?.some((request: any) => request.user === user._id) && (
                <div 
                  className={`message-request-box ${darkMode ? 'dark-mode' : ''}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    placeholder="Send a message to join this group"
                    value={messageRequests[post._id] || ''}
                    onChange={(e) => handleMessageRequestChange(post._id, e.target.value)}
                  />
                  <button 
                    className="send-request-button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendMessageRequest(post._id, post.user._id);
                    }}
                  >
                    Send Request
                  </button>
                </div>
              )}
            </div>
          </div>
        )) : <>
        <div className="no-posts">
          <h2>No posts found</h2>
        </div>
        </>}

    {hasMore && !loading && (
      <button 
      
        className="load-more-button" 
        onClick={loadMore}
        style={{
          height: '50px',
          margin: '20px auto',
          padding: '10px 20px',
          display: 'block',
          backgroundColor: '#5ac8b0',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Load More
      </button>
    )}
    {searchResults && (
      <div onClick={closeSearchResults} className="search-results">
        <Close className="close-search-results" onClick={closeSearchResults}/>
      </div>
    )}
      </div>
      <footer>
        <HomeIcon />
        <AddCircleRoundedIcon onClick={() => handleAuthenticatedAction(() => navigate('/createPost'))} />
        <Link to="/explore">
        <AllInclusive/>
        </Link>
        <SearchIcon onClick={toggleSearchModal}/>
        <Link to="/profile">
          <AccountCircleRoundedIcon/>
        </Link>
      </footer>

      {isSearchModalOpen && (
        <div className="modal-overlay">
          
          <div  className="modal">
              {/* <Close onClick={toggleSearchModal}/> */}
                <div style={{display: 'flex', alignItems: 'center',justifyContent: 'space-between', gap: '10px'}}>
                  <h2 style={{marginTop: '20px'}}>Search Posts</h2>
                  <div style={{display: 'flex',justifyContent: 'center', alignItems: 'center',gap: '10px'}}>
                    <FormControlLabel
                      control={<Android12Switch checked={!!currentLocation} onChange={(e) => {
                        if (e.target.checked) {
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              setCurrentLocation({
                                currentLatitude: position.coords.latitude,
                                currentLongitude: position.coords.longitude
                              });
                            }
                          );
                        } else {
                          setCurrentLocation(null);
                        }
                      }} />}
                      label="Search Radius"
                    />
                    <Tune onClick={toggleSearchRadius} />
                    {isSearchRadius && (
                  <div className="modal-overlay">
                <div style={{marginBottom: '20px',color: darkMode ? 'white' : 'black'}} className="modal">
                  <Close onClick={toggleSearchRadius}/>
                  <h2>Search Radius</h2>
                  <Slider
                    style={{color: darkMode ? 'white' : 'black'}}
                    aria-label="Custom marks"
                    value={searchRadiusRange}
                    onChange={(e,value) =>  setSearchRadiusRange(value as number)}
                    getAriaValueText={valuetext}
                    step={1}
                    valueLabelDisplay="auto"
                    marks={marks}
                  />
                </div>
              </div>)}
                  </div>
                </div>
                <input onChange={(e) => handleLocationChange(e)} style={{width: '100%',color: darkMode ? 'white' : 'black'}} type="text" placeholder="Search for users"/> 
                {locationSuggestions.length > 0 && (
                <ul className="suggestions-list">
                  {locationSuggestions.map((suggestion, index) => (
                    <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                      {suggestion.formatted}
                    </li>
                  ))}
                </ul>
              )}

                <div className="modal-buttons">
                  <button type="submit" onClick={() => handleSearch()}>Search</button>
                  <button type="button" onClick={() => setIsSearchModalOpen(false)}>Cancel</button>
                </div>
                
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

      {selectedPost && (
        <PostModal
          post = {selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default Feed;