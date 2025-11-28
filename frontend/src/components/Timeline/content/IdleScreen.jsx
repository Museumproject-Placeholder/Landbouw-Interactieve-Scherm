import React, { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import idleScreenVideo from "../../../assets/video/idle_screen.mp4"

/**
 * IdleScreen Component
 * 
 * Displays a screensaver mode with:
 * - Fullscreen video background (idle_screen.mp4)
 * - Centered glassmorphism box with call-to-action
 * - Pulsing animation
 */
const IdleScreen = ({ onActivate }) => {
  const videoRef = useRef(null)

  // Handle video loop
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.addEventListener("ended", () => {
        video.currentTime = 0
        video.play()
      })
      // Start playing when component mounts
      video.play().catch(err => {
        console.error("Error playing video:", err)
      })
    }
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, pointerEvents: "none" }}
      transition={{ duration: 1 }}
      onClick={onActivate}
      onTouchStart={onActivate}
      style={{ 
        pointerEvents: "auto",
        overscrollBehavior: 'none',
        overscrollBehaviorY: 'none',
        overscrollBehaviorX: 'none',
        touchAction: 'pan-x pan-y',
      }}
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={idleScreenVideo} type="video/mp4" />
      </video>
      {/* Glassmorphism Box */}
      <motion.div
        className="max-w-2xl w-full mx-4 p-12 bg-white/10 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: 1, 
          scale: [1, 1.05, 1]
        }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{
          opacity: { duration: 1 },
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        {/* Main Text - Glass effect on letters */}
        <motion.h1
          className="text-7xl md:text-8xl font-bold mb-6 font-heading bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 2px 4px rgba(255, 255, 255, 0.3))",
          }}
        >
          Begin je reis
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-3xl md:text-4xl font-medium font-body text-white/80"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Ontdek 100 jaar geschiedenis
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

export default IdleScreen

