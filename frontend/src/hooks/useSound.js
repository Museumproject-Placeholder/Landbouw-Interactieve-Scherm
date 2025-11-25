import { useRef, useEffect } from "react"

// Import sound file
import buttonClickSound from "../assets/sounds/button-click-289742.mp3"

/**
 * Hook to play sound effects on user interactions
 * @param {boolean} enabled - Whether sound is enabled (default: true)
 * @returns {Function} playSound - Function to play the sound
 */
export const useSound = (enabled = true) => {
  const audioRef = useRef(null)

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== "undefined" && enabled) {
      audioRef.current = new Audio(buttonClickSound)
      audioRef.current.volume = 0.3 // Set volume to 30% to avoid being too loud
      audioRef.current.preload = "auto"
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [enabled])

  /**
   * Play the sound effect
   */
  const playSound = () => {
    if (audioRef.current && enabled) {
      // Reset to start and play
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(error => {
        // Ignore errors (e.g., user hasn't interacted with page yet)
        console.debug("Sound playback prevented:", error)
      })
    }
  }

  return playSound
}











