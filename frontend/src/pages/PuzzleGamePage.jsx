import React, { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import ImagePuzzleModal from "../components/PuzzleGame/ImagePuzzleModal"

const PuzzleGamePage = () => {
  const [isPuzzleModalOpen, setIsPuzzleModalOpen] = useState(true)
  const handleBackToTimeline = () => {
    window.location.href = "/#/"
  }

  const handleClosePuzzleModal = () => {
    setIsPuzzleModalOpen(false)
    // Navigate back to timeline after closing puzzle modal
    setTimeout(() => {
      window.location.href = "/#/"
    }, 300)
  }

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

      {/* Image Puzzle Modal */}
      <ImagePuzzleModal
        isOpen={isPuzzleModalOpen}
        onClose={handleClosePuzzleModal}
      />
    </div>
  )
}

export default PuzzleGamePage
