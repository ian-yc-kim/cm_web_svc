import React, { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import * as customerService from '../api/customerService'
import { AUTH_TOKEN_KEY } from '../api/http'

export interface User {
  employee_id?: string
  [k: string]: unknown
}

export interface AuthContextValue {
  isAuthenticated: boolean
  token: string | null
  user: User | null
  login: (cred: customerService.LoginRequest) => Promise<void>
  logout: () => void
  signup: (data: customerService.SignupRequest) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const isAuthenticated = Boolean(token)

  useEffect(() => {
    try {
      const t = sessionStorage.getItem(AUTH_TOKEN_KEY)
      const u = sessionStorage.getItem('AUTH_USER')
      if (t) {
        setToken(t)
        if (u) {
          try {
            setUser(JSON.parse(u))
          } catch (e) {
            setUser(null)
          }
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('AuthProvider:', error)
    }
  }, [])

  const login = async (cred: customerService.LoginRequest): Promise<void> => {
    try {
      const resp = await customerService.login(cred)
      const accessToken = resp.access_token
      setToken(accessToken)
      setUser(resp.user ?? null)
      try {
        sessionStorage.setItem(AUTH_TOKEN_KEY, accessToken)
        if (resp.user) {
          sessionStorage.setItem('AUTH_USER', JSON.stringify(resp.user))
        } else {
          sessionStorage.removeItem('AUTH_USER')
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('AuthProvider: sessionStorage error', e)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('AuthProvider:', error)
      throw error
    }
  }

  const logout = (): void => {
    try {
      sessionStorage.removeItem(AUTH_TOKEN_KEY)
      sessionStorage.removeItem('AUTH_USER')
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('AuthProvider logout:', e)
    }
    setToken(null)
    setUser(null)
  }

  const signup = async (data: customerService.SignupRequest): Promise<void> => {
    try {
      await customerService.signup(data)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('AuthProvider signup:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
