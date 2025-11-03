import React from 'react'
import { isFirebaseConfigured } from '../firebase/config'

const FirebaseSetupNotice = () => {
  if (isFirebaseConfigured()) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 shadow-lg z-50">
      <div className="flex items-start gap-3">
        <div className="text-yellow-400 text-xl">⚠️</div>
        <div className="flex-1">
          <h3 className="text-yellow-300 font-semibold mb-1">Firebase Not Configured</h3>
          <p className="text-yellow-200 text-sm mb-2">
            Please set up your .env file with Firebase credentials to use all features.
          </p>
          <p className="text-yellow-200/80 text-xs">
            Get your credentials from Firebase Console → Project Settings → General
          </p>
        </div>
      </div>
    </div>
  )
}

export default FirebaseSetupNotice

