"use client";
import { SessionProvider } from "next-auth/react";
import NoInternetPage from "@/components/NoInternetPage";
import { Toaster } from 'sonner'
import { useState,useEffect } from "react";
export const AuthProvider = ({ children }) => {

  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);
  return (<SessionProvider>
    {!isOnline ? <NoInternetPage /> : children}
   
    <Toaster richColors /></SessionProvider>)
};
