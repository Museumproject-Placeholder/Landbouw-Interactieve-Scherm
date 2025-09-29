import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import logomuseum from "../../assets/images/logomuseum.png"

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatDate = (date) => {
    const days = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag']
    const dayName = days[date.getDay()]
    const dayNumber = date.getDate()
    return `${dayName} ${dayNumber}`
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  return (
    <motion.header
      className="backdrop-blur-xl bg-white/10 border-b border-white/20 fixed top-0 left-0 right-0 z-50 shadow-2xl"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="w-full px-2">
        <div className="flex items-center justify-between h-32">
          <motion.div
            className="flex items-center"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center space-x-8">
              <motion.div
                className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-3xl flex items-center justify-center shadow-lg shadow-cyan-400/30"
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  boxShadow: "0 0 30px rgba(34, 211, 238, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <img src={logomuseum} alt="Museum Logo" className="w-20 h-20 object-contain" />
              </motion.div>
              <div>
                <motion.h1
                  className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300"
                  whileHover={{ scale: 1.02 }}
                >
                  Museum Interactieve
                </motion.h1>
                <motion.p
                  className="text-lg text-gray-300 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Touch Screen Experience
                </motion.p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center space-x-6"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Date Tile */}
            <motion.div
              className="backdrop-blur-xl bg-white/15 px-10 py-5 rounded-2xl border border-white/30 shadow-xl"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <div className="text-white font-bold text-3xl whitespace-nowrap">
                {formatDate(currentTime)}
              </div>
            </motion.div>

            {/* Time Tile */}
            <motion.div
              className="backdrop-blur-xl bg-white/15 px-10 py-5 rounded-2xl border border-white/30 shadow-xl"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <div className="text-white font-bold text-3xl whitespace-nowrap">
                {formatTime(currentTime)}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
