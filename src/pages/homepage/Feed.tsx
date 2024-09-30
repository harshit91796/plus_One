import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { fetchPosts, createPost, sendMessageRequest } from '../../Api';
import { fetchPlaceSuggestions } from '../../utils/opencage';
import Cropper from 'react-easy-crop';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid'; 
import {  ModeNight,  LightMode, Diversity2 } from '@mui/icons-material';
import imageCompression from 'browser-image-compression';


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
} from "../../assets/Icons";
import { socket } from "../../utils/socket";
import { Link } from "react-router-dom";
import { useAppDispatch } from '../../redux/hooks/hooks';
import { clearUser } from '../../redux/user/userSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppSelector } from '../../redux/hooks/hooks';
import { toggleDarkMode } from '../../redux/theme/themeSlice';


interface Post {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
    profilePic?: string;
  };
  image: Array<{ imageUrl: string; description: string }>;
  title: string;
  description: string;
  location: {
    type: string;
    coordinates: number[];
    formatted: string;
  };
  
  peopleNeeded: number;
  // image: string[];
  createdAt: string;
  requests: Array<{ user: string }>;
}

interface NewPost {
  title: string;
  description: string;
  location: string;
  date: string;
  peopleNeeded: number;
  coordinates: number[];
  image: Array<{ imageUrl: string; description: string }>;
}


// Initialize Supabase client

const supabaseUrl = 'https://ziruawrcztsttxzvlsuz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppcnVhd3JjenRzdHR4enZsc3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY5MDUyNjcsImV4cCI6MjA0MjQ4MTI2N30.YIYgAo7Z8Kb2PuLZtYYQaymdjAySWqdnzraa-0Loj20';
const supabase = createClient(supabaseUrl, supabaseKey);

