import React from "react"
import { motion } from "framer-motion"
import studentenwerkLogo from "../../assets/images/Studentenwerk---Blauw.png"

/**
 * Studentenwerk Logo Component
 *
 * Displays the Studentenwerk logo in the bottom-left corner
 */
const StudentenwerkLogo = () => {
  return (
    <motion.div
      className="fixed bottom-6 left-6 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
    >
      <img
        src={studentenwerkLogo}
        alt="Studentenwerk"
        className="h-16 sm:h-20 w-auto drop-shadow-lg"
      />
    </motion.div>
  )
}

export default StudentenwerkLogo
