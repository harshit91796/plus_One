import React from 'react'

const Birthday = () => {
  return (
    <div className='initial-setup'>
      <h2 >
      What’s your birthday? Just curious!
      </h2>
      <p >
      Tell us your birthday; it will remain private, and only your age will be visible. This helps us connect you with like-minded people.
      </p>
      <h2>🥳</h2>
      <input type="date" placeholder='dd' max="2008-12-31"/>
      <button> Continue</button>
    </div>
  )
}

export default Birthday
