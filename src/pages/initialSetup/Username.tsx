import React, { useState } from 'react'

const Username = () => {
   const [usernameAvailable,setUsernameAvailable]= useState(false)
  return (
    <div className='initial-setup'>
      <h2 >
      Celebrate your uniqueness with a username as special as you are.
      </h2>
      <p >
      Choose a unique username so people can find you easily and connect with you effortlessly. It’s your personal touch in our community.
      </p>
      <input type="text" placeholder='Username' style={{background:usernameAvailable?'#31ff314d':''}}/>
      {
        usernameAvailable?<span style={{color:'#18d818'}}>Available</span>:<span style={{color:'#d81818'}}>Not Available</span>
      }

      <button> Continue</button>
    </div> 
  )
}

export default Username
