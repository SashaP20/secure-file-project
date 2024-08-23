// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import Upload from './Upload';
import ManageFiles from './ManageFiles';
import { useEffect } from 'react';

function App() {
 
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/manage-files" element={<ManageFiles />} />
      </Routes>
    </Router>
  );
}

export default App;
