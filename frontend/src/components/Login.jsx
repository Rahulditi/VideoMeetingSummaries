import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import './common.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';
import Header from './Header';
const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { logIn } = useAuth();
  const navigate = useNavigate();

  const handleLogIn = async (e) => {
    e.preventDefault();
    try {
      await logIn(email, password);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (

    <div className='login' >

      <div className={`container ${isSignUp ? "active" : ""}`} id="container">

        <div className="form-container sign-up">
          <form onSubmit={(e) => e.preventDefault()}>
            <h1>Create Account</h1>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="submit">Sign Up</button>
          </form>
        </div>

        <div className="form-container sign-in">
          <form onSubmit={handleLogIn}>
            <h1>Sign In</h1>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <a href="#">Forget Your Password?</a>
            <button type="submit">Sign In</button>
          </form>
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button className="hidden" onClick={() => setIsSignUp(false)}>Sign In</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Register with your personal details to use all of site features</p>
              <button className="hidden" onClick={() => setIsSignUp(true)}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Login;
