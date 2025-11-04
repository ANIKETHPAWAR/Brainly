/**
 * URL Preview Utility
 * Fetches metadata for URLs (articles, YouTube videos, reels, etc.)
 */

/**
 * Extract YouTube video ID from URL
 */
const getYouTubeVideoId = (url) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[7].length === 11) ? match[7] : null
}

/**
 * Check if URL is a YouTube video
 */
const isYouTubeUrl = (url) => {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/.test(url)
}

/**
 * Check if URL is a YouTube Short
 */
const isYouTubeShort = (url) => {
  return /\/shorts\//.test(url)
}

/**
 * Check if URL is an Instagram Reel
 */
const isInstagramReel = (url) => {
  return /instagram\.com\/reel\//.test(url)
}

/**
 * Check if URL is a TikTok video
 */
const isTikTokUrl = (url) => {
  return /tiktok\.com/.test(url)
}

/**
 * Get YouTube thumbnail URL
 */
const getYouTubeThumbnail = (videoId, quality = 'maxresdefault') => {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`
}

/**
 * Get YouTube embed URL
 */
const getYouTubeEmbedUrl = (videoId) => {
  return `https://www.youtube.com/embed/${videoId}`
}

/**
 * Fetch Open Graph metadata from URL
 * Uses a CORS proxy to fetch metadata
 */
export const fetchUrlMetadata = async (url) => {
  try {
    // Check if it's a YouTube video
    if (isYouTubeUrl(url)) {
      const videoId = getYouTubeVideoId(url)
      if (videoId) {
        return {
          type: isYouTubeShort(url) ? 'youtube-short' : 'youtube',
          title: 'YouTube Video',
          description: 'Watch on YouTube',
          image: getYouTubeThumbnail(videoId),
          videoId,
          embedUrl: getYouTubeEmbedUrl(videoId),
          url
        }
      }
    }

    // Check if it's Instagram Reel
    if (isInstagramReel(url)) {
      return {
        type: 'instagram-reel',
        title: 'Instagram Reel',
        description: 'View on Instagram',
        image: null, // Instagram doesn't provide direct image access
        url
      }
    }

    // Check if it's TikTok
    if (isTikTokUrl(url)) {
      return {
        type: 'tiktok',
        title: 'TikTok Video',
        description: 'Watch on TikTok',
        image: null,
        url
      }
    }

    // For regular articles, try to fetch Open Graph metadata
    // Note: CORS restrictions may prevent direct fetching
    // In production, you should use a backend service for this
    try {
      // Try multiple CORS proxies for better reliability
      const proxies = [
        `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        `https://cors-anywhere.herokuapp.com/${url}`
      ]
      
      for (const proxyUrl of proxies) {
        try {
          const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
          })
          
          if (!response.ok) continue
          
          const data = await response.json()
          const html = data.contents || data
          
          if (html) {
            const parser = new DOMParser()
            const doc = parser.parseFromString(html, 'text/html')
            
            const getMetaProperty = (property) => {
              const meta = doc.querySelector(`meta[property="${property}"]`) || 
                          doc.querySelector(`meta[name="${property}"]`) ||
                          doc.querySelector(`meta[itemprop="${property}"]`)
              return meta ? meta.getAttribute('content') : null
            }

            const title = getMetaProperty('og:title') || 
                         getMetaProperty('twitter:title') ||
                         doc.querySelector('title')?.textContent || 
                         'Article'
            
            const description = getMetaProperty('og:description') || 
                               getMetaProperty('twitter:description') ||
                               getMetaProperty('description') || 
                               'Read more'
            
            let image = getMetaProperty('og:image') || 
                       getMetaProperty('twitter:image') ||
                       null

            // Handle relative image URLs
            if (image && !image.startsWith('http')) {
              try {
                const urlObj = new URL(url)
                image = new URL(image, urlObj.origin).href
              } catch (e) {
                image = null
              }
            }

            return {
              type: 'article',
              title,
              description,
              image,
              url
            }
          }
        } catch (proxyError) {
          console.warn('Proxy failed, trying next:', proxyError)
          continue
        }
      }
    } catch (error) {
      console.warn('Failed to fetch metadata:', error)
    }

    // Fallback for regular URLs
    return {
      type: 'link',
      title: 'Link',
      description: 'Visit link',
      image: null,
      url
    }
  } catch (error) {
    console.error('Error fetching URL metadata:', error)
    return {
      type: 'link',
      title: 'Link',
      description: 'Visit link',
      image: null,
      url
    }
  }
}

/**
 * Get preview data for a resource
 */
export const getResourcePreview = async (resource) => {
  if (!resource.url) return null

  try {
    const metadata = await fetchUrlMetadata(resource.url)
    return {
      ...metadata,
      // Use resource title if available, otherwise use metadata title
      title: resource.title || metadata.title,
      description: resource.notes || metadata.description
    }
  } catch (error) {
    console.error('Error getting resource preview:', error)
    return null
  }
}

