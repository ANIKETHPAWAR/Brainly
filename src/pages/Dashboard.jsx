import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getUserResources } from '../services/resourceService'
import ResourceCard from '../components/resources/ResourceCard'
import SearchBar from '../components/resources/SearchBar'
import FilterBar from '../components/resources/FilterBar'
import AddResourceButton from '../components/resources/AddResourceButton'
import AddResourceModal from '../components/resources/AddResourceModal'

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
      <div className="min-h-screen bg-gray-900 pt-20 px-6 flex items-center justify-center">
        <div className="text-white text-xl">Loading your vault...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Vault</h1>
          <p className="text-gray-400">Your personal knowledge hub</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search by title, tags, or notes..."
          />
          <FilterBar
            selectedType={selectedType}
            onTypeChange={handleFilterChange}
            onClear={handleClearFilter}
          />
        </div>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              {searchTerm || selectedType ? 'No resources found' : 'Your vault is empty'}
            </h2>
            <p className="text-gray-400 mb-6">
              {searchTerm || selectedType 
                ? 'Try adjusting your search or filter'
                : 'Start building your knowledge vault by adding your first resource'}
            </p>
            {!searchTerm && !selectedType && (
              <button
                onClick={handleAddClick}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Add Your First Resource
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

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


