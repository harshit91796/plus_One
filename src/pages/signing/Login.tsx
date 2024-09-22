import React, { useState } from "react";
import { userLogin } from "../../services/user";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { password, username };
    userLogin(userData)
      .then((res) => {
        const { name, username, profilePic, token } = res.data.data;
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", { name, username, profilePic });
        dispatch(setUser({ name, username, profilePic }));

        if (!profilePic) {
          navigate("/setup/avatar");
        } else {
          navigate("/");
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <form onSubmit={handleSubmit} className="login-page">
      {err ? <h2>{err}</h2> : null}
      <img
        src="https://cdn.dribbble.com/users/3008416/screenshots/6706770/gdr-01_4x.jpg?resize=400x0"
        alt=""
      />

      <input
        type="text"
        value={username}
        required
        onChange={(e) => setUsername(e.target.value.toLowerCase())}
        placeholder="Username"
      />
      <input
        type="password"
        name="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button>Login</button>
    </form>
  );
};

export default Login;
