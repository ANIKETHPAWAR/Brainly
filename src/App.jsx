import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import './App.css'
import Home from './pages/Home'
import Login from './components/auth/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import FirebaseSetupNotice from './components/FirebaseSetupNotice'

// Component to redirect logged-in users away from login page
const LoginRoute = () => {
  const { currentUser, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }
  
  if (currentUser) {
    return <Navigate to="/dashboard" replace />
  }
  
  return <Login />
}

function App() {
  return (
    <div className="App">
      <FirebaseSetupNotice />
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route 
          path="/" 
          element={
            <>
              <Navbar />
              <Home />
            </>
          } 
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Navbar />
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vault"
          element={
            <ProtectedRoute>
              <Navbar />
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
