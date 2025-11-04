// Firebase service layer for resource CRUD operations
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../firebase/config'
import { fetchUrlMetadata } from '../utils/urlPreview'

/**
 * Resource types
 */
export const RESOURCE_TYPES = {
  ARTICLE: 'article',
  VIDEO: 'video',
  PHOTO: 'photo',
  NOTE: 'note'
}

/**
 * Create a new resource
 * @param {Object} resourceData - Resource data
 * @param {string} userId - User ID
 * @param {File} file - Optional file to upload
 * @returns {Promise<string>} Document ID
 */
export const createResource = async (resourceData, userId, file = null) => {
  try {
    let mediaUrl = null
    let urlPreview = null

    // Upload file if provided
    if (file) {
      const fileRef = ref(storage, `resources/${userId}/${Date.now()}_${file.name}`)
      await uploadBytes(fileRef, file)
      mediaUrl = await getDownloadURL(fileRef)
    }

    // Fetch URL preview metadata if URL is provided
    if (resourceData.url && !file) {
      try {
        urlPreview = await fetchUrlMetadata(resourceData.url)
      } catch (error) {
        console.warn('Failed to fetch URL preview:', error)
      }
    }

    // Prepare resource data
    const resource = {
      title: resourceData.title,
      url: resourceData.url || null,
      type: resourceData.type,
      tags: resourceData.tags || [],
      notes: resourceData.notes || '',
      mediaUrl,
      urlPreview, // Store preview metadata
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      reminderDate: resourceData.reminderDate || null
    }

    // Add to Firestore
    const docRef = await addDoc(collection(db, 'resources'), resource)
    return docRef.id
  } catch (error) {
    console.error('Error creating resource:', error)
    throw error
  }
}

/**
 * Get all resources for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of resources
 */
export const getUserResources = async (userId) => {
  try {
    // First get all resources for the user (without orderBy to avoid index requirement)
    const q = query(
      collection(db, 'resources'),
      where('userId', '==', userId)
    )
    const querySnapshot = await getDocs(q)
    
    // Sort in memory instead of using Firestore orderBy
    const resources = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    // Sort by createdAt descending in memory
    return resources.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0
      const bTime = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0
      return bTime - aTime
    })
  } catch (error) {
    console.error('Error fetching resources:', error)
    throw error
  }
}

/**
 * Get a single resource by ID
 * @param {string} resourceId - Resource ID
 * @returns {Promise<Object>} Resource data
 */
export const getResource = async (resourceId) => {
  try {
    const docRef = doc(db, 'resources', resourceId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching resource:', error)
    throw error
  }
}

/**
 * Update a resource
 * @param {string} resourceId - Resource ID
 * @param {Object} updates - Fields to update
 * @param {File} file - Optional new file to upload
 * @returns {Promise<void>}
 */
export const updateResource = async (resourceId, updates, file = null) => {
  try {
    const resourceRef = doc(db, 'resources', resourceId)
    const resourceSnap = await getDoc(resourceRef)
    
    if (!resourceSnap.exists()) {
      throw new Error('Resource not found')
    }

    const currentData = resourceSnap.data()
    let mediaUrl = currentData.mediaUrl
    let urlPreview = currentData.urlPreview

    // Upload new file if provided
    if (file) {
      // Delete old file if exists
      if (currentData.mediaUrl) {
        try {
          const oldFileRef = ref(storage, currentData.mediaUrl)
          await deleteObject(oldFileRef)
        } catch (error) {
          console.warn('Error deleting old file:', error)
        }
      }

      // Upload new file
      const fileRef = ref(storage, `resources/${currentData.userId}/${Date.now()}_${file.name}`)
      await uploadBytes(fileRef, file)
      mediaUrl = await getDownloadURL(fileRef)
      urlPreview = null // Clear preview if file is uploaded
    } else if (updates.url && updates.url !== currentData.url) {
      // Fetch new URL preview if URL changed and no file uploaded
      try {
        urlPreview = await fetchUrlMetadata(updates.url)
      } catch (error) {
        console.warn('Failed to fetch URL preview:', error)
      }
    }

    // Prepare update data
    const updateData = {
      ...updates,
      mediaUrl,
      urlPreview,
      updatedAt: Timestamp.now()
    }

    await updateDoc(resourceRef, updateData)
  } catch (error) {
    console.error('Error updating resource:', error)
    throw error
  }
}

/**
 * Delete a resource
 * @param {string} resourceId - Resource ID
 * @returns {Promise<void>}
 */
export const deleteResource = async (resourceId) => {
  try {
    const resourceRef = doc(db, 'resources', resourceId)
    const resourceSnap = await getDoc(resourceRef)
    
    if (!resourceSnap.exists()) {
      throw new Error('Resource not found')
    }

    const resourceData = resourceSnap.data()

    // Delete associated file if exists
    if (resourceData.mediaUrl) {
      try {
        const fileRef = ref(storage, resourceData.mediaUrl)
        await deleteObject(fileRef)
      } catch (error) {
        console.warn('Error deleting file:', error)
      }
    }

    // Delete document
    await deleteDoc(resourceRef)
  } catch (error) {
    console.error('Error deleting resource:', error)
    throw error
  }
}

/**
 * Search resources by title or tags
 * @param {string} userId - User ID
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Filtered resources
 */
export const searchResources = async (userId, searchTerm) => {
  try {
    const resources = await getUserResources(userId)
    const lowerSearchTerm = searchTerm.toLowerCase()
    
    return resources.filter(resource => {
      const titleMatch = resource.title?.toLowerCase().includes(lowerSearchTerm)
      const tagMatch = resource.tags?.some(tag => 
        tag.toLowerCase().includes(lowerSearchTerm)
      )
      const notesMatch = resource.notes?.toLowerCase().includes(lowerSearchTerm)
      
      return titleMatch || tagMatch || notesMatch
    })
  } catch (error) {
    console.error('Error searching resources:', error)
    throw error
  }
}

/**
 * Filter resources by type
 * @param {string} userId - User ID
 * @param {string} type - Resource type
 * @returns {Promise<Array>} Filtered resources
 */
export const filterResourcesByType = async (userId, type) => {
  try {
    // Get all resources for user and type (without orderBy to avoid index requirement)
    const q = query(
      collection(db, 'resources'),
      where('userId', '==', userId),
      where('type', '==', type)
    )
    const querySnapshot = await getDocs(q)
    
    const resources = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    // Sort by createdAt descending in memory
    return resources.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0
      const bTime = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0
      return bTime - aTime
    })
  } catch (error) {
    console.error('Error filtering resources:', error)
    throw error
  }
}

