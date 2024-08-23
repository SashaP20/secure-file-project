import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import CryptoJS from 'crypto-js';

const staticKey = "qJ6W8v9X2aFc3dLn";

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

  const encryptFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const wordArray = CryptoJS.lib.WordArray.create(reader.result);
        const encrypted = CryptoJS.AES.encrypt(wordArray, staticKey).toString();
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
      const encryptedFile = await encryptFile(file);

      const blob = new Blob([encryptedFile], { type: file.type });

      const { data, error } = await supabase.storage
        .from('files')
        .upload(file.name, blob);

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
