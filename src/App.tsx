import './styles/App.css'
import Layout from './components/Layout'
import { Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="login" element={<div>Login Page</div>} />
        <Route path="signup" element={<div>Signup Page</div>} />
        <Route path="customer" element={<div>Customer Home</div>} />
      </Route>
    </Routes>
  )
}
