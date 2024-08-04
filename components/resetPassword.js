"use client"
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { useRouter } from 'next/navigation';
export default function ResetPasswordComponent() {
  const [identifier, setIdentifier] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('/api/reset-password', { identifier, oldPassword, newPassword });
      if (response.status === 200) {
        toast.success('Password reset successfully');
        router.push("/login")
      } else {
        toast.error(response.data.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Failed to reset password', error);
      toast.error('Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="w-full p-9 bg-white rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
          <Input
            type="text"
            variant="bordered"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="mb-4"
            placeholder="userID"
          />
          <Input
            type="password"
            variant="bordered"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="mb-4"
          />
          <Input
            type="password"
            variant="bordered"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mb-4"
          />
          <div className="flex justify-center space-x-4 mt-10">
            <Button variant="outline" type="button" onClick={() => { setIdentifier(''); setOldPassword(''); setNewPassword(''); }} className="w-36" disabled={isLoading}>
              Cancel
            </Button>
            <Button color="primary" type="submit" className="w-36" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Reset Password'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
