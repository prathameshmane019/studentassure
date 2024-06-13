"use client"
import { useUser, useUserUpdate } from "@/app/context/UserContext";
import { useState } from "react";

function ProfilePage() {
  const user = useUser();
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Profile Information</h1>
        {user ? (
          <>
        
              <div>
                <div className="mb-4">
                  <label className=" text-gray-700 text-sm font-bold mb-2">ID:</label>
                  <p className="text-gray-900">{user.id}</p>
                </div>
                <div className="mb-4">
                  <label className=" text-gray-700 text-sm font-bold mb-2">Department:</label>
                  <p className="text-gray-900">{user.department}</p>
                </div>
              </div>
          </>
        ) : (
          <p className="text-center text-red-500">Please log in to view your profile.</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
