import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import MemoryGame from "../components/PuzzleGame/MemoryGame"
import { useLocation } from "react-router-dom"

const MemoryGamePage = () => {
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(true)
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const eventId = searchParams.get("eventId")

  const handleBackToTimeline = () => {
    window.location.href = "/#/"
  }

  const handleCloseMemoryModal = () => {
    setIsMemoryModalOpen(false)
    // Navigate back to timeline after closing memory modal
    setTimeout(() => {
      window.location.href = "/#/"
    }, 300)
  }

  // Fetch images from event if eventId is provided
  const [gameImages, setGameImages] = useState(null)

  useEffect(() => {
    if (eventId) {
      // You can fetch event images here if needed
      // For now, we'll use default images
      setGameImages(null)
    }
  }, [eventId])

  return (
    <div
      className="relative min-h-screen"
      style={{
        overscrollBehavior: "none",
        overscrollBehaviorY: "none",
        overscrollBehaviorX: "none",
        touchAction: "pan-x pan-y",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* Back Button */}
      <motion.button
        className="fixed top-6 left-6 z-50 flex items-center space-x-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-xl border border-white/20 shadow-lg"
        onClick={handleBackToTimeline}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ArrowLeft size={18} />
        <span className="font-medium">Terug naar Timeline</span>
      </motion.button>

      {/* Memory Game Modal */}
      <MemoryGame
        isOpen={isMemoryModalOpen}
        onClose={handleCloseMemoryModal}
        images={gameImages}
      />
    </div>
  )
}

export default MemoryGamePage