const Feed = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState<NewPost>({
    title: '',
    description: '',
    location: '',
    date: '',
    peopleNeeded: 0,
    coordinates: [] as number[],
    image: [] 
  });
  const [messageRequests, setMessageRequests] = useState<{ [key: string]: string }>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<{ formatted: string, coordinates: { lat: number, lng: number } }[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [sentRequests, setSentRequests] = useState<{ [key: string]: boolean }>({});
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  useEffect(() => {
    loadPosts();
    socket.on("connect", () => console.log("socket working"));
    console.log('user:', user);
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetchPosts();
      if (response.success && Array.isArray(response.posts)) {
        // Add dummy images to the posts
        // const postsWithImages = response.posts.map((post, index) => ({
        //   ...post,
        //   image: [dummyImages[index % dummyImages.length]]
        // }));
        // setPosts(postsWithImages);
        console.log('response.posts:', response.posts);
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

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('newPost:', newPost);
    try {
      const response = await createPost(newPost);
      if (response.success) {
        setIsModalOpen(false);
        setNewPost({ title: '', description: '', location: '', date: '', peopleNeeded: 0, coordinates: [], image: [] });
        loadPosts();
      } else {
        throw new Error('Failed to create post');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
    setNewPost({ ...newPost, location: query });
    if (query.length > 2) {
      const suggestions = await fetchPlaceSuggestions(query);
      setLocationSuggestions(suggestions);
    } else {
      setLocationSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: { formatted: string, coordinates: { lat: number, lng: number } }) => {
    setNewPost({ 
      ...newPost, 
      location: suggestion.formatted,
      coordinates: [suggestion.coordinates.lng, suggestion.coordinates.lat] // Store coordinates
    });
    
    setLocationSuggestions([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const onCropComplete = useCallback((
    _: unknown,
    croppedAreaPixels: any
  ) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = async (imageSrc: string, pixelCrop: any) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const maxSize = 1024; // Max width or height
    const scale = Math.min(maxSize / image.width, maxSize / image.height);
    
    canvas.width = pixelCrop.width * scale;
    canvas.height = pixelCrop.height * scale;

    if (ctx) {
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
    }

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        resolve(blob);
      }, 'image/jpeg', 0.9); // Adjust quality here (0.9 = 90% quality)
    });
  };

  const handleImageUploadToSupabase = async () => {
    setSelectedImage(null);
    console.log('handleImageUploadToSupabase triggered');
    if (croppedAreaPixels && selectedImage) {
      try {
        const croppedImageBlob = await getCroppedImg(URL.createObjectURL(selectedImage), croppedAreaPixels) as Blob;
        console.log('Cropped image size:', croppedImageBlob.size);

        const uniqueFilename = `cropped-image-${uuidv4()}.jpg`;
        
        // Only compress if the file is larger than 1MB
        let fileToUpload: Blob | File = croppedImageBlob;
        if (croppedImageBlob.size > 1024 * 1024) {
          console.log('Starting compression...');
          const compressedFile = await imageCompression(new File([croppedImageBlob], uniqueFilename, { type: 'image/jpeg' }), {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          });
          console.log('Compression complete. Compressed file size:', compressedFile.size);
          fileToUpload = compressedFile;
        }

        const { data, error } = await supabase.storage
          .from('ghosts')
          .upload(`public/${uniqueFilename}`, fileToUpload, {
            cacheControl: '3600',
            upsert: true,
          });

        if (error) {
          console.error('Error uploading image:', error);
          toast.error('Failed to upload image. Please try again.');
        } else {
          console.log('Image uploaded to Supabase:', data);
          const imageUrl = `${supabaseUrl}/storage/v1/object/public/ghosts/${data.path}`;
          console.log('Image URL:', imageUrl);
          setNewPost({ ...newPost, image: [{imageUrl : imageUrl , description : ''}] });
          setCroppedImageUrl('');
          toast.success('Image uploaded successfully!');
        }
      } catch (err) {
        console.error('Error in image processing:', err);
        toast.error('An error occurred while processing the image.');
      }
    }
  };

  const createImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous'); // to avoid CORS issues
      image.src = url;
    });
  };

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={`feedmain ${darkMode ? 'dark-mode' : ''}`}>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button onClick={toggleSidebar}>&times;</button>
        </div>
        <div className="sidebar-content">
          <Link to="/settings" className="sidebar-item">
            <SettingsIcon />
            <span>Settings</span>
          </Link>
          <Link to="/conversations" className="sidebar-item">
            <MessageIcon />
            <span>Messages</span>
          </Link>
           <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
           <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          <div onClick={() => dispatch(toggleDarkMode())} className="sidebar-item">
             {darkMode ?  <LightMode/> : <ModeNight/>}
          </div>

           </div>
          <button onClick={handleLogout} className="sidebar-item logout-button">
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

        {posts.map((post) => (
          <div key={post._id} className="post-container">
            <div className="imgcorosel">
              {post.image && post.image.length > 0 && (
                <div className="img-container">
                  <img src={post.image[0].imageUrl} alt="Post" />
                  <div className="text-container">
                    <h3>{post.title}</h3>
                    <h3 style={{display: 'flex', alignItems: 'center', gap: '10px' ,color: darkMode ? 'orange' : 'rgb(75 200 68)'}}><Diversity2/> <h3>:</h3> {post.peopleNeeded}</h3>
                  </div>
                </div>
              )}
            </div>

            <div className="post-container-bottom">
              <div className="user-info">
                <img src={post.user.profilePic || 'default-avatar.png'} alt={post.user.name} />
                <div>
                  <h3>{post.user.name}</h3>
                  <h5>{post.location.formatted}</h5>
                </div>
              </div>
              {post.image.length === 0 && (
                <div style={{height: '50px',width: '100px'}} className="text-container">
                    <h3>{post.title}</h3>
                    <h3 style={{display: 'flex', alignItems: 'center', gap: '10px' ,color: darkMode ? 'orange' : 'rgb(75 200 68)'}}><Diversity2/> <h3>:</h3> {post.peopleNeeded}</h3>
                  </div>)}
              <p>{post.description}</p>
              {user && !sentRequests[post._id] && !post.requests?.some((request: any) => request.user === user._id) && (
                <div className={`message-request-box ${darkMode ? 'dark-mode' : ''}`}>
                  <input
                    type="text"
                    placeholder="Send a message to join this group"
                    value={messageRequests[post._id] || ''}
                    onChange={(e) => handleMessageRequestChange(post._id, e.target.value)}
                  />
                  <button className="send-request-button" onClick={() => handleSendMessageRequest(post._id, post.user._id)}>Send Request</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <footer>
        <HomeIcon />
        <AddCircleRoundedIcon onClick={() => handleAuthenticatedAction(() => setIsModalOpen(true))} />
        <SearchIcon />
        <Link to="/profile">
          <AccountCircleRoundedIcon/>
        </Link>
      </footer>

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
                onChange={handleLocationChange}
                required
              />
              {locationSuggestions.length > 0 && (
                <ul className="suggestions-list">
                  {locationSuggestions.map((suggestion, index) => (
                    <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                      {suggestion.formatted}
                    </li>
                  ))}
                </ul>
              )}
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
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {selectedImage && (
                <div className="crop-container">
                  <Cropper
                    image={URL.createObjectURL(selectedImage)}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                  <button type="button" onClick={handleImageUploadToSupabase}>Upload Image</button>
                </div>
              )}
              {croppedImageUrl && (
                <div>
                  <img src={croppedImageUrl} alt="Cropped" />
                </div>
              )}
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

      <ToastContainer />
    </div>
  );
};

export default Feed;