
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../auth/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  
  const [admin, setAdmin] = useState(null); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setAdmin(null);
      } else if (currentUser.email === "admin@example.com") {
        setAdmin(currentUser);
        setUser(null);
      } else {
        setUser(currentUser);
        setAdmin(null);
      }
    });
    return () => unsubscribe();
  }, []);

  
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" }); // always show account selection
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Google login error:", err.message);
    }
  };

  
  const loginAsAdmin = async (email, password) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      if (credential.user.email !== "admin@example.com") {
        throw new Error("Not authorized as admin");
      }
      setAdmin(credential.user);
    } catch (err) {
      console.error("Admin login error:", err.message);
      throw err; 
    }
  };

  
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ user, admin, loginWithGoogle, loginAsAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

