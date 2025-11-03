import React from 'react'
import { RESOURCE_TYPES } from '../../services/resourceService'

const FilterBar = ({ selectedType, onTypeChange, onClear }) => {
  const types = [
    { value: '', label: 'All Types' },
    { value: RESOURCE_TYPES.ARTICLE, label: 'Articles' },
    { value: RESOURCE_TYPES.VIDEO, label: 'Videos' },
    { value: RESOURCE_TYPES.PHOTO, label: 'Photos' },
    { value: RESOURCE_TYPES.NOTE, label: 'Notes' }
  ]

  return (
    <div className="flex items-center gap-4">
      <select
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
        className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {types.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
      
      {selectedType && (
        <button
          onClick={onClear}
          className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          Clear Filter
        </button>
      )}
    </div>
  )
}

export default FilterBar

