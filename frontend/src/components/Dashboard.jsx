import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import Header from "./Header";

const Dashboard = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [roomId, setRoomId] = useState("");
  const { logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate("/login");
  };

  const handleCreateRoom = async () => {
    const newRoomId = uuidv4();
    await addDoc(collection(db, "rooms"), { roomId: newRoomId });
    alert(`Room Created! Room Id: ${newRoomId}`);
    navigate(`/room/${newRoomId}`);
  };
  const handleJoinRoom = async () => {
    navigate(`/room/${roomId}`);
  };

  return (
    <>
      {/* <div> <Header/></div> */}
      <div>
        {/* <div>
          <button onClick={handleCreateRoom}>Create Room</button>
        </div> */}
        {/* <div>
          <input
            type="text"
            placeholder="Enter Room Id"
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
          />
          <div>
            <button onClick={handleJoinRoom}>Join Room</button>
          </div>
        </div> */}
        <div className="logout-btn" style={{justifyContent:"right"}}>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className="login">
        <div className={`container ${isSignUp ? "active" : ""}`} id="container">
          <div className="form-container sign-up">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleJoinRoom();
              }}
            >
              <h1>Join Room</h1>
              <input
                type="text"
                placeholder="Enter Room Id"
                value={roomId}
                onChange={(e) => {
                  setRoomId(e.target.value);
                }}
              />

              <button type="submit">Jooin</button>
            </form>
          </div>

          <div className="form-container sign-in">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateRoom();
              }}
            >
              <h1>Create Room</h1>

              {/* <input type="password" placeholder="Password" /> */}
              <button type="submit">Create</button>
            </form>
          </div>

          <div className="toggle-container">
            <div className="toggle">
              <div className="toggle-panel toggle-left">
                <h1>Create a Room?</h1>
                {/* <p>Enter your personal details to use all of site features</p> */}
                <button className="hidden" onClick={() => setIsSignUp(false)}>
                  Create
                </button>
              </div>
              <div className="toggle-panel toggle-right">
                <h1>Already Have a Code ?</h1>
                <button className="hidden" onClick={() => setIsSignUp(true)}>
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
