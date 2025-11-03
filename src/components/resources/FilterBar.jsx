import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RESOURCE_TYPES } from '../../services/resourceService'

const FilterBar = ({ selectedType, onTypeChange, onClear }) => {
  const types = [
    { value: '', label: 'All Types', icon: '📚' },
    { value: RESOURCE_TYPES.ARTICLE, label: 'Articles', icon: '📄' },
    { value: RESOURCE_TYPES.VIDEO, label: 'Videos', icon: '🎥' },
    { value: RESOURCE_TYPES.PHOTO, label: 'Photos', icon: '🖼️' },
    { value: RESOURCE_TYPES.NOTE, label: 'Notes', icon: '📝' }
  ]

  return (
    <motion.div 
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <select
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
        className="px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all cursor-pointer"
      >
        {types.map((type) => (
          <option key={type.value} value={type.value} className="bg-gray-800">
            {type.icon} {type.label}
          </option>
        ))}
      </select>
      
      <AnimatePresence>
        {selectedType && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClear}
            className="px-4 py-3 text-sm text-white bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all backdrop-blur-sm"
          >
            Clear
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default FilterBar

