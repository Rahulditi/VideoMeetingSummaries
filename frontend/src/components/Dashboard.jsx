import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, addDoc, doc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import './Dashboard.css';

const Dashboard = () => {
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [roomId, setRoomId] = useState("");
  const { logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate("/login");
  };

  const handleCreateRoom = async () => {
    try {
      const newRoomId = uuidv4();
      const roomRef = await doc(db, "rooms", newRoomId);
      alert(`Room Created! Room ID: ${newRoomId}`);

      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.email);
        await updateDoc(userRef, {
          roomIds: arrayUnion(newRoomId)
        });
      }

      navigate(`/room/${newRoomId}`);
    } catch (error) {
      alert(`Error creating room: ${error.message}`);
    }
  };

  const handleJoinRoom = async () => {
    if (roomId.trim() === "") {
      alert("Please enter a Room ID.");
      return;
    }

    try {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.email);
        await updateDoc(userRef, {
          roomIds: arrayUnion(roomId)
        });
      }

      navigate(`/room/${roomId}`);
    } catch (error) {
      alert(`Error joining room: ${error.message}`);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Welcome to Dashboard</h2>

        {!showJoinInput ? (
          <div className="button-group">
            <button className="main-button" onClick={handleCreateRoom}>
              Create Room
            </button>
            <button className="main-button" onClick={() => setShowJoinInput(true)}>
              Join Room
            </button>
          </div>
        ) : (
          <div className="join-form">
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button className="main-button" onClick={handleJoinRoom}>
              Join
            </button>
            <button
              className="back-button"
              onClick={() => setShowJoinInput(false)}
            >
              Back
            </button>
          </div>
        )}

        <button onClick={() => navigate("/summaries")} style={{ marginTop: "25px" }}>
          View My Summaries
        </button>

        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;