import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { logIn } = useAuth()
  const navigate = useNavigate()

  const handleLogIn = async (e) => {
    e.preventDefault()
    setError("")

    try {
      await logIn(email, password)
      navigate("/dashboard")
    }
    catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleLogIn}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">Login</button>
        </form>

        <div className="signup-section">
          <h3>Not Registered?</h3>
          <button onClick={() => navigate("/signup")} className="signup-button">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login