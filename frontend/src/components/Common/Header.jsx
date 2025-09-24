import React from "react"
import { motion } from "framer-motion"
import logomuseum from "../../assets/images/logomuseum.png"

const Header = () => {
  return (
    <motion.header
      className="backdrop-blur-xl bg-white/10 border-b border-white/20 fixed top-0 left-0 right-0 z-50 shadow-2xl"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-8">
        <div className="flex items-center justify-between h-24">
          <motion.div
            className="flex items-center"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center space-x-5">
              <motion.div
                className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-3xl flex items-center justify-center shadow-lg shadow-cyan-400/30"
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  boxShadow: "0 0 30px rgba(34, 211, 238, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <img src={logomuseum} alt="Museum Logo" className="w-12 h-12 object-contain" />
              </motion.div>
              <div>
                <motion.h1
                  className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300"
                  whileHover={{ scale: 1.02 }}
                >
                  Museum Interactieve
                </motion.h1>
                <motion.p
                  className="text-sm text-gray-300 font-medium"
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
            <div className="backdrop-blur-sm bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
              <div className="text-base text-gray-300 font-semibold">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>

            <motion.div
              className="flex items-center space-x-3 backdrop-blur-sm bg-white/5 px-4 py-3 rounded-2xl border border-white/10"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full shadow-lg shadow-emerald-400/50"></div>
              <span className="text-sm text-gray-300 font-semibold">LIVE</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
