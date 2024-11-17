// import React from 'react';

// import { Card, CardContent, Typography, CardActions, IconButton } from '@mui/material';
// import { Favorite, Comment, Share } from '@mui/icons-material';
// import './PostCard.css';

// interface PostCardProps {
//   post: Post;
// }

// const PostCard: React.FC<PostCardProps> = ({ post }) => {
//   return (
//     <div 
//     key={uuidv4()} 
//     className="post-container"
//     onClick={() => handlePostClick(post)}
//   >
//     <div className="progress-wrapper">
//       <div className="progress-ring">
//         <div className="progress-circle">
//           <span>75%</span>
//         </div>
//       </div>
//     </div>

//     <div className="imgcorosel-wrapper">
//       <div className="imgcorosel">
//         {post.image && post.image.length > 0 && (
//           post.image.map((img, index) => (
//             <div key={index} className="img-container">
//               <img src={img.imageUrl} alt={`Post Image ${index + 1}`} loading="lazy" />
//             </div>
//           ))
//         )}
        
//       </div>

//       {/* Fixed Gender Stats Overlay */}
//       <div className="gender-stats">
//       <h3>{post.title}</h3>
//          {/* People Needed */}
//          <div className="people-needed">
            
//                 <Diversity2 style={{ color: '#dbd553', marginRight: '5px' }} />
//                 <span style={{ color: 'white' }}>{post.peopleNeeded}</span>
//               </div>
//                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}} >
//               { post.maleNeeded || post.femaleNeeded ? (
//                 <>
//                  {post.maleNeeded ? (
//                   <div className="gender-item">
//                     <Male className="gender-icon" style={{ color: '#4a93e7' }} />
//                     <span>{post.maleNeeded}</span>
//                   </div>
//                  ) : (
//                   <></>
//                  )}
//                 {post.femaleNeeded ? (
//                   <div className="gender-item">
//                     <Female className="gender-icon" style={{ color: 'pink' }} />
//                     <span>{post.femaleNeeded}</span>
//                   </div>
//                 ) : (
//                   <></>
//                 )}
//                 </>
//               ) : (
//                 <></>
//               )}
//                 </div>
//                 <div className="gender-item">
//                   <SupervisedUserCircle className="gender-icon" />
//                   <span>{post.joined} Joined (M : 1, F : 2)</span>
//                 </div>
//       </div>
//     </div>

//     <div className="post-container-bottom">
//       <div className="user-info">
//         <img src={post.user.profilePic || 'default-avatar.png'} alt={post.user.name} />
//         <div>
//           <h3>{post.user.name}</h3>
//           <h5>{post.location.formatted}</h5>
//         </div>
//       </div>
//       <p>{post.description}</p>
//       {user && !sentRequests[post._id] && !post.requests?.some((request: any) => request.user === user._id) && (
//         <div 
//           className={`message-request-box ${darkMode ? 'dark-mode' : ''}`}
//           onClick={(e) => e.stopPropagation()}
//         >
//           <input
//             type="text"
//             placeholder="Send a message to join this group"
//             value={messageRequests[post._id] || ''}
//             onChange={(e) => handleMessageRequestChange(post._id, e.target.value)}
//           />
//           <button 
//             className="send-request-button" 
//             onClick={(e) => {
//               e.stopPropagation();
//               handleSendMessageRequest(post._id, post.user._id);
//             }}
//           >
//             Send Request
//           </button>
//         </div>
//       )}
//     </div>
//   </div>
//   );
// };

// export default PostCard;
