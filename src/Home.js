// src/Home.js
import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };

    fetchUser();

    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleUpload = () => {
    navigate('/upload');
  };

  const handleManageFiles = () => {
    navigate('/manage-files');
  };

  return (
    <div>
      <button onClick={handleLogout} style={{ position: 'absolute', top: '10px', left: '10px' }}>
        Log Out
      </button>
      <h2>Welcome to the Secure File Storage System</h2>
      {user ? (
        <div>
          <p>You are logged in as {user.email}</p>
          <button onClick={handleUpload}>Upload File</button>
          <button onClick={handleManageFiles}>Manage Files</button>
        </div>
      ) : (
        <div>
          <p>Please log in or sign up to continue.</p>
          <button onClick={() => navigate('/login')}>Log In</button>
          <button onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      )}
    </div>
  );
};

export default Home;
