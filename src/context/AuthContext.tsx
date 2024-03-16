"use client";

import app from "@/config/firebase";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import React, { createContext, useEffect } from "react";

type authContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<UserCredential | null>;
  logout: () => void;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<UserCredential>;
};

const authContextDefaultValues: authContextType = {
  user: null,
  login: async () => null,
  logout: () => {},
  register: async () => ({} as UserCredential),
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = getAuth(app);

  const [user, setUser] = React.useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      console.log(userCredential.user);
      return userCredential;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      console.log("registering....");
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: name,
      });

      setUser(userCredential.user);
      return userCredential;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  const logout = () => {
    try {
      signOut(auth);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
