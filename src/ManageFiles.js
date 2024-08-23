import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';

const ManageFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;

        if (!user) {
          alert("You must be logged in to manage files.");
          navigate('/login');
          return;
        }

        const { data, error } = await supabase.storage.from('files').list(user.id + '/');
        
        if (error) {
          throw error;
        }

        setFiles(data);
      } catch (error) {
        console.error('Error fetching files:', error.message);
        alert('Error fetching files.');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [navigate]);


  const handleDownload = async (fileName) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      const email = user.email;

      const { data, error } = await supabase.storage
        .from('files')
        .download(`${user.id}/${fileName}`);

      if (error) {
        throw error;
      }

      // Decrypt the file
      const reader = new FileReader();
      reader.onload = () => {
        const encrypted = reader.result;
        const decrypted = CryptoJS.AES.decrypt(encrypted, email).toString(CryptoJS.enc.Utf8);

        const blob = new Blob([decrypted], { type: data.type });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      };
      reader.readAsText(data);  // Ensure correct reading format
    } catch (error) {
      console.error('Error downloading file:', error.message);
      alert('Error downloading file.');
    }
  };

  const handleDelete = async (fileName) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      const { error } = await supabase.storage
        .from('files')
        .remove([`${user.id}/${fileName}`]);

      if (error) {
        throw error;
      }

      // Update the file list after deletion
      setFiles(files.filter(file => file.name !== fileName));
      alert('File deleted successfully!');
    } catch (error) {
      console.error('Error deleting file:', error.message);
      alert('Error deleting file.');
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  if (loading) {
    return <p>Loading files...</p>;
  }

  return (
    <div>
      <h2>Manage Files</h2>
      <button onClick={handleHome}>Back to Home</button>
      {files.length > 0 ? (
        <ul>
          {files.map((file) => (
            <li key={file.name}>
              {file.name}
              <button onClick={() => handleDownload(file.name)}>Download</button>
              <button onClick={() => handleDelete(file.name)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No files found.</p>
      )}
    </div>
  );
};

export default ManageFiles;
