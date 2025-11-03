import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createResource, updateResource, RESOURCE_TYPES } from '../../services/resourceService'

const AddResourceModal = ({ isOpen, onClose, resource, userId }) => {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [type, setType] = useState(RESOURCE_TYPES.ARTICLE)
  const [tags, setTags] = useState('')
  const [notes, setNotes] = useState('')
  const [file, setFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isEditing = !!resource

  useEffect(() => {
    if (resource) {
      setTitle(resource.title || '')
      setUrl(resource.url || '')
      setType(resource.type || RESOURCE_TYPES.ARTICLE)
      setTags(resource.tags?.join(', ') || '')
      setNotes(resource.notes || '')
      setFilePreview(resource.mediaUrl || null)
    } else {
      resetForm()
    }
  }, [resource, isOpen])

  const resetForm = () => {
    setTitle('')
    setUrl('')
    setType(RESOURCE_TYPES.ARTICLE)
    setTags('')
    setNotes('')
    setFile(null)
    setFilePreview(null)
    setError('')
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      
      // Create preview
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setFilePreview(reader.result)
        }
        reader.readAsDataURL(selectedFile)
      } else if (selectedFile.type.startsWith('video/')) {
        // For videos, create object URL for preview
        setFilePreview(URL.createObjectURL(selectedFile))
      } else {
        setFilePreview(null)
      }
    } else {
      setFile(null)
      setFilePreview(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!title.trim()) {
        throw new Error('Title is required')
      }

      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const resourceData = {
        title: title.trim(),
        url: url.trim() || null,
        type,
        tags: tagsArray,
        notes: notes.trim()
      }

      if (isEditing) {
        await updateResource(resource.id, resourceData, file)
      } else {
        await createResource(resourceData, userId, file)
      }

      resetForm()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to save resource. Please try again.')
      console.error('Error saving resource:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      resetForm()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden border border-white/20 flex flex-col"
        >
          {/* Header with gradient accent */}
          <div className="relative bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm border-b border-white/20 px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-2xl"
              >
                {isEditing ? '✏️' : '➕'}
              </motion.div>
              <div>
                <h2 className="text-3xl font-bold text-white italic">
                  {isEditing ? 'Edit Resource' : 'Add New Resource'}
                </h2>
                <p className="text-gray-300 text-sm mt-1">
                  {isEditing ? 'Update your resource details' : 'Save something valuable to your vault'}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.85 }}
              onClick={handleClose}
              disabled={loading}
              className="text-gray-300 hover:text-white transition-colors disabled:opacity-50 p-2 rounded-xl hover:bg-white/10 backdrop-blur-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>

        {/* Scrollable Form */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm backdrop-blur-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all hover:bg-white/15"
              placeholder="e.g., React Documentation, Awesome Tutorial..."
            />
          </motion.div>

          {/* URL */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-2"
          >
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              URL (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all hover:bg-white/15"
                placeholder="https://example.com/article"
              />
            </div>
          </motion.div>

          {/* Type - Radio Button Style */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              Resource Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: RESOURCE_TYPES.ARTICLE, icon: '📄', label: 'Article', activeClass: 'border-blue-400 bg-blue-500/30 shadow-lg shadow-blue-500/20' },
                { value: RESOURCE_TYPES.VIDEO, icon: '🎥', label: 'Video', activeClass: 'border-red-400 bg-red-500/30 shadow-lg shadow-red-500/20' },
                { value: RESOURCE_TYPES.PHOTO, icon: '🖼️', label: 'Photo', activeClass: 'border-purple-400 bg-purple-500/30 shadow-lg shadow-purple-500/20' },
                { value: RESOURCE_TYPES.NOTE, icon: '📝', label: 'Note', activeClass: 'border-green-400 bg-green-500/30 shadow-lg shadow-green-500/20' }
              ].map((typeOption) => (
                <motion.button
                  key={typeOption.value}
                  type="button"
                  onClick={() => setType(typeOption.value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-xl border-2 transition-all backdrop-blur-sm ${
                    type === typeOption.value
                      ? typeOption.activeClass
                      : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
                  }`}
                >
                  <div className="text-3xl mb-2">{typeOption.icon}</div>
                  <div className={`text-xs font-semibold ${
                    type === typeOption.value ? 'text-white' : 'text-gray-400'
                  }`}>
                    {typeOption.label}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-2"
          >
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Tags (Optional)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all hover:bg-white/15"
              placeholder="react, tutorial, javascript"
            />
            <div className="flex items-center gap-2 mt-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-gray-400">Separate multiple tags with commas</p>
            </div>
            {/* Preview tags */}
            {tags && tags.split(',').filter(t => t.trim()).length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex flex-wrap gap-2 mt-3"
              >
                {tags.split(',').filter(t => t.trim()).map((tag, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm text-white text-xs rounded-full border border-white/20"
                  >
                    #{tag.trim()}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Notes */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all resize-none hover:bg-white/15"
              placeholder="Add your thoughts, key takeaways, or reminders about this resource..."
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-400">Share your insights or key points</p>
              <span className="text-xs text-gray-500">{notes.length} characters</span>
            </div>
          </motion.div>

          {/* File Upload */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="space-y-2"
          >
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Media (Optional)
            </label>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,video/*"
                className="w-full px-4 py-4 bg-white/10 backdrop-blur-md border-2 border-dashed border-white/30 rounded-xl text-white text-sm file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-600 file:to-purple-600 file:text-white hover:file:from-blue-700 hover:file:to-purple-700 cursor-pointer transition-all hover:border-white/40 hover:bg-white/15"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-xs text-gray-400">Click to upload or drag and drop</p>
                </div>
              </div>
            </motion.div>
            <AnimatePresence>
              {filePreview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, height: 0 }}
                  animate={{ opacity: 1, scale: 1, height: 'auto' }}
                  exit={{ opacity: 0, scale: 0.9, height: 0 }}
                  className="mt-4 overflow-hidden rounded-xl border-2 border-white/20"
                >
                  {type === RESOURCE_TYPES.PHOTO || file?.type?.startsWith('image/') ? (
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="w-full h-56 object-cover"
                    />
                  ) : (
                    <video
                      src={filePreview}
                      controls
                      className="w-full h-56 object-cover"
                    />
                  )}
                  <div className="p-3 bg-white/5 backdrop-blur-sm flex items-center justify-between">
                    <span className="text-xs text-gray-300 truncate">{file?.name}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setFile(null)
                        setFilePreview(null)
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 pt-6 border-t border-white/10"
          >
            <motion.button
              type="button"
              onClick={handleClose}
              disabled={loading}
              whileHover={{ scale: 1.03, x: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={loading || !title.trim()}
              whileHover={{ scale: 1.03, x: 2 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <motion.svg
                    className="w-5 h-5"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </motion.svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{isEditing ? 'Update Resource' : 'Add to Vault'}</span>
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
        </div>
      </motion.div>
    </motion.div>
    </AnimatePresence>
  )
}

export default AddResourceModal

