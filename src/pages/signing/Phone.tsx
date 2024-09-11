import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../../services/user";
import { useDispatch } from "react-redux";
import { newUser } from "../../redux/userSlice";

const Phone = () => {
  const [num, setNum] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handlechange = (e) => {
    if (/^\d*$/.test(e.target.value)) setNum(e.target.value);
    console.log("kkk");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // dispatch(newUser({ phone: num }));
    // navigate("/otp");
    userLogin({phone:num}).then(res=>{
      localStorage.setItem('number',num)
      if(res.status==201)navigate('/otp')
    })
    // navigate('/username')
  };
  return (
    <form onSubmit={handleSubmit} className="initial-setup">
      <h2>Can we have Your Number? Asking for a friend..</h2>
      <p>
        Just kidding, we need your number to log you in. Don’t worry, we’re not
        calling.
      </p>

      <input
        className="phone"
        type="text"
        placeholder="Phone"
        value={num}
        name="phone"
        required
        maxLength="10"
        minLength="10"
        onChange={handlechange}
      />

      {num && num.length == 10 ? <button> Continue</button> : null}
    </form>
  );
};

export default Phone;
