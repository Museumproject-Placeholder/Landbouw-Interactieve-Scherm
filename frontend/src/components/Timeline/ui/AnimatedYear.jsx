import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import CountUp from "react-countup"

/**
 * AnimatedYear Component
 *
 * Animates year display from 0 to target value on mount.
 * Displays single year only (e.g., "1925").
 */
const AnimatedYear = ({ year, theme, gradient }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation when component mounts with small delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Parse year string to extract single year (handles legacy ranges by taking first year)
  const parseYear = yearString => {
    if (!yearString) return 0

    // Extract first 4-digit year from string (handles both "1925" and "1930-1956" formats)
    const match = yearString.match(/(\d{4})/)
    return match ? parseInt(match[1], 10) : 0
  }

  const yearNumber = parseYear(year)

  return (
    <motion.div
      className="text-5xl font-bold filter drop-shadow-lg"
      style={{
        color: "#c9a300",
      }}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.1 }}
    >
      {isVisible ? (
        <CountUp
          start={0}
          end={yearNumber}
          duration={2}
          separator=""
          easingFn={(t, b, c, d) => {
            // Custom ease-out function
            t /= d
            return -c * t * (t - 2) + b
          }}
        />
      ) : (
        "0"
      )}
    </motion.div>
  )
}

export default AnimatedYear
