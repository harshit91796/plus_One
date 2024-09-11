import React, { useEffect, useState } from "react";
import {
  HomeIcon,
  SearchIcon,
  AddBoxIcon,
  ChatIcon,
  AccountBoxIcon,
  NotificationsNoneIcon,
  AutoAwesomeMosaicIcon,
  AccountCircleRoundedIcon,
  AddCircleRoundedIcon,
  ExploreRoundedIcon,
  ExploreOutlinedIcon,
} from "../../assets/Icons";
import Post from "../../components/Post";
import { socket } from "../../utils/socket";
import { postRequest } from "../../utils/service";
import ImageInput from "../../components/ImageInput";
import { Link } from "react-router-dom";
const Feed = () => {
  const [kk, setkk] = useState("");
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
console.log(file)
    setkk(file);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("avatar", kk);
    postRequest('/user/change-avatar',formData).then(()=>console.log('api requested'))
  };
  useEffect(() => {
    socket.on("connect", () => console.log("socket working"));
  }, []);
  const arr = [
    "https://images.unsplash.com/photo-1724086575243-6796fc662673?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
    "https://plus.unsplash.com/premium_photo-1723983555279-8de1f6e633e3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1706807135398-31770beffb74?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxN3x8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1724086576041-34e434df9303?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw4fHx8ZW58MHx8fHx8",
  ];
  return (
    <div className="feedmain">
      <div className="feed">
       

        <div className="feedTop">
          <AutoAwesomeMosaicIcon />
          <h2>Logo</h2>
          <span><ExploreOutlinedIcon/> <NotificationsNoneIcon />  </span>
         
        </div>

        {arr.map((i) => (
          <Post url={i} />
        ))}
      </div>
      <footer>
        <HomeIcon />
        <AddCircleRoundedIcon/>
        <SearchIcon />
        {/* <Link to="/chat">
          <ChatIcon />
        </Link> */}
        {/* <AccountBoxIcon /> */}
        <Link to="/profile">
        <AccountCircleRoundedIcon/>
        </Link>
        
      </footer>
    </div>
  );
};

export default Feed;
