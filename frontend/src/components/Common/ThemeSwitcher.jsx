import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Palette } from "lucide-react"
import { getCurrentThemeName, toggleTheme } from "../../config/themes"

/**
 * Theme Switcher Component
 *
 * Simple icon button at top to toggle between themes
 */
const ThemeSwitcher = () => {
  const [currentTheme, setCurrentTheme] = useState(getCurrentThemeName())

  useEffect(() => {
    setCurrentTheme(getCurrentThemeName())
  }, [])

  const handleToggle = () => {
    toggleTheme()
  }

  return (
    <motion.button
      onClick={handleToggle}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-black/60 hover:bg-black/75 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl transition-all"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      title={`Current: ${currentTheme === 'modern' ? 'Modern' : 'Museum'}`}
    >
      <Palette size={24} className="text-white" />
    </motion.button>
  )
}

export default ThemeSwitcher
