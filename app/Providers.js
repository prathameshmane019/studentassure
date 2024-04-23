"use client";
import { SessionProvider } from "next-auth/react";

import { Toaster } from 'sonner'
export const AuthProvider = ({ children }) => {
  return (<SessionProvider>{children}
   
    <Toaster richColors /></SessionProvider>)
};
