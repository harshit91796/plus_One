import React, { useState, useEffect } from "react";
import "./Profile.css";
import { Instagram, Twitter, LinkedIn, ArrowBackIosNew, Edit } from "@mui/icons-material";
import { useAppSelector } from "../../redux/hooks/hooks";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUser, getUserPosts } from "../../Api";
// import { User } from "@supabase/supabase-js";
import { v4 as uuidv4 } from 'uuid';
import PostModal from "../../components/modal/postModal/PostModal";

interface Post {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
    profilePic?: string;
  };
  profilePic: string;
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

interface UserData {
  name: string;
  profilePic: string;
  coverPic: string;
  _id: string;
}


const Profile: React.FC = ( ) => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);
  const params = useParams();
  const userId = params.userId;
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  const [activeTab, setActiveTab] = useState<"photos" | "events">("photos");
  const [showMore, setShowMore] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    console.log(user);
    loadUserData();
    loadUserPosts();
  }, [user]);

  const loadUserData = async () => {
    if (userId) {
      const user = await getUser(userId);
      setUserData(user);
    }
  };

  const loadUserPosts = async () => {
    if (userId) {
      const posts = await getUserPosts(userId);
      setUserPosts(posts);
    }
  };

  console.log(userData);
  console.log("userPosts", userPosts);
  return (
    <div className={`profile-card ${darkMode ? 'dark' : 'light'}`}>
      {/* Profile Header Section */}
      <div className="profile-header">
        <img className="cover-image"
          src={userData?.coverPic || "https://images.pexels.com/photos/2389349/pexels-photo-2389349.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
          alt="cover"
        />
        <div className="profile-image-container" onClick={() => navigate(`/setup/avatar`)}>
            <img
                src={userData?.profilePic}
                alt="profile"
                className="profile-image"
            />
        </div>
        <div className="profile-info-profilePage-container">
          <h2 className="profile-name">{userData?.name}</h2>
          
        </div>
        <Link onClick={() => window.history.back()} className="back-button-link" to="/" style={{ textDecoration: 'none', color: 'inherit' }}><ArrowBackIosNew /></Link>

        <button className="edit-button">
          {userData?._id === user?._id && (
           <Edit/>
          )}
        </button>
      </div>

      {/* About Me Section */}
      <div className="about-me-section">
        <h3 className="section-title">About Me     <button className="follow-button">Follow</button></h3>
        
        <p className="about-me-details">
          📍 SMU<br />
          📌 London, UK<br />
          Hey there! I'm exploring London for a few weeks and capturing every moment. Follow my journey on{" "}
          <a href="https://instagram.com/samilbastas" target="_blank" rel="noreferrer">
            Instagram
          </a>
          .
        </p>
        <div className="more-details" style={{ marginTop: '15px', textAlign: 'center' }}>
          <button 
            onClick={() => setShowMore(!showMore)} 
            style={{
              background: 'none',
              border: 'none',
              color: '#2575fc',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            {showMore ? 'Show Less' : 'Show More'}
          </button>
          
          {showMore && (
            <div style={{ marginTop: '15px', textAlign: 'left' }}>
              <h4 style={{ color: '#333', marginBottom: '10px' }}>Interests</h4>
              <p style={{ color: '#555', marginBottom: '15px' }}>
                🎨 Art & Design<br/>
                📚 Reading<br/>
                🎵 Music Production<br/>
                ✈️ Traveling
              </p>

              <h4 style={{ color: '#333', marginBottom: '10px' }}>Connect With Me</h4>
              <p style={{ display: 'flex', gap: '10px', color: '#555' }}>
                <Instagram />
                <Twitter />
                <LinkedIn />
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-nav">
        <button
          className={`nav-button ${activeTab === "photos" ? "active" : ""}`}
          onClick={() => setActiveTab("photos")}
        >
          Photos
        </button>
        <button
          className={`nav-button ${activeTab === "events" ? "active" : ""}`}
          onClick={() => setActiveTab("events")}
        >
          Events
        </button>
      </div>

      {/* Photos Section */}
      {activeTab === "photos" && (
        <div className="photos-section">
          <h3 className="section-title">Your Gallery</h3>
          <div className="photos-grid">
            <img src="https://via.placeholder.com/100" alt="pic1" />
            <img src="https://via.placeholder.com/100" alt="pic2" />
            <img src="https://via.placeholder.com/100" alt="pic3" />
            <img src="https://via.placeholder.com/100" alt="pic4" />
            <img src="https://via.placeholder.com/100" alt="pic5" />
            <img src="https://via.placeholder.com/100" alt="pic6" />
          </div>
        </div>
      )}

      {/* Events Section */}
      {activeTab === "events" && (
        <div className="events-section">
          <h3 className="section-title">Your Events</h3>
          <div className="events-list">
            {userPosts && userPosts.length > 0 ? (
              userPosts.map((post: Post) => (
                <div key={uuidv4()} className="event-card" onClick={() => setSelectedPost(post as Post)}>
                  <div className="event-carousel">
                    {post.image && post.image.map((img, index) => (
                      <div key={index} className="event-carousel-image">
                        <img src={img.imageUrl} alt={img.imageDescription} />
                      </div>
                    ))}
                  </div>
                  <div className="event-info">
                    <h4 className="event-title">{post.title}</h4>
                    <p className="event-date">{post.createdAt}</p>
                    <p className="event-location">{post.location?.formatted}</p>
                    <p className="event-description">{post.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-events">
                <p>No events found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}

    </div>
  );
};

export default Profile;
