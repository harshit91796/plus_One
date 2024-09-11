import React, { useRef } from 'react';

interface Props{
    url:string;
}

const Post:React.FC<Props> = ({url}) => {
  return (
    <div className='post-container'>
<div className='post-container-bottom'>
        <div>
            <img src={url} alt="" />
            <span>
<h3>Barry Allen</h3>
<h5>Mp Nagar</h5>
            </span>
        </div>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
      </div>

      <div className='imgcorosel'>



<div className='img-container'>
<img src={url} alt="" />
<div className='text-container'>
    <h4>john wich,46</h4>
    <h4>Group of m2 ,f4</h4>

</div>
</div>

<div className='img-container'>
<img src={url} alt="" />
<div className='text-container'>
    <h4>john wich,46</h4>
    <h4>Group of m2 ,f4</h4>

</div>
</div>

<div className='img-container'>
<img src={url} alt="" />
<div className='text-container'>
    <h4>john wich,46</h4>
    <h4>Group of m2 ,f4</h4>

</div>
</div>

<div className='img-container'>
<img src={url} alt="" />
<div className='text-container'>
    <h4>john wich,46</h4>
    <h4>Group of m2 ,f4</h4>

</div>
</div>

<div className='img-container'>
<img src={url} alt="" />
<div className='text-container'>
    <h4>john wich,46</h4>
    <h4>Group of m2 ,f4</h4>

</div>
</div>
      </div>

      {/* <div className='post-container-bottom'>
        <div>
            <img src={url} alt="" />
            <span>
<h3>Barry Allen</h3>
<h5>Mp Nagar</h5>
            </span>
        </div>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
      </div> */}
    </div>
  )
}

export default Post
