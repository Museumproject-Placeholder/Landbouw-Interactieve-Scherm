import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import TimelineCard from "./TimelineCard"
import { useTimeline } from "../../hooks/useTimeline"

const Timeline = () => {
  // ===== STATE MANAGEMENT =====
  const { timelineData, loading, error } = useTimeline()
  const [selectedPeriod, setSelectedPeriod] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const timelineRef = useRef(null)

  // ===== TIMELINE DATA CONFIGURATION =====
  // IMPORTANT: This static data should eventually be replaced with database content
  // Currently using mock data for development - in production this should come from:
  // - Database API call
  // - CMS system
  // - External data source
  // The structure should remain the same but content will be dynamic
  const extendedTimelineData = timelineData
    ? [
        // Merge existing data from hook with fallback mock data
        ...timelineData,

        // Mock agricultural timeline data - REPLACE WITH DATABASE CONTENT
        ...(timelineData.length < 12
          ? [
              {
                id: "friese-paard", // Unique identifier for database reference
                year: "10,000 BCE", // Display year - format as needed
                title: "Early Agriculture", // Main title for the period
                description:
                  "The development of farming fundamentally changed human civilization. Early humans transitioned from hunting and gathering to cultivating crops and domesticating animals.", // Detailed description - should support rich text in production
                gradient: "from-amber-400 to-orange-500", // CSS gradient classes for theming
                icon: "🌾", // Visual icon - consider using SVG icons in production
              },
              {
                id: "irrigation",
                year: "6,000 BCE",
                title: "Irrigation Systems",
                description:
                  "Advanced civilizations developed sophisticated irrigation networks, allowing agriculture to flourish in arid regions and supporting larger populations.",
                gradient: "from-blue-400 to-cyan-500",
                icon: "🌾",
              },
              {
                id: "plowing",
                year: "4,000 BCE",
                title: "The Plow Revolution",
                description:
                  "The invention of the plow dramatically increased agricultural productivity, enabling farmers to cultivate larger areas more efficiently than ever before.",
                gradient: "from-green-400 to-emerald-500",
                icon: "🌾",
              },
              {
                id: "crop-rotation",
                year: "800 CE",
                title: "Crop Rotation",
                description:
                  "Medieval farmers discovered that rotating different crops in fields improved soil fertility and increased yields, revolutionizing sustainable farming practices.",
                gradient: "from-purple-400 to-violet-500",
                icon: "🌾",
              },
              {
                id: "new-world",
                year: "1500 CE",
                title: "New World Crops",
                description:
                  "The Columbian Exchange introduced revolutionary crops like potatoes, tomatoes, and corn to Europe, transforming diets and agricultural systems worldwide.",
                gradient: "from-red-400 to-pink-500",
                icon: "🌾",
              },
              {
                id: "agricultural-revolution",
                year: "1700 CE",
                title: "Agricultural Revolution",
                description:
                  "New farming techniques, selective breeding, and improved tools sparked an agricultural revolution that supported population growth and urbanization.",
                gradient: "from-indigo-400 to-blue-500",
                icon: "🌾",
              },
              {
                id: "mechanization",
                year: "1850 CE",
                title: "Mechanization Era",
                description:
                  "Steam-powered machinery and later tractors revolutionized farming, allowing farmers to work larger areas with significantly less manual labor.",
                gradient: "from-gray-500 to-slate-600",
                icon: "🌾",
              },
              {
                id: "fertilizers",
                year: "1900 CE",
                title: "Chemical Fertilizers",
                description:
                  "The development of synthetic fertilizers dramatically increased crop yields, enabling agriculture to feed rapidly growing global populations.",
                gradient: "from-lime-400 to-green-500",
                icon: "🌾",
              },
              {
                id: "green-revolution",
                year: "1960 CE",
                title: "Green Revolution",
                description:
                  "High-yield crop varieties, modern irrigation, and intensive farming techniques led to unprecedented increases in food production worldwide.",
                gradient: "from-emerald-400 to-teal-500",
                icon: "🌾",
              },
              {
                id: "precision-agriculture",
                year: "1990 CE",
                title: "Precision Agriculture",
                description:
                  "GPS technology, sensors, and data analytics enabled farmers to optimize inputs and maximize efficiency through precision farming techniques.",
                gradient: "from-cyan-400 to-blue-500",
                icon: "🌾",
              },
              {
                id: "sustainable-farming",
                year: "2000 CE",
                title: "Sustainable Farming",
                description:
                  "Modern agriculture focuses on environmentally sustainable practices, including organic farming, integrated pest management, and climate-smart techniques.",
                gradient: "from-green-500 to-emerald-600",
                icon: "🌾",
              },
              {
                id: "vertical-farming",
                year: "2020 CE",
                title: "Vertical Farming",
                description:
                  "Indoor vertical farms use LED lighting and hydroponic systems to grow crops year-round in urban environments, maximizing space efficiency.",
                gradient: "from-purple-500 to-indigo-600",
                icon: "🌾",
              },
            ].slice(0, Math.max(0, 12 - timelineData.length)) // Limit to 12 total items
          : []),
      ]
    : []

  // ===== DRAG & SCROLL EVENT HANDLERS =====

  /**
   * Initiates drag scrolling when user starts touch/mouse interaction
   * Records starting position and current scroll state
   */
  const handleMouseDown = e => {
    setIsDragging(true)
    setStartX(e.pageX || e.touches[0].pageX)
    setScrollLeft(timelineRef.current.scrollLeft)
  }

  /**
   * Handles drag movement and updates scroll position
   * Prevents default behavior and calculates scroll distance
   */
  const handleMouseMove = e => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX || e.touches[0].pageX
    const walk = (x - startX) * 2 // Multiply for faster scrolling
    timelineRef.current.scrollLeft = scrollLeft - walk
  }

  /**
   * Ends drag scrolling interaction
   */
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  /**
   * Handles timeline card selection
   * Only triggers if not currently dragging to avoid accidental selections
   * @param {string} periodId - Unique identifier for the selected period
   * @param {Event} e - Click event object
   */
  const handleCardClick = (periodId, e) => {
    if (!isDragging) {
      setSelectedPeriod(periodId)
      // TODO: Implement navigation logic here
      // This should redirect to detailed view or open modal
      console.log("Navigate to period:", periodId)
    }
  }

  // ===== LOADING & ERROR STATES =====

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex justify-center items-center">
        {/* Animated dual-ring loading spinner */}
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-blue-500 border-r-purple-500"></div>
          <div className="absolute inset-0 animate-pulse rounded-full h-16 w-16 border-4 border-transparent border-b-cyan-500 border-l-pink-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex justify-center items-center">
        {/* Glassmorphism error message container */}
        <div className="text-center text-red-600 p-8 backdrop-blur-lg bg-white/60 rounded-3xl border border-white/40 shadow-xl">
          <p className="text-xl">Error loading timeline data: {error}</p>
        </div>
      </div>
    )
  }

  // ===== MAIN COMPONENT RENDER =====

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative">
      {/* ===== ANIMATED BACKGROUND ELEMENTS ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top-right floating orb */}
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        {/* Bottom-left floating orb */}
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="timeline-container py-12 px-4 relative">
        {/* ===== HEADER SECTION ===== */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Glassmorphism header container */}
          <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 mx-auto max-w-4xl border border-white/20 shadow-2xl">
            {/* Main title with gradient text */}
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-4">
              Agricultural History Timeline
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-300 leading-relaxed">
              Explore the evolution of farming through interactive periods
            </p>
          </div>
        </motion.div>

        {/* ===== TIMELINE CONTAINER ===== */}
        <div
          ref={timelineRef}
          className="relative pb-8 cursor-grab active:cursor-grabbing overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          style={{
            scrollBehavior: isDragging ? "auto" : "smooth",
            userSelect: "none",
          }}
        >
          {/* Scrollable container with hidden scrollbar */}
          <motion.div
            className="overflow-x-auto scrollbar-hide"
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // Internet Explorer 10+
            }}
          >
            {/* Webkit scrollbar hiding */}
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none; /* Safari and Chrome */
              }
            `}</style>

            {/* Main timeline line - connects all cards horizontally */}
            <div className="absolute top-1/2 transform -translate-y-1/2 h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 w-full min-w-max shadow-lg shadow-blue-400/50"></div>

            {/* ===== TIMELINE ITEMS CONTAINER ===== */}
            <motion.div
              className="flex items-center space-x-32 min-w-max px-16 pt-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Render each timeline period */}
              {extendedTimelineData.map((period, index) => (
                <motion.div
                  key={period.id}
                  className="relative flex-shrink-0 z-10"
                  initial={{ opacity: 0, y: 100, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.2, // Staggered animation
                    ease: "easeOut",
                  }}
                >
                  {/* ===== TIMELINE CARD ===== */}
                  <div
                    className={`${index % 2 === 0 ? "mb-40" : "mt-40"} w-80`}
                  >
                    {/* Card wrapper with hover animations */}
                    <motion.div
                      className="cursor-pointer"
                      onClick={e => handleCardClick(period.id, e)}
                      whileHover={{
                        scale: 1.05,
                        y: -8,
                        rotateY: 5, // 3D tilt effect
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Year display above card */}
                      <div className="text-center mb-6">
                        <motion.div
                          className={`text-5xl font-bold bg-gradient-to-r ${
                            period.gradient || "from-cyan-400 to-blue-400"
                          } bg-clip-text text-transparent filter drop-shadow-lg`}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          {period.year}
                        </motion.div>
                      </div>

                      {/* Main card with glassmorphism effect */}
                      <motion.div
                        className="relative backdrop-blur-xl bg-white/10 p-8 rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
                        animate={{
                          boxShadow:
                            selectedPeriod === period.id
                              ? "0 25px 50px rgba(244, 63, 94, 0.25), 0 0 0 2px rgba(244, 63, 94, 0.5)" // Selected state shadow
                              : "0 15px 35px rgba(0,0,0,0.2)", // Default shadow
                          backgroundColor:
                            selectedPeriod === period.id
                              ? "rgba(244, 63, 94, 0.1)" // Selected state background
                              : "rgba(255, 255, 255, 0.1)", // Default background
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Animated background gradient overlay */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${
                            period.gradient || "from-cyan-400/10 to-blue-400/10"
                          } opacity-20`}
                        />

                        {/* Icon container */}
                        <div className="relative flex justify-center mb-6">
                          <motion.div
                            className="w-20 h-20 flex items-center justify-center text-4xl backdrop-blur-sm bg-white/20 rounded-2xl border border-white/30 shadow-lg"
                            whileHover={{
                              rotate: [0, -10, 10, -10, 0], // Wiggle animation
                              scale: 1.1,
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            {period.icon || "🌾"}{" "}
                            {/* Default to wheat emoji if no icon */}
                          </motion.div>
                        </div>

                        {/* Period title with gradient text */}
                        <div className="text-center mb-4 relative">
                          <h3
                            className={`text-2xl font-bold bg-gradient-to-r ${
                              period.gradient || "from-cyan-300 to-blue-300"
                            } bg-clip-text text-transparent leading-tight`}
                          >
                            {period.title}
                          </h3>
                        </div>

                        {/* Period description */}
                        <div className="text-center relative">
                          <p className="text-gray-200 leading-relaxed">
                            {period.description}
                          </p>
                        </div>

                        {/* Selection indicator - appears when card is selected */}
                        <AnimatePresence>
                          {selectedPeriod === period.id && (
                            <motion.div
                              className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-pink-400 to-red-400 rounded-full flex items-center justify-center shadow-lg shadow-red-400/50"
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 180 }}
                              transition={{ duration: 0.3 }}
                            >
                              <span className="text-white text-sm font-bold">
                                ✓
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ===== BOTTOM INTERACTION INDICATOR ===== */}
        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          {/* Glassmorphism indicator container */}
          <div className="backdrop-blur-sm bg-white/10 px-6 py-3 rounded-full border border-white/20 shadow-xl">
            <div className="flex items-center text-gray-300">
              {/* Animated arrow indicator */}
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-cyan-400 mr-3"
              >
                ← →
              </motion.div>

              {/* Responsive instruction text */}
              <span className="hidden sm:inline text-sm">
                Swipe to explore timeline
              </span>
              <span className="sm:hidden text-sm">Swipe to explore</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Timeline
