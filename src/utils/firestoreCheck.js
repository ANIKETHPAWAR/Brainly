// Utility to check if Firestore is accessible
// This prevents Firestore errors when database isn't set up
import { db } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'

let firestoreReady = false
let checking = false
let hasChecked = false

export const checkFirestoreReady = async () => {
  // If we've already checked and it's not ready, don't check again
  if (hasChecked && !firestoreReady && !db) {
    return false
  }
  
  // If already ready, return true
  if (firestoreReady) {
    return true
  }
  
  // If currently checking, wait a bit
  if (checking) {
    return false
  }

  if (!db) {
    return false
  }

  checking = true
  hasChecked = true
  
  try {
    // Try a simple read operation to test Firestore
    // Use a non-existent document to avoid any actual data issues
    // Use _test collection which should be allowed in security rules
    const testRef = doc(db, '_test', 'connection')
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Firestore timeout')), 2000)
    )
    
    // Suppress errors - we just want to know if connection works
    const result = await Promise.race([
      getDoc(testRef).catch((err) => {
        // If we get any error, check the error code
        // permission-denied means Firestore exists (ready)
        // unavailable or 400 means not set up (not ready)
        if (err.code === 'permission-denied' || err.code === 'not-found') {
          return { ready: true } // Firestore exists, just no permission or doc doesn't exist
        }
        throw err
      }),
      timeoutPromise
    ])
    
    // If we get here, Firestore is accessible
    firestoreReady = true
    checking = false
    return true
  } catch (error) {
    // If it's a connection error (400, timeout, unavailable), Firestore isn't set up
    if (error.message?.includes('timeout') || 
        error.message?.includes('timeout') ||
        error.code === 'unavailable' ||
        error.code === 'deadline-exceeded') {
      firestoreReady = false
      checking = false
      return false
    }
    
    // Any other error means Firestore exists but might have permission issues
    // Mark as ready anyway - we'll handle permission errors separately
    firestoreReady = true
    checking = false
    return true
  }
}

export const isFirestoreReady = () => firestoreReady

export const resetFirestoreCheck = () => {
  firestoreReady = false
  checking = false
  hasChecked = false
}

