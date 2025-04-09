import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";


import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  addDoc,
} from "firebase/firestore";

let mediaRecorder;
let recordedChunks = [];

const startRecording = async (localStream, remoteStream) => {
  const mixedStream = new MediaStream();
  recordedChunks = [];

  localStream.getAudioTracks().forEach(track => mixedStream.addTrack(track));
  remoteStream.getAudioTracks().forEach(track => mixedStream.addTrack(track));

  mediaRecorder = new MediaRecorder(mixedStream);

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  mediaRecorder.start();
};





const servers = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate(); 
  const [isRoomCreator, setIsRoomCreator] = useState(false);
  const localVideo = useRef(null); 
  const remoteVideo = useRef(null);

  
  const peer = useRef(null);

  
  useEffect(() => {
   
    const setupVideoChat = async() => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localVideo.current.srcObject = localStream;

        peer.current = new RTCPeerConnection(servers);

        const tracks = localStream.getTracks();
        for (let i = 0; i < tracks.length; i++) {
          peer.current.addTrack(tracks[i], localStream);
        }

        const remoteStream = new MediaStream();
        remoteVideo.current.srcObject = remoteStream;

        peer.current.ontrack = (event) => {
          const remoteTracks = event.streams[0].getTracks();
          for (let i = 0; i < remoteTracks.length; i++) {
            remoteStream.addTrack(remoteTracks[i]);
          }
        };

        const roomRef = doc(db, "rooms", roomId);
        console.log(roomRef);
        const roomSnapshot = await getDoc(roomRef);
        console.log(roomSnapshot);
        

        if (roomSnapshot.exists()) {
          console.log("Room exists! Joining existing room...");
          joinRoom(roomRef);
        } else {
          console.log("Room doesn't exist! Creating new room...");
          createRoom(roomRef);
          setIsRoomCreator(true);
        }

        setupIceCandidates(roomId);
        if(localVideo.current.srcObject && remoteVideo.current.srcObject){
          startRecording(localStream, remoteStream);
        }

      } catch (error) {
        console.error("Error setting up video chat:", error);
      }
    }

  
    setupVideoChat();

    // Clean up when component unmounts
    return () => {
      if (peer.current) {
        console.log("Closing connection...");
        peer.current.close();
      }
    };
  }, [roomId]);

  const handleEndMeeting = async () => {
    try {
      if (isRoomCreator) {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
        }
        setTimeout(async () => {
          const blob = new Blob(recordedChunks, { type: "audio/webm" });
          const formData = new FormData();
          formData.append("audio", blob);

          await fetch(`http://127.0.0.1:5000/upload?roomId=${roomId}`, {
            method: "POST",
            body: formData,
          });

          navigate("/dashboard");
        }, 1000);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error ending meeting:", err);
      navigate("/dashboard");
    }
  };

 
    const createRoom = async(roomRef) => {
    try {
      const offer = await peer.current.createOffer();

      await peer.current.setLocalDescription(offer);

      await setDoc(roomRef, { offer }); // save offer in database

      onSnapshot(roomRef,  (snapshot) => { // watches for any change in the room document
        const data = snapshot.data();
        if (data?.answer && !peer.current.currentRemoteDescription) {
          const answer = new RTCSessionDescription(data.answer);
          peer.current.setRemoteDescription(answer);
        }
      });
    } catch (error) {
      console.error("Error creating room:", error);
    }
  }

   const joinRoom = async (roomRef) => {
    try {
      const roomSnapshot = await getDoc(roomRef);
      const roomData = roomSnapshot.data();

    
      if (roomData?.offer) {
        const offer = new RTCSessionDescription(roomData.offer);
        await peer.current.setRemoteDescription(offer);

        const answer = await peer.current.createAnswer();

        await peer.current.setLocalDescription(answer);
        await updateDoc(roomRef, { answer });

        console.log("Answer sent!");
      }

      const candidatesCollection = collection(roomRef, "candidates");
      onSnapshot(candidatesCollection,  (snapshot) => {
        const changes = snapshot.docChanges();
        for (let i = 0; i < changes.length; i++) {
          const change = changes[i];
          if (change.type === "added") {
            const candidateData = change.doc.data();
            const candidate = new RTCIceCandidate(candidateData);
            peer.current.addIceCandidate(candidate);
          }
        }
      });
    } catch (error) {
      console.error("Error joining room:", error);
    }
  }

  const setupIceCandidates = (roomId) => {
    if (!peer.current){
      return
    }

    peer.current.onicecandidate = async(event) => {
      if (event.candidate) {
        try {
          const roomRef = doc(db, "rooms", roomId);
          const candidatesCollection = collection(roomRef, "candidates");
          await addDoc(candidatesCollection, event.candidate.toJSON());
        } catch (error) {
          console.error("Error saving ICE candidate:", error);
        }
      }
    };
  }

  return (
    <div className="room-container">
      <button onClick={handleEndMeeting}>End Meeting</button>

      <h2>
        {isRoomCreator ? "Room Created" : "Joined Room"}: {roomId}
      </h2>

      <div className="video-container">
        <div className="video-box">
          <h3>My Video</h3>
          <video
            ref={localVideo}
            autoPlay
            playsInline
            muted
            className="video-player"
          />
        </div>

        <div className="video-box">
          <h3>Other Person's Video</h3>
          <video
            ref={remoteVideo}
            autoPlay
            playsInline
            className="video-player"
          />
        </div>
      </div>
    </div>
  );
}

export default Room;