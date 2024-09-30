// import React, { useEffect ,useState} from "react";
// import { getUserDetails } from "../../services/user";

// const Profile = () => {
//   const [nickName,setNickName]=useState('')
//   const [username,setUsername]=useState('')
//   const [avatar,setAvatar]=useState('')

//   useEffect(()=>{
//     getUserDetails().then(res=>{
// setNickName(res.data.data.nickName)
// setUsername(res.data.data.username)
// setAvatar(res.data.data.avatar)
//     })
//   },[])
//   return (
//     <div className="user-profile">
//       <div className="username-island">
//         {" "}
//         <h2>@{username}</h2>
//       </div>
//       <img
//         className="user-background"
//         src={avatar}
//         alt=""
//       />
 
//       <div className="profile-container">
//         <div className="details">
//           <img
//             src={avatar}
//             alt=""
//           />
//           <h2>{nickName}</h2>
//           <h5>location</h5>
//           <p>
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae
//             minima cupiditate.
//           </p>

//           <div className="follow-buttons">
//             <span>Follow</span>
//             <span>Message</span>
//           </div>
//           <div className="follow-counts">
//             <span>
//               <h2>19</h2>
//               <h4>Posts</h4>
//             </span>
//             <span>
//               <h2>19</h2>
//               <h4>Followers</h4>
//             </span>
//             <span>
//               <h2>19</h2>
//               <h4>Following</h4>
//             </span>
//           </div>
//         </div>
//       </div>


//       <div className="bottom-tabs">
//         <div className="buttons">
//           <span>Activity</span>
//           <span>Prefrence</span>

//         </div>
// <div className="content">
// <img
//         className="user-background"
//         src="https://images.unsplash.com/photo-1725027090494-8aa73667f83b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMjN8fHxlbnwwfHx8fHw%3D"
//         alt=""
//       />
//        <img
//         className="user-background"
//         src="https://images.unsplash.com/photo-1725027090494-8aa73667f83b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMjN8fHxlbnwwfHx8fHw%3D"
//         alt=""
//       /> <img
//       className="user-background"
//       src="https://images.unsplash.com/photo-1725027090494-8aa73667f83b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMjN8fHxlbnwwfHx8fHw%3D"
//       alt=""
//     /> <img
//     className="user-background"
//     src="https://images.unsplash.com/photo-1725027090494-8aa73667f83b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMjN8fHxlbnwwfHx8fHw%3D"
//     alt=""
//   /> <img
//   className="user-background"
//   src="https://images.unsplash.com/photo-1725027090494-8aa73667f83b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMjN8fHxlbnwwfHx8fHw%3D"
//   alt=""
// /> <img
//         className="user-background"
//         src="https://images.unsplash.com/photo-1725027090494-8aa73667f83b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMjN8fHxlbnwwfHx8fHw%3D"
//         alt=""
//       /> <img
//       className="user-background"
//       src="https://images.unsplash.com/photo-1725027090494-8aa73667f83b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMjN8fHxlbnwwfHx8fHw%3D"
//       alt=""
//     /> <img
//     className="user-background"
//     src="https://images.unsplash.com/photo-1725027090494-8aa73667f83b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMjN8fHxlbnwwfHx8fHw%3D"
//     alt=""
//   /> <img
//   className="user-background"
//   src="https://images.unsplash.com/photo-1725027090494-8aa73667f83b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMjN8fHxlbnwwfHx8fHw%3D"
//   alt=""
// /> <img
//         className="user-background"
//         src="https://images.unsplash.com/photo-1725027090494-8aa73667f83b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMjN8fHxlbnwwfHx8fHw%3D"
//         alt=""
//       />
// </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
