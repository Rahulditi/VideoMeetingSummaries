import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBjrAc19vKIwcPhqgeqVjCtJV-fPTmm7u4",
    authDomain: "videochatapp-dbaec.firebaseapp.com",
    projectId: "videochatapp-dbaec",
    storageBucket: "videochatapp-dbaec.firebasestorage.app",
    messagingSenderId: "507640064860",
    appId: "1:507640064860:web:cd2b3c6f0fa4db6a0a6f99"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
