import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import CryptoJS from 'crypto-js';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleHome = () => {
    navigate('/');
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const encryptFile = (file, key) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const wordArray = CryptoJS.lib.WordArray.create(reader.result);
        const encrypted = CryptoJS.AES.encrypt(wordArray, key).toString();
        resolve(encrypted);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setUploading(true);

    try {
      // Get the current user session
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) {
        alert("You must be logged in to upload files.");
        setUploading(false);
        return;
      }

      const email = user.email;

      // Encrypt the file using the user's email as the key
      const encryptedFile = await encryptFile(file, email);

      // Create a Blob from the encrypted data
      const blob = new Blob([encryptedFile], { type: file.type });

      // Upload the encrypted file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('files')
        .upload(`${user.id}/${file.name}`, blob);

      if (error) {
        throw error;
      }

      alert("File uploaded successfully!");
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error.message);
      alert("Error uploading file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload File</h2>
      <button onClick={handleHome}>Back to Home</button>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default Upload;
