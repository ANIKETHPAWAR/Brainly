import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { RESOURCE_TYPES } from '../../services/resourceService'

const ResourceCard = ({ resource, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false)
  const formatDate = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case RESOURCE_TYPES.ARTICLE:
        return '📄'
      case RESOURCE_TYPES.VIDEO:
        return '🎥'
      case RESOURCE_TYPES.PHOTO:
        return '🖼️'
      case RESOURCE_TYPES.NOTE:
        return '📝'
      default:
        return '📎'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case RESOURCE_TYPES.ARTICLE:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50'
      case RESOURCE_TYPES.VIDEO:
        return 'bg-red-500/20 text-red-300 border-red-500/50'
      case RESOURCE_TYPES.PHOTO:
        return 'bg-purple-500/20 text-purple-300 border-purple-500/50'
      case RESOURCE_TYPES.NOTE:
        return 'bg-green-500/20 text-green-300 border-green-500/50'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50'
    }
  }

  return (
    <motion.div 
      className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 cursor-pointer h-full flex flex-col transition-all duration-300"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.02,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <motion.span 
            className="text-3xl"
            animate={isHovered ? { scale: 1.2, rotate: [0, -10, 10, -10, 0] } : { scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {getTypeIcon(resource.type)}
          </motion.span>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-xl truncate mb-2">
              {resource.title}
            </h3>
            <motion.span 
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(resource.type)}`}
              whileHover={{ scale: 1.1 }}
            >
              {resource.type}
            </motion.span>
          </div>
        </div>
        <motion.div 
          className="flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.6 }}
          transition={{ duration: 0.2 }}
        >
          {onEdit && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                onEdit(resource)
              }}
              className="p-2 rounded-lg bg-white/10 hover:bg-blue-500/30 text-gray-300 hover:text-blue-300 transition-all"
              title="Edit"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </motion.button>
          )}
          {onDelete && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                onDelete(resource.id)
              }}
              className="p-2 rounded-lg bg-white/10 hover:bg-red-500/30 text-gray-300 hover:text-red-300 transition-all"
              title="Delete"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* URL */}
      {resource.url && (
        <motion.a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-300 hover:text-blue-200 text-sm truncate mb-4 flex items-center gap-2 group"
          whileHover={{ x: 5 }}
        >
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span className="truncate">{resource.url}</span>
        </motion.a>
      )}

      {/* Media Preview */}
      {resource.mediaUrl && (
        <motion.div 
          className="mb-4 overflow-hidden rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {resource.type === RESOURCE_TYPES.PHOTO ? (
            <img
              src={resource.mediaUrl}
              alt={resource.title}
              className="w-full h-48 object-cover rounded-xl hover:scale-105 transition-transform duration-300"
            />
          ) : resource.type === RESOURCE_TYPES.VIDEO ? (
            <video
              src={resource.mediaUrl}
              controls
              className="w-full h-48 object-cover rounded-xl"
            />
          ) : null}
        </motion.div>
      )}

      {/* Notes */}
      {resource.notes && (
        <p className="text-gray-200 text-sm mb-4 line-clamp-3 leading-relaxed">
          {resource.notes}
        </p>
      )}

      {/* Tags */}
      {resource.tags && resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {resource.tags.map((tag, index) => (
            <motion.span
              key={index}
              className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs rounded-full border border-white/20"
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              #{tag}
            </motion.span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-300 pt-4 mt-auto border-t border-white/10">
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(resource.createdAt)}
        </span>
        {resource.reminderDate && (
          <motion.span 
            className="text-yellow-300 flex items-center gap-1"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ⏰ Reminder
          </motion.span>
        )}
      </div>
    </motion.div>
  )
}

export default ResourceCard

