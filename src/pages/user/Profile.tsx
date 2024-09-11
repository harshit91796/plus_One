import React, { useEffect ,useState} from "react";
import { getUserDetails } from "../../services/user";

const Profile = () => {
  const [nickName,setNickName]=useState('')
  const [username,setUsername]=useState('')
  const [avatar,setAvatar]=useState('')

  useEffect(()=>{
    getUserDetails().then(res=>{
setNickName(res.data.data.nickName)
setUsername(res.data.data.username)
setAvatar(res.data.data.avatar)
    })
  },[])
  return (
    <div className="user-profile">
     
      <img
        className="avatar"
        src={"https://images.unsplash.com/photo-1725027090494-8aa73667f83b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMjN8fHxlbnwwfHx8fHw%3D"}
        alt=""
      />
 
      <div className="details">
        <div className="nickname">
          <h2>Singh parihar</h2>
          <h5>Following</h5>
        </div>
        <p className="username">@misusername</p> <span>4.5 ⭐</span>

        <p className="bio">Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum voluptatem exercitationem laboriosam odio, nihil obcaecati corrupti dicta perspiciatis expedita quos!</p>
      </div>

<div className="follow">

</div>
<h4 className="activityheader">Activity</h4>
<div className="activity">





</div>



<div className="footer">
  Message
</div>
     
    </div>
  );
};

export default Profile;
