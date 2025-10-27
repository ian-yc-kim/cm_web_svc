import React, { createContext, useContext, useState } from 'react'
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

function getInitialToken(): string | null {
  try {
    return typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(AUTH_TOKEN_KEY) : null
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('AuthProvider:', error)
    return null
  }
}

function getInitialUser(): User | null {
  try {
    const u = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('AUTH_USER') : null
    if (!u) return null
    try {
      return JSON.parse(u)
    } catch (e) {
      return null
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('AuthProvider:', error)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [token, setToken] = useState<string | null>(() => getInitialToken())
  const [user, setUser] = useState<User | null>(() => getInitialUser())
  const isAuthenticated = Boolean(token)

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
