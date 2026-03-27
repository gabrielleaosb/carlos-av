import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseAuth } from "../constants/firebase";
import { User } from "../types";

const SESSION_KEY  = "@fittrack:user";
const onboardKey   = (id: string) => `@fittrack:onboarded:${id}`;

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithEmail:           (email: string, password: string) => Promise<void>;
  signInWithGoogleCredential:(idToken: string) => Promise<void>;
  signUp:                    (name: string, email: string, password: string) => Promise<void>;
  signOut:                   () => Promise<void>;
  updateUser:                (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,      setUser]      = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(SESSION_KEY)
      .then((json) => { if (json) setUser(JSON.parse(json)); })
      .finally(() => setIsLoading(false));
  }, []);

  async function persist(u: User | null) {
    if (u) await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(u));
    else   await AsyncStorage.removeItem(SESSION_KEY);
    setUser(u);
  }

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await firebaseAuth.signIn(email, password);
      // Lê onboardingDone de chave separada (persiste mesmo após logout)
      const onboarded     = await AsyncStorage.getItem(onboardKey(result.localId));
      const onboardingDone = onboarded === "true";
      // Recupera dados físicos e objetivo que podem ter sido salvos antes
      const stored = await AsyncStorage.getItem(SESSION_KEY);
      const prev   = stored ? (JSON.parse(stored) as User) : null;
      const sameUser = prev?.id === result.localId;
      await persist({
        id:             result.localId,
        name:           result.displayName ?? email.split("@")[0],
        email:          result.email,
        weight:         sameUser ? prev?.weight  : undefined,
        height:         sameUser ? prev?.height  : undefined,
        goal:           sameUser ? prev?.goal    : undefined,
        onboardingDone,
        createdAt:      sameUser ? (prev?.createdAt ?? new Date().toISOString()) : new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInWithGoogleCredential = useCallback(async (idToken: string) => {
    setIsLoading(true);
    try {
      const result = await firebaseAuth.signInWithGoogle(idToken);
      const onboarded     = await AsyncStorage.getItem(onboardKey(result.localId));
      const onboardingDone = onboarded === "true";
      const stored = await AsyncStorage.getItem(SESSION_KEY);
      const prev   = stored ? (JSON.parse(stored) as User) : null;
      const sameUser = prev?.id === result.localId;
      await persist({
        id:             result.localId,
        name:           result.displayName ?? result.email.split("@")[0],
        email:          result.email,
        weight:         sameUser ? prev?.weight  : undefined,
        height:         sameUser ? prev?.height  : undefined,
        goal:           sameUser ? prev?.goal    : undefined,
        onboardingDone,
        createdAt:      sameUser ? (prev?.createdAt ?? new Date().toISOString()) : new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await firebaseAuth.signUp(email, password);
      await firebaseAuth.updateProfile(result.idToken, name);
      await persist({
        id:             result.localId,
        name,
        email:          result.email,
        onboardingDone: false,
        createdAt:      new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await persist(null);
  }, []);

  const updateUser = useCallback(async (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return { ...prev!, ...data };
      return { ...prev, ...data };
    });
    // Persiste fora do setState para evitar race condition no SQLite
    const stored = await AsyncStorage.getItem(SESSION_KEY);
    const prev   = stored ? (JSON.parse(stored) as User) : null;
    if (prev) {
      const updated = { ...prev, ...data };
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      if (data.onboardingDone === true) {
        await AsyncStorage.setItem(onboardKey(prev.id), "true");
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      signInWithEmail,
      signInWithGoogleCredential,
      signUp,
      signOut,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
