import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const[email, setEmail] = useState("")
  const[password, setPassword] = useState("")
  const {signUp} = useAuth()
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()
    try{
      await signUp(email,password)
      navigate("/dashboard")
    }
    catch(err){
      alert(err.message)
    }
  }
  return (
    <div>
      <h2>SignUp</h2>
      <form onSubmit={handleSignUp}>
        <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} required/>
        <input type="password" placeholder='Password' onChange={(e)=> setPassword(e.target.value)} required />
        <button type='submit'>SignUp</button>
      </form>
    </div>
  )
}

export default Signup