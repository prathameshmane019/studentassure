"use client"
import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

// Create the context
const UserContext = createContext();

export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const { data: session } = useSession();
  
  useEffect(() => {
    if (session) {
      setUser(session?.user);
      console.log(user);
    }
  }, [session]);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};
