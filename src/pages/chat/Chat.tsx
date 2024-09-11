import React from "react";
import { CameraIcon, ChatIcon, SendIcon } from "../../assets/Icons";

const Chat = () => {
  return (
    <div className="chatbox">
      <div className="header">
        <img
          src="https://images.unsplash.com/photo-1725109431763-36524de95bf9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2M3x8fGVufDB8fHx8fA%3D%3D"
          alt=""
        />
        <div>
          <h3>Stacy</h3>
          <p>Online</p>
        </div>
      </div>
      <div className="messages">
        <div className="fp">hii how you doin</div>
        <div className="sp">why are you asking</div>
        <p>today</p>
        <div className="fp">asking for a friend</div>
        <div className="sp">
          why are you asking for your frind why cant he ask himself
        </div>
      </div>
      <div className="footer">
        <form action="">
          <h3>
            <CameraIcon />
          </h3>
          <textarea
            id="message"
            name="message"
            rows="1"
            cols="50"
            placeholder="Message..."
          ></textarea>
          {/* <input type="text" placeholder='Message...'/> */}
          <button>
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
