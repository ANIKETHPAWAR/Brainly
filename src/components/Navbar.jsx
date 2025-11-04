import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { currentUser, userProfile, signOut } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className={`flex justify-between items-center px-6 py-4 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/80 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
    }`}>
      <div className='flex items-center'>
        <Link to={currentUser ? "/dashboard" : "/"} className='italic text-2xl text-white font-semibold'>
          Brainly
        </Link>
      </div>
      <div className='flex items-center gap-6'>
        {currentUser ? (
          <>
            <Link to="/dashboard" className='text-white hover:text-gray-300 transition-colors'>
              Dashboard
            </Link>
            <Link to="/vault" className='text-white hover:text-gray-300 transition-colors'>
              My Vault
            </Link>
            <div className='flex items-center gap-3'>
              {userProfile?.photoURL && (
                <img 
                  src={userProfile.photoURL} 
                  alt={userProfile.displayName || 'User'} 
                  className='w-8 h-8 rounded-full'
                />
              )}
              <button 
                onClick={handleSignOut}
                className='text-white hover:text-gray-300 transition-colors'
              >
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/features" className='text-white hover:text-gray-300 transition-colors'>
              Features
            </Link>
            <Link to="/login" className='text-white hover:text-gray-300 transition-colors'>
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar