import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ImageInput from '../../components/ImageInput'
import { postRequest } from '../../utils/service'
import { getUserDetails } from '../../services/user'
import { useDispatch } from 'react-redux'
import { setLoading } from '../../redux/loadingSlice'

const UploadAvatar = () => {
  const [imgFile,setImgFile]=useState('')
  const [imgValue,setImgValue]=useState('')
  const [imgSrc,setImgSrc]=useState('')


  const navigate=useNavigate()
const dispatch=useDispatch()

const handelchange=(e)=>{
  const selectedFile=e.target.files[0]
  setImgFile(e.target.files[0])
  setImgValue(e.target.value)

  if (e.target.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImgSrc(e.target.result); // Set preview image
    };
    reader.readAsDataURL(e.target.files[0]);
}}

const handleSubmit = (e) => {
  // e.preventDefault();
dispatch(setLoading(true))
  const formData = new FormData();
  formData.append("avatar", imgFile);
  postRequest('/user/change-avatar',formData).then((res)=>{
    if(res.status==200)navigate('/setup')
})
dispatch(setLoading(false))
};

useEffect(() => {
  getUserDetails().then(res=>{
    if(!res.data.data || !res.data.data.gender) navigate('/gender')
  })
}, []);
  return (
    <div className="initial-setup">
    <h2>Let me see who's behind all this</h2>
    <p>
    A profile picture goes a long way in making your profile approachable. Upload one to stand out.
    </p>
    
<div className='avatar-container'>
  <img style={{opacity:imgSrc&&imgSrc!=''?'100%':'30%',padding:imgSrc&&imgSrc!=''?0:'15%'}} src={imgSrc&&imgSrc!=''?imgSrc:'data:image/png;base64,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'} alt="" />
<input type="file" required  name="avatar" onChange={handelchange} accept="image/*"  value={imgValue}/>

</div>
<button onClick={handleSubmit}>Change profile picture</button>
    <span className="gspan" ><Link to='/setup'>I’ll do it later</Link>
     
    </span>
    
    
  </div>
  )
}

export default UploadAvatar
