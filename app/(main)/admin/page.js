"use client"
import { useUser, useUserUpdate } from "@/app/context/UserContext";
import { useState } from "react";

function ProfilePage() {
  const user = useUser();
  // const updateUser = useUserUpdate(); // Using the context function to update the user
  const [isEditing, setIsEditing] = useState(false);
  // const [editableUser, setEditableUser] = useState({ id: user?.id, department: user?.department, password: user?.password, classes: user?.classes });

  const handleSave = async () => {
    await updateUser(editableUser);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Profile Information</h1>
        {user ? (
          <>
            <button
              className="bg-transparent border border-primary text-primary py-1 px-2 rounded mb-4"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            {isEditing ? (
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">ID:</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={editableUser.id}
                    onChange={(e) => setEditableUser({ ...editableUser, id: e.target.value })}
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Department:</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={editableUser.department}
                    onChange={(e) => setEditableUser({ ...editableUser, department: e.target.value })}
                  />
                </div>
                <button
                  className="bg-primary text-white py-1 px-2 rounded"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">ID:</label>
                  <p className="text-gray-900">{user.id}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Department:</label>
                  <p className="text-gray-900">{user.department}</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-red-500">Please log in to view your profile.</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
