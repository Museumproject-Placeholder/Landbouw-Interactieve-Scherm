/**
 * Image Splitter Utility
 *
 * Utility functions for splitting images into puzzle pieces.
 * Uses Canvas API to split a single image into multiple pieces.
 */

/**
 * Splits an image into a grid of pieces
 * @param {string} imageSrc - Source URL/path of the image
 * @param {number} gridSize - Size of the grid (3 for 3x3)
 * @returns {Promise<Array>} Array of image data URLs for each piece
 */
export const splitImageIntoPieces = async (imageSrc, gridSize = 3) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous' // Handle CORS if needed

    img.onload = () => {
      const pieces = []
      const pieceWidth = img.width / gridSize
      const pieceHeight = img.height / gridSize

      // Create canvas for splitting
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      // Set canvas size to piece size
      canvas.width = pieceWidth
      canvas.height = pieceHeight

      // Split image into pieces
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          // Skip the last piece (empty space for sliding puzzle)
          if (row === gridSize - 1 && col === gridSize - 1) {
            pieces.push(null) // Empty space
            continue
          }

          // Clear canvas
          ctx.clearRect(0, 0, pieceWidth, pieceHeight)

          // Draw the piece
          ctx.drawImage(
            img,
            col * pieceWidth, // source x
            row * pieceHeight, // source y
            pieceWidth, // source width
            pieceHeight, // source height
            0, // destination x
            0, // destination y
            pieceWidth, // destination width
            pieceHeight // destination height
          )

          // Convert to data URL and store
          const pieceDataURL = canvas.toDataURL('image/png')
          pieces.push(pieceDataURL)
        }
      }

      resolve(pieces)
    }

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${imageSrc}`))
    }

    // Load the image
    img.src = imageSrc
  })
}

/**
 * Creates a preview of the complete image for reference
 * @param {string} imageSrc - Source URL/path of the image
 * @param {number} maxSize - Maximum size for the preview
 * @returns {Promise<string>} Data URL of the resized preview image
 */
export const createImagePreview = async (imageSrc, maxSize = 200) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      // Calculate preview size maintaining aspect ratio
      let { width, height } = img
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width
          width = maxSize
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height
          height = maxSize
        }
      }

      canvas.width = width
      canvas.height = height

      // Draw resized image
      ctx.drawImage(img, 0, 0, width, height)

      resolve(canvas.toDataURL('image/png'))
    }

    img.onerror = () => {
      reject(new Error(`Failed to load image for preview: ${imageSrc}`))
    }

    img.src = imageSrc
  })
}