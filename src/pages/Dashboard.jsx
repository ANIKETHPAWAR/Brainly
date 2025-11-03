import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { getUserResources } from '../services/resourceService'
import ResourceCard from '../components/resources/ResourceCard'
import SearchBar from '../components/resources/SearchBar'
import FilterBar from '../components/resources/FilterBar'
import AddResourceButton from '../components/resources/AddResourceButton'
import AddResourceModal from '../components/resources/AddResourceModal'
import img1 from '../assets/mesh-757.png'

const Dashboard = () => {
  const { currentUser } = useAuth()
  const [resources, setResources] = useState([])
  const [filteredResources, setFilteredResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingResource, setEditingResource] = useState(null)

  // Fetch resources
  useEffect(() => {
    if (currentUser) {
      fetchResources()
    }
  }, [currentUser])

  const fetchResources = async () => {
    try {
      setLoading(true)
      const data = await getUserResources(currentUser.uid)
      setResources(data)
      setFilteredResources(data)
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle search
  useEffect(() => {
    if (!searchTerm && !selectedType) {
      setFilteredResources(resources)
      return
    }

    const performSearch = async () => {
      try {
        let results = resources

        // Filter by type first
        if (selectedType) {
          results = resources.filter(r => r.type === selectedType)
        }

        // Then search within filtered results
        if (searchTerm) {
          const lowerSearchTerm = searchTerm.toLowerCase()
          results = results.filter(resource => {
            const titleMatch = resource.title?.toLowerCase().includes(lowerSearchTerm)
            const tagMatch = resource.tags?.some(tag => 
              tag.toLowerCase().includes(lowerSearchTerm)
            )
            const notesMatch = resource.notes?.toLowerCase().includes(lowerSearchTerm)
            return titleMatch || tagMatch || notesMatch
          })
        }

        setFilteredResources(results)
      } catch (error) {
        console.error('Error searching resources:', error)
      }
    }

    performSearch()
  }, [searchTerm, selectedType, resources])

  const handleAddClick = () => {
    setEditingResource(null)
    setIsAddModalOpen(true)
  }

  const handleEdit = (resource) => {
    setEditingResource(resource)
    setIsAddModalOpen(true)
  }

  const handleDelete = async (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        const { deleteResource } = await import('../services/resourceService')
        await deleteResource(resourceId)
        await fetchResources()
      } catch (error) {
        console.error('Error deleting resource:', error)
        alert('Failed to delete resource. Please try again.')
      }
    }
  }

  const handleModalClose = () => {
    setIsAddModalOpen(false)
    setEditingResource(null)
    fetchResources()
  }

  const handleFilterChange = (type) => {
    setSelectedType(type)
  }

  const handleClearFilter = () => {
    setSelectedType('')
  }

  if (loading) {
    return (
      <div 
        className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: `url(${img1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-white text-xl"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
            />
            <span>Loading your vault...</span>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen pt-20 px-6 pb-20 relative overflow-hidden"
      style={{
        backgroundImage: `url(${img1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with animation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 italic">
            My Vault
          </h1>
          <p className="text-gray-200 text-lg">Your personal knowledge hub</p>
          {filteredResources.length > 0 && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-300 text-sm mt-2"
            >
              {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'} saved
            </motion.p>
          )}
        </motion.div>

        {/* Search and Filter with animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
        >
          <div className="flex-1 w-full sm:max-w-md">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Search by title, tags, or notes..."
            />
          </div>
          <FilterBar
            selectedType={selectedType}
            onTypeChange={handleFilterChange}
            onClear={handleClearFilter}
          />
        </motion.div>

        {/* Resources Grid with stagger animation */}
        <AnimatePresence mode="wait">
          {filteredResources.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="text-8xl mb-6"
              >
                📚
              </motion.div>
              <h2 className="text-3xl font-semibold text-white mb-3">
                {searchTerm || selectedType ? 'No resources found' : 'Your vault is empty'}
              </h2>
              <p className="text-gray-300 mb-8 max-w-md mx-auto">
                {searchTerm || selectedType 
                  ? 'Try adjusting your search or filter'
                  : 'Start building your knowledge vault by adding your first resource'}
              </p>
              {!searchTerm && !selectedType && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddClick}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  Add Your First Resource
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{ y: -5 }}
                >
                  <ResourceCard
                    resource={resource}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Resource Button */}
        <AddResourceButton onClick={handleAddClick} />

        {/* Add/Edit Resource Modal */}
        {isAddModalOpen && (
          <AddResourceModal
            isOpen={isAddModalOpen}
            onClose={handleModalClose}
            resource={editingResource}
            userId={currentUser.uid}
          />
        )}
      </div>
    </div>
  )
}

export default Dashboard


