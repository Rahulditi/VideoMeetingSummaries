import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const Summaries = () => {
    const [transcripts, setTranscripts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTranscripts = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;

                if (!user) {
                    console.log("No user logged in");
                    navigate("/login");
                    return;
                }

                const userEmail = user.email;

                // First, get the user's roomIds from the users collection
                const userDocRef = doc(db, "users", userEmail);
                const userDoc = await getDoc(userDocRef);

                if (!userDoc.exists()) {
                    console.log("User document not found");
                    setError("User profile not found. Please try logging in again.");
                    setLoading(false);
                    return;
                }

                const userData = userDoc.data();
                // Check for both roomIds (plural) and roomId (singular) to handle both formats
                const roomIds = userData.roomIds || userData.roomId || [];

                console.log("Found room IDs:", roomIds);

                if (roomIds.length === 0) {
                    console.log("No room IDs found for user");
                    setLoading(false);
                    return;
                }

                // Now fetch the transcript and summary for each roomId
                const userTranscripts = [];

                for (const roomId of roomIds) {
                    const roomDocRef = doc(db, "rooms", roomId);
                    const roomDoc = await getDoc(roomDocRef);

                    if (roomDoc.exists()) {
                        const roomData = roomDoc.data();
                        userTranscripts.push({
                            id: roomId,
                            transcript: roomData.transcript || "No transcript available",
                            summary: roomData.summary || "No summary available",
                        });
                    } else {
                        console.log(`Room ${roomId} not found`);
                    }
                }

                setTranscripts(userTranscripts);
                console.log("Fetched transcripts:", userTranscripts);
            } catch (error) {
                console.error("Error fetching transcripts:", error);
                setError("Failed to load your meeting data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchTranscripts();
    }, [navigate]);

    return (
        <div className="summaries-container" style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
            <h1 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "bold" }}>My Meeting Transcripts</h1>

            {loading ? (
                <p>Loading your transcripts...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : transcripts.length === 0 ? (
                <div>
                    <p>No transcripts found.</p>
                    <button
                        onClick={() => navigate("/dashboard")}
                        style={{
                            marginTop: "20px",
                            padding: "8px 16px",
                            backgroundColor: "#4a90e2",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Back to Dashboard
                    </button>
                </div>
            ) : (
                <div>
                    {transcripts.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                marginBottom: "20px",
                                padding: "15px",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                            }}
                        >
                            <h3 style={{ fontSize: "18px", fontWeight: "500" }}>Meeting ID: {item.id}</h3>

                            <div style={{ marginTop: "15px" }}>
                                <h4 style={{ fontSize: "16px", fontWeight: "500", color: "#333" }}>Summary:</h4>
                                <p style={{
                                    marginTop: "5px",
                                    backgroundColor: "#f9f9f9",
                                    padding: "10px",
                                    borderRadius: "4px",
                                    whiteSpace: "pre-line"
                                }}>
                                    {item.summary}
                                </p>
                            </div>

                            <div style={{ marginTop: "15px" }}>
                                <h4 style={{ fontSize: "16px", fontWeight: "500", color: "#333" }}>Transcript:</h4>
                                <p style={{
                                    marginTop: "5px",
                                    backgroundColor: "#f9f9f9",
                                    padding: "10px",
                                    borderRadius: "4px",
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                    whiteSpace: "pre-line"
                                }}>
                                    {item.transcript}
                                </p>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={() => navigate("/dashboard")}
                        style={{
                            marginTop: "20px",
                            padding: "8px 16px",
                            backgroundColor: "#4a90e2",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Back to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default Summaries;