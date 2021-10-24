import React, { createContext, useContext, useEffect, useState } from "react"
import * as AuthSession from "expo-auth-session"
import { api } from "../../services/api"
import AsyncStorage from "@react-native-async-storage/async-storage"

const CLIENT_ID = 'da3f2f2bf7954b9cc481'
const SCOPE = 'read:user'
const USER_STORAGE = '@nlwheat:user'
const TOKEN_STORAGE = '@nlwheat:token'

type User = {
  id: string;
  avatar_url: string;
  name: string;
  login: string;
}

const AuthContext = createContext({} as {
  user: User | null;
  isSigningIn: boolean;
  signIn(): Promise<void>;
  signOut(): Promise<void>;
});

type AuthResponse = {
  token: string;
  user: User;
}

type AuthorizationResponse = {
  params: {
    code?: string;
    error?: string;
  },
  type?: string;
}

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isSigningIn, setIsSigningIn] = useState(true)

  async function signIn() {
    try {
      setIsSigningIn(true)
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`
      const authSessionResponse = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse

      if (authSessionResponse.type === 'success' && authSessionResponse.params.error !== 'access_denied') {
        const { code } = authSessionResponse.params
        const authResponse = await api.post<AuthResponse>('authenticate', { code })
        const { user, token } = authResponse.data

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`

        await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user))
        await AsyncStorage.setItem(TOKEN_STORAGE, token)

        setUser(user)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsSigningIn(false)
    }
  }

  async function signOut() {
    try {
      await AsyncStorage.removeItem(USER_STORAGE)
      await AsyncStorage.removeItem(TOKEN_STORAGE)
      setUser(null)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    async function loadingUserStorageData() {
      const userStorage = await AsyncStorage.getItem(USER_STORAGE)
      const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE)

      if (userStorage && tokenStorage) {
        api.defaults.headers.common['Authorization'] = `Bearer ${tokenStorage}`

        setUser(JSON.parse(userStorage))
      }

      setIsSigningIn(false)
    }
    loadingUserStorageData()
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      isSigningIn,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}
