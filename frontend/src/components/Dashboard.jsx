import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { db } from '../firebase/firebaseConfig'
import { collection, addDoc } from 'firebase/firestore'
import { v4 as uuidv4 } from "uuid";


const Dashboard = () => {
  const [roomId, setRoomId] = useState("")
  const {logOut} = useAuth()
  const navigate = useNavigate()

  const handleLogout = async() =>{
    await logOut()
    navigate("/login")
  }

  const handleCreateRoom = async() =>{
    const newRoomId = uuidv4()
    await addDoc(collection(db,"rooms"),{roomId:newRoomId})
    alert(`Room Created! Room Id: ${newRoomId}`)
    navigate(`/room/${newRoomId}`)
  } 
  const handleJoinRoom = async() =>{
    navigate(`/room/${roomId}`)
  }
  
  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={handleCreateRoom}>Create Room</button>
      <div>
        <input type="text" placeholder='Enter Room Id'  value={roomId} onChange={(e) => {setRoomId(e.target.value)}}/>
        <button onClick={handleJoinRoom}>Join Room</button>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard