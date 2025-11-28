import { useEffect, useRef } from "react"

/**
 * Hook to handle idle timeout
 * Resets timer on user interactions (click, touch, scroll, mousemove, keypress)
 * 
 * @param {number} timeout - Timeout in milliseconds (e.g., 300000 for 5 minutes)
 * @param {Function} onIdle - Callback function to call when idle timeout is reached
 * @param {boolean} enabled - Whether the timer is enabled (default: true)
 */
export const useIdleTimer = (timeout, onIdle, enabled = true) => {
  const timeoutRef = useRef(null)
  const savedCallback = useRef(onIdle)

  // Update callback ref when it changes
  useEffect(() => {
    savedCallback.current = onIdle
  }, [onIdle])

  // Reset the timer
  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (enabled) {
      timeoutRef.current = setTimeout(() => {
        if (savedCallback.current) {
          savedCallback.current()
        }
      }, timeout)
    }
  }

  // Set up event listeners and initial timer
  useEffect(() => {
    if (!enabled) {
      // Clear timer if disabled
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      return
    }

    // Reset timer on user interactions
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ]

    // Set initial timer
    resetTimer()

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, resetTimer, true)
    })

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      events.forEach(event => {
        window.removeEventListener(event, resetTimer, true)
      })
    }
  }, [timeout, enabled])
}

