// Firebase configuration
// Replace these values with your Firebase project credentials
// Get them from: https://console.firebase.google.com/project/_/settings/general

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Check if Firebase is configured
const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey && 
         firebaseConfig.authDomain && 
         firebaseConfig.projectId &&
         !firebaseConfig.apiKey.includes('your-') &&
         !firebaseConfig.projectId.includes('your-')
}

// Initialize Firebase only if configured
let app = null
let auth = null
let db = null
let storage = null

if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    // Initialize Firestore with the 'brainly' database (not default)
    // Change 'brainly' to match your database name if different
    db = getFirestore(app, 'brainly')
    storage = getStorage(app)
  } catch (error) {
    console.error('Error initializing Firebase:', error)
  }
} else {
  console.warn('⚠️ Firebase is not configured. Please set up your .env file with Firebase credentials.')
}

export { auth, db, storage, isFirebaseConfigured }
export default app

