import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ScrollIndicator = ({ scrollContainerRef }) => {
  const [showIndicator, setShowIndicator] = useState(false)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const checkScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isScrollable = scrollHeight > clientHeight
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50

      // Show indicator if scrollable and not at bottom
      setShowIndicator(isScrollable && !isAtBottom)
    }

    // Initial check
    checkScroll()

    // Check on scroll
    container.addEventListener('scroll', checkScroll)

    // Check on resize
    window.addEventListener('resize', checkScroll)

    return () => {
      container.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [scrollContainerRef])

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          className="sticky bottom-0 left-0 right-0 pointer-events-none z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Gradient Overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.7) 50%, transparent 100%)'
            }}
          />

          {/* Scroll Text and Arrow */}
          <div className="relative flex flex-col items-center justify-center pb-6 pt-16">
            <motion.div
              className="text-orange-400 text-sm font-medium mb-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              Scroll voor meer informatie
            </motion.div>

            <motion.div
              className="text-orange-400 text-2xl"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              ↓
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ScrollIndicator
