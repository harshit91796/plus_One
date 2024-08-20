import React from 'react'

const NickName = () => {
  return (
    <div className='initial-setup'>
      <h2 >
        What should we call you..?
      </h2>
      <p >
      Please share your name so we can address you properly and personalize your experience.
      </p>
      <input type="text" placeholder='Ex: Jhon Doe'/>
      <button> Continue</button>
    </div>
  )
}

export default NickName
