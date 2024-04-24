import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Profile from '@ /components/Profile'; // Update the import path based on your project structure

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile'); // API endpoint to fetch profile data
        setProfile(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.error : err.message);
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      {profile ? (
        <Profile profile={profile} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ProfilePage;
