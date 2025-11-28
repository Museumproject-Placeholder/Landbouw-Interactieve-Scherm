import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getTheme } from "../../../config/themes"

/**
 * VirtualGuide - A friendly mascot/avatar that guides users through the timeline
 *
 * Features:
 * - Animated avatar with speech bubble
 * - Auto-rotates through messages every 5 seconds
 * - Hides automatically after showing all messages
 * - Click to restart the message cycle
 * - Responsive design for touchscreens and mobiles
 * - Styled with Tailwind CSS
 */
const VirtualGuide = ({
  messages = [
    "Tik op een tijdperk om meer te weten te komen!",
    "Veeg naar links of rechts om door de geschiedenis te bladeren!",
    "Klik op mij voor tips!"
  ],
  position = "top-right", // Options: "top-left", "top-right", "bottom-left", "bottom-right"
  autoHideDelay = 10000 // Auto-hide after 10 seconds (10000ms)
}) => {
  const theme = getTheme()
  const [isExpanded, setIsExpanded] = useState(true)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [isWaving, setIsWaving] = useState(true)
  const [hasFinishedCycle, setHasFinishedCycle] = useState(false)

  // Auto-rotate through messages every 5 seconds, then hide after all messages shown
  useEffect(() => {
    if (!isExpanded || hasFinishedCycle) return

    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => {
        const nextIndex = prev + 1

        // If we've shown all messages, hide the guide
        if (nextIndex >= messages.length) {
          setHasFinishedCycle(true)
          setTimeout(() => setIsExpanded(false), 5000) // Show last message for 5 seconds
          return prev
        }

        return nextIndex
      })
    }, 5000) // Change message every 5 seconds

    return () => clearInterval(messageInterval)
  }, [isExpanded, messages.length, hasFinishedCycle])

  // Position classes based on prop
  const positionClasses = {
    "top-left": "top-4 left-4 sm:top-6 sm:left-6",
    "top-right": "top-4 right-4 sm:top-6 sm:right-6",
    "bottom-left": "bottom-4 left-4 sm:bottom-6 sm:left-6",
    "bottom-right": "bottom-4 right-4 sm:bottom-6 sm:right-6"
  }

  const handleAvatarClick = () => {
    setIsWaving(true)

    if (isExpanded) {
      // If expanded, hide it
      setIsExpanded(false)
    } else {
      // If hidden, restart the cycle from the beginning
      setIsExpanded(true)
      setCurrentMessageIndex(0)
      setHasFinishedCycle(false)
    }

    // Stop waving after animation
    setTimeout(() => setIsWaving(false), 600)
  }

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 flex items-start gap-3 max-w-[90vw] sm:max-w-md`}
    >
      {/* Speech Bubble - appears on left of avatar for right positions, right for left positions */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: position.includes("right") ? 20 : -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: position.includes("right") ? 20 : -20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.3
            }}
            className={`relative backdrop-blur-lg ${theme.guide.bubbleBg} p-4 sm:p-5 rounded-2xl border-2 ${theme.guide.bubbleBorder} shadow-2xl ${
              position.includes("right") ? "order-1" : "order-2"
            }`}
          >
            {/* Bubble tail */}
            <div
              className={`absolute top-6 w-0 h-0
                border-t-[12px] border-t-transparent
                border-b-[12px] border-b-transparent
                ${position.includes("right")
                  ? "right-[-10px] border-l-[12px] border-l-white/95"
                  : "left-[-10px] border-r-[12px] border-r-white/95"
                }`}
            />

            {/* Message text */}
            <motion.p
              key={currentMessageIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-sm sm:text-base font-semibold ${theme.guide.bubbleText} leading-relaxed`}
            >
              {messages[currentMessageIndex]}
            </motion.p>

            {/* Message indicator dots */}
            {messages.length > 1 && (
              <div className="flex gap-1.5 mt-3 justify-center">
                {messages.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentMessageIndex
                        ? "bg-cyan-500 w-6"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Sparkle effects */}
            <motion.div
              className="absolute -top-2 -right-2 text-yellow-400 text-xl"
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ✨
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar Button */}
      <motion.button
        onClick={handleAvatarClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`relative flex-shrink-0 ${position.includes("right") ? "order-2" : "order-1"}`}
        aria-label="Virtual guide mascot"
      >
        {/* Avatar container with glow effect */}
        <motion.div
          className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${theme.guide.avatarGradient} p-1 shadow-2xl`}
          animate={{
            boxShadow: [
              "0 0 20px rgba(6, 182, 212, 0.5)",
              "0 0 30px rgba(59, 130, 246, 0.7)",
              "0 0 20px rgba(6, 182, 212, 0.5)",
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Inner white circle */}
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
            {/* Avatar emoji/character */}
            <motion.div
              className="text-3xl sm:text-4xl"
              animate={isWaving ? {
                rotate: [0, 15, -15, 15, 0],
              } : {}}
              transition={{
                duration: 0.6,
                ease: "easeInOut"
              }}
            >
              👋
            </motion.div>
          </div>

          {/* Pulse ring effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-cyan-400"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{
              scale: [1, 1.3, 1.5],
              opacity: [0.5, 0.2, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        </motion.div>

        {/* Attention indicator (small badge) */}
        {!isExpanded && (
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            {messages.length}
          </motion.div>
        )}
      </motion.button>

      {/* Floating sparkles around avatar */}
      <motion.div
        className="absolute -z-10 inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-400 text-sm"
            style={{
              left: `${30 + i * 20}%`,
              top: `${20 + i * 25}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              delay: i * 0.4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ⭐
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default VirtualGuide
