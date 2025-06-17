import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from "./pages/ProtectedRoute";
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Room from './components/Room';
import "./App.css"
import Summaries from "./components/Summaries"


function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
          <Route path="/summaries" element={<ProtectedRoute><Summaries /></ProtectedRoute>} />
          <Route path="/room/:roomId" element={<ProtectedRoute><Room /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App