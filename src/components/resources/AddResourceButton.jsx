import React from 'react'
import { motion } from 'framer-motion'

const AddResourceButton = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 backdrop-blur-sm border border-white/20"
      title="Add Resource"
      whileHover={{ 
        scale: 1.1,
        boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)'
      }}
      whileTap={{ scale: 0.9 }}
      animate={{
        boxShadow: [
          '0 0 20px rgba(59, 130, 246, 0.4)',
          '0 0 30px rgba(147, 51, 234, 0.6)',
          '0 0 20px rgba(59, 130, 246, 0.4)'
        ]
      }}
      transition={{
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
    >
      <motion.svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        animate={{ rotate: [0, 90, 0] }}
        transition={{ duration: 0.3 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M12 4v16m8-8H4"
        />
      </motion.svg>
    </motion.button>
  )
}

export default AddResourceButton

