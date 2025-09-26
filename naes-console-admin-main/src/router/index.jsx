import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Dashboard from '../pages/Dashboard'
import Message from '../pages/Message'
import News from '../pages/News'
import NewsAdd from '../pages/NewsAdd'
import NewsEditor from '../pages/NewsEditor'
import Profile from '../pages/Profile'
import Login from '../pages/Login'
import { useAuthStore } from '../stores/auth'

function ProtectedRoute({ children }) {
  const isAuthed = useAuthStore(state => Boolean(state.token))
  if (!isAuthed) return <Navigate to="/login" replace />
  return children
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="message" element={<Message />} />
        <Route path="news" element={<News />} />
        <Route path="news/add" element={<NewsAdd />} />
        <Route path="news/edit/:id" element={<NewsEditor />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
