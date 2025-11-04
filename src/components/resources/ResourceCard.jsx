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

      {/* URL Preview or Uploaded Media */}
      {resource.urlPreview && !resource.mediaUrl && (
        <motion.a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 block group"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* YouTube Video Preview */}
          {(resource.urlPreview.type === 'youtube' || resource.urlPreview.type === 'youtube-short') && (
            <div className="relative overflow-hidden rounded-xl bg-black/20">
              {resource.urlPreview.image && (
                <img
                  src={resource.urlPreview.image}
                  alt={resource.urlPreview.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              {/* YouTube Badge */}
              <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                {resource.urlPreview.type === 'youtube-short' ? 'Short' : 'YouTube'}
              </div>
            </div>
          )}

          {/* Article Preview */}
          {resource.urlPreview.type === 'article' && resource.urlPreview.image && (
            <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10">
              <img
                src={resource.urlPreview.image}
                alt={resource.urlPreview.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h4 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                  {resource.urlPreview.title}
                </h4>
                {resource.urlPreview.description && (
                  <p className="text-gray-300 text-xs line-clamp-2">
                    {resource.urlPreview.description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Instagram Reel / TikTok / Other Preview */}
          {(resource.urlPreview.type === 'instagram-reel' || 
            resource.urlPreview.type === 'tiktok' || 
            resource.urlPreview.type === 'link') && (
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/20 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  {resource.urlPreview.type === 'instagram-reel' && (
                    <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  )}
                  {resource.urlPreview.type === 'tiktok' && (
                    <svg className="w-6 h-6 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
                    </svg>
                  )}
                  {resource.urlPreview.type === 'link' && (
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm mb-1">
                    {resource.urlPreview.title}
                  </h4>
                  {resource.urlPreview.description && (
                    <p className="text-gray-300 text-xs line-clamp-2">
                      {resource.urlPreview.description}
                    </p>
                  )}
                </div>
                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          )}
        </motion.a>
      )}

      {/* Uploaded Media Preview */}
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

      {/* URL Link (if no preview available) */}
      {resource.url && !resource.urlPreview && !resource.mediaUrl && (
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

