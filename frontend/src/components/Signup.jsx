import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { db } from '../firebase/firebaseConfig'
import { doc, setDoc } from 'firebase/firestore'
import './Signup.css' 

const Signup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const userCredential = await signUp(email, password)
      const user = userCredential.user
      const ref = doc(db, "users", user.email)
      await setDoc(ref, {
        roomIds: []
      })

      navigate("/dashboard")
    }
    catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign Up</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSignUp}>
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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="signup-button">Sign Up</button>
        </form>

        <div className="login-section">
          <h3>Already have an account?</h3>
          <button onClick={() => navigate("/login")} className="login-button">
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default Signup