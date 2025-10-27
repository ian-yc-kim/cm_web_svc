import './styles/App.css'
import Layout from './components/Layout'
import { Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'
import { AuthProvider } from './contexts/AuthContext'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import CustomerPage from './pages/CustomerPage'
import ProtectedRoute from './components/ProtectedRoute'

export default function App(): JSX.Element {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route
            path="customer"
            element={<ProtectedRoute><CustomerPage /></ProtectedRoute>}
          />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
