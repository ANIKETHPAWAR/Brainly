import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth'
import { auth, db, isFirebaseConfigured } from '../firebase/config'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { checkFirestoreReady, isFirestoreReady } from '../utils/firestoreCheck'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured. Please set up your .env file with Firebase credentials.')
    }
    
    if (!auth) {
      throw new Error('Firebase Auth is not initialized. Please check your Firebase configuration.')
    }

    const provider = new GoogleAuthProvider()
    // Add additional scopes if needed
    provider.setCustomParameters({
      prompt: 'select_account'
    })
    
    try {
      // Use signInWithPopup with error handling for popup blockers
      let result
      try {
        result = await signInWithPopup(auth, provider)
      } catch (popupError) {
        // If popup is blocked, try redirect method
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.message?.includes('Cross-Origin-Opener-Policy')) {
          throw new Error('Popup blocked. Please allow popups for this site and try again.')
        }
        throw popupError
      }
      
      const user = result.user
      
      // Create or update user profile in Firestore
      // Only try if Firestore is ready
      if (db) {
        // Check if Firestore is ready first
        const ready = await checkFirestoreReady()
        
        if (ready) {
          try {
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Firestore request timeout')), 3000)
            )
            
            const userRef = doc(db, 'users', user.uid)
            const userSnap = await Promise.race([
              getDoc(userRef),
              timeoutPromise
            ])
            
            if (!userSnap || !userSnap.exists()) {
              // Create new user profile
              await Promise.race([
                setDoc(userRef, {
                  uid: user.uid,
                  email: user.email,
                  displayName: user.displayName,
                  photoURL: user.photoURL,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }),
                timeoutPromise
              ])
            }
          } catch (firestoreError) {
            // Silently handle - auth succeeded even if Firestore fails
            // Don't throw - auth succeeded even if Firestore fails
          }
        }
      }
      
      return user
    } catch (error) {
      console.error('Error signing in with Google:', error)
      throw error
    }
  }

  // Sign out
  const signOut = async () => {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized.')
    }
    try {
      await firebaseSignOut(auth)
      setUserProfile(null)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  // Listen to auth state changes
  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      
      if (user && db) {
        // Check if Firestore is ready before trying to use it
        const ready = await checkFirestoreReady()
        
        if (ready) {
          try {
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Firestore request timeout')), 3000)
            )
            
            const userRef = doc(db, 'users', user.uid)
            const userSnap = await Promise.race([
              getDoc(userRef),
              timeoutPromise
            ])
            
            if (userSnap && userSnap.exists()) {
              setUserProfile(userSnap.data())
            } else {
              setUserProfile(null)
            }
          } catch (firestoreError) {
            // Silently handle - Firestore might not be fully set up
            setUserProfile(null)
          }
        } else {
          // Firestore not ready - don't try to use it
          setUserProfile(null)
        }
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userProfile,
    signInWithGoogle,
    signOut,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

