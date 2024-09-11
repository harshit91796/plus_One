import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { verifyOtp } from "../../services/user";
import { useNavigate } from "react-router-dom";

const Otp = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);

  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const num =  localStorage.getItem('number')
  const handleChange = (e, index) => {
    const value = e.target.value;

    // Allow only one digit
    if (/^\d?$/.test(value)) {
      // Update OTP state
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input if not the last one
      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    verifyOtp({ phone: num, otp: otp.join("") }).then((res) => {
        console.log(res.data)
        sessionStorage.setItem('token', res.data.data.token);
      if (res.data.data.newUser)navigate(`/name`);
      else navigate ('/')
        
    });
  };

  // const resendOtp=()=>{
  //userLogin({phone:num}).then(res=>{
  //   dispatch(newUser({phone:num}))
  //   if(res.status==201)
  // })
  // }

  useEffect(()=>{
    if(!localStorage.getItem('number'))navigate('/phone')
  },[])
  return (
    <form
      className="login-page"
      style={{ alignItems: "center", paddingTop: "15vh" }}
    >
      <h2>Verify Your Number</h2>
      <p>Otp has been sent to your Number</p>
      <p>{num}</p>
      <br />
      <br />
      <div className="otp-container">
        {otp.map((value, index) => (
          <input
            key={index}
            type="text"
            value={value}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            maxLength="1"
            ref={(el) => (inputRefs.current[index] = el)}
          />
        ))}
      </div>
      <p>Resend Otp?</p>
      <br />
      <br />

      {otp[0] != "" && otp[1] != "" && otp[2] != "" && otp[3] != "" ? (
        <button onClick={handleSubmit}>Verify</button>
      ) : null}
    </form>
  );
};

export default Otp;
