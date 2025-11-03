import React from 'react'
import { RESOURCE_TYPES } from '../../services/resourceService'

const ResourceCard = ({ resource, onEdit, onDelete }) => {
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
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all duration-200 p-6 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-2xl">{getTypeIcon(resource.type)}</span>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-lg truncate">
              {resource.title}
            </h3>
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getTypeColor(resource.type)}`}>
              {resource.type}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(resource)}
              className="text-gray-400 hover:text-blue-400 transition-colors"
              title="Edit"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(resource.id)}
              className="text-gray-400 hover:text-red-400 transition-colors"
              title="Delete"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* URL */}
      {resource.url && (
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 text-sm truncate block mb-3"
        >
          {resource.url}
        </a>
      )}

      {/* Media Preview */}
      {resource.mediaUrl && (
        <div className="mb-3">
          {resource.type === RESOURCE_TYPES.PHOTO ? (
            <img
              src={resource.mediaUrl}
              alt={resource.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          ) : resource.type === RESOURCE_TYPES.VIDEO ? (
            <video
              src={resource.mediaUrl}
              controls
              className="w-full h-48 object-cover rounded-lg"
            />
          ) : null}
        </div>
      )}

      {/* Notes */}
      {resource.notes && (
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {resource.notes}
        </p>
      )}

      {/* Tags */}
      {resource.tags && resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {resource.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-700/50">
        <span>Created {formatDate(resource.createdAt)}</span>
        {resource.reminderDate && (
          <span className="text-yellow-400">
            ⏰ Reminder set
          </span>
        )}
      </div>
    </div>
  )
}

export default ResourceCard

