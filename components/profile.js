'use client'
import React from 'react';
import axios from 'axios';

const Profile = ({ profile }) => {
  const { department, classes, _id } = profile;

  return (
    <div className="profile">
      <h2>Profile Information</h2>
      <div>
        <strong>Department:</strong> {department}
      </div>
      <div>
        <strong>Classes:</strong> {classes.join(', ')}
      </div>
      <div>
        <strong>ID:</strong> {_id}
      </div>
    </div>
  );
};

export default Profile;