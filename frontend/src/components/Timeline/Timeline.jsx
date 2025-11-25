import React, { useState, useRef, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Puzzle } from "lucide-react"
import TimelineDetailModal from "./modals/TimelineDetailModal"
import MuseumHeadline from "./content/MuseumHeadline"
import VirtualGuide from "./content/VirtualGuide"
import StudentenwerkLogo from "../Common/StudentenwerkLogo"
import IdleScreen from "./content/IdleScreen"
import AnimatedAnimals from "./content/AnimatedAnimals"
import { getTheme } from "../../config/themes"
import { useTimeline } from "../../hooks/useTimeline"
import { useSound } from "../../hooks/useSound"
import { useIdleTimer } from "../../hooks/useIdleTimer"
import LoadingSkeleton from "./ui/LoadingSkeleton"
import AnimatedYear from "./ui/AnimatedYear"
import {
  generateYearMarkers,
  groupEventsByMarkers,
  calculateEventPosition,
  extractYear as extractYearUtil,
} from "../../utils/timelineCalculations"

import backgroundTimelineVideo from "../../assets/video/5197931-uhd_3840_2160_30fps.mp4"

// Helper function to get border color based on category
const getCategoryBorderColor = category => {
  // Normalize category to lowercase for consistent matching
  const normalizedCategory = category?.toLowerCase() || "museum"
  const categoryColors = {
    museum: "#a35514",
    landbouw: "#22c55e", // green-500
    maatschappelijk: "#c9a300", // yellow
  }
  return categoryColors[normalizedCategory] || categoryColors.museum // Default to museum color
}

// Hardcoded gradient map for each event year (single years only)
const GRADIENT_MAP = {
  1925: {
    gradient: "from-amber-600 to-orange-500",
    museumGradient: "from-brand-rust to-brand-terracotta",
  },
  1930: {
    gradient: "from-blue-600 to-cyan-500",
    museumGradient: "from-brand-sky to-brand-mist",
  },
  1945: {
    gradient: "from-slate-600 to-gray-500",
    museumGradient: "from-brand-slate to-brand-maroon",
  },
  1987: {
    gradient: "from-green-600 to-emerald-500",
    museumGradient: "from-brand-olive to-brand-mist",
  },
  2006: {
    gradient: "from-indigo-600 to-purple-500",
    museumGradient: "from-brand-amber to-brand-terracotta",
  },
  2018: {
    gradient: "from-rose-600 to-pink-500",
    museumGradient: "from-brand-rust to-brand-gold",
  },
  2020: {
    gradient: "from-teal-600 to-cyan-500",
    museumGradient: "from-brand-mist to-brand-sky",
  },
  2023: {
    gradient: "from-yellow-500 to-amber-600",
    museumGradient: "from-brand-gold to-brand-amber",
  },
  2026: {
    gradient: "from-violet-600 to-fuchsia-500",
    museumGradient: "from-brand-amber to-brand-rust",
  },
}

// Available gradient palettes for new events (rotated based on year)
const GRADIENT_PALETTE = [
  {
    gradient: "from-amber-600 to-orange-500",
    museumGradient: "from-brand-rust to-brand-terracotta",
  },
  {
    gradient: "from-blue-600 to-cyan-500",
    museumGradient: "from-brand-sky to-brand-mist",
  },
  {
    gradient: "from-slate-600 to-gray-500",
    museumGradient: "from-brand-slate to-brand-maroon",
  },
  {
    gradient: "from-green-600 to-emerald-500",
    museumGradient: "from-brand-olive to-brand-mist",
  },
  {
    gradient: "from-indigo-600 to-purple-500",
    museumGradient: "from-brand-amber to-brand-terracotta",
  },
  {
    gradient: "from-rose-600 to-pink-500",
    museumGradient: "from-brand-rust to-brand-gold",
  },
  {
    gradient: "from-teal-600 to-cyan-500",
    museumGradient: "from-brand-mist to-brand-sky",
  },
  {
    gradient: "from-yellow-500 to-amber-600",
    museumGradient: "from-brand-gold to-brand-amber",
  },
  {
    gradient: "from-violet-600 to-fuchsia-500",
    museumGradient: "from-brand-amber to-brand-rust",
  },
]

// Helper function to extract numeric year from year string (e.g. "1925", "1930-1956" -> 1925, 1930)
const extractYear = yearString => {
  if (!yearString) return null
  const match = yearString.match(/\d{4}/)
  return match ? parseInt(match[0], 10) : null
}

// Helper function to get gradient for an event
const getGradientForEvent = event => {
  // Extract numeric year from year string (handles both "1925" and legacy "1930-1956" formats)
  const yearString = event.year || ""
  const numericYear = extractYear(yearString)
  const gradientData = numericYear ? GRADIENT_MAP[numericYear] : null

  // If year is in hardcoded map, use it (or database value if exists)
  if (gradientData) {
    return {
      gradient: event.gradient || gradientData.gradient,
      museumGradient: event.museum_gradient || gradientData.museumGradient,
    }
  }

  // If gradient exists in database, use it
  if (event.gradient || event.museum_gradient) {
    return {
      gradient: event.gradient || "from-gray-600 to-gray-500",
      museumGradient:
        event.museum_gradient || "from-brand-rust to-brand-terracotta",
    }
  }

  // For new events: assign gradient based on year (rotates through palette)
  if (numericYear) {
    // Use modulo to cycle through available gradients
    const paletteIndex = Math.abs(numericYear - 1900) % GRADIENT_PALETTE.length
    const selectedPalette = GRADIENT_PALETTE[paletteIndex]
    return {
      gradient: selectedPalette.gradient,
      museumGradient: selectedPalette.museumGradient,
    }
  }

  // Final fallback
  return {
    gradient: "from-gray-600 to-gray-500",
    museumGradient: "from-brand-rust to-brand-terracotta",
  }
}

// Swipe Hint Component
const SwipeHint = ({ visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        className="absolute right-8 top-1/2 -translate-y-1/2 z-40 pointer-events-none flex flex-col items-center gap-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30 animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-bounce-x"
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </div>
        <span className="text-white/80 text-sm font-medium tracking-wider uppercase drop-shadow-md">
          Veeg
        </span>
      </motion.div>
    )}
  </AnimatePresence>
)

// Era Background Component
const EraBackground = ({ currentYear, theme }) => {
  // Calculate decade (e.g., 1930, 1940)
  const decade = Math.floor(currentYear / 10) * 10

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={decade}
          className="text-[20vw] font-bold font-heading opacity-[0.15] select-none whitespace-nowrap"
          style={{ color: theme.colors.gold }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.15, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1 }}
        >
          Jaren '{decade.toString().slice(2)}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Timeline Scrubber Component
const TimelineScrubber = ({ scrollProgress, onScrub, theme }) => {
  const scrubberRef = useRef(null)

  const handleClick = e => {
    if (!scrubberRef.current) return
    const rect = scrubberRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(1, x / rect.width))
    onScrub(percentage)
  }

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[80%] max-w-4xl z-50 h-12 flex items-center justify-center">
      <div
        className="relative w-full h-1 bg-black/20 rounded-full cursor-pointer group"
        ref={scrubberRef}
        onClick={handleClick}
      >
        {/* Track */}
        <div className="absolute inset-0 bg-white/30 rounded-full backdrop-blur-sm" />

        {/* Progress Fill */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 rounded-full"
          style={{
            width: `${scrollProgress * 100}%`,
            background: theme.colors.gold,
          }}
        />

        {/* Thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
          style={{
            left: `${scrollProgress * 100}%`,
            borderColor: theme.colors.gold,
            marginLeft: "-12px", // Center thumb
          }}
        />

        {/* Decade Markers */}
        {[0, 0.25, 0.5, 0.75, 1].map((pos, i) => (
          <div
            key={i}
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white/50 rounded-full pointer-events-none"
            style={{ left: `${pos * 100}%`, marginLeft: "-8px" }}
          />
        ))}
      </div>
    </div>
  )
}

const Timeline = () => {
  const theme = getTheme()
  const { timelineData: apiData, loading, error } = useTimeline()
  const playSound = useSound()
  const [selectedPeriod, setSelectedPeriod] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedTimelineItem, setSelectedTimelineItem] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentYear, setCurrentYear] = useState(1925)
  const [showSwipeHint, setShowSwipeHint] = useState(false)
  const timelineRef = useRef(null)
  const videoRef = useRef(null)
  const hintTimerRef = useRef(null)

  // Idle screen state - start in idle mode
  const [isIdle, setIsIdle] = useState(true)
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false)

  // Handle idle timeout (5 minutes)
  const handleIdle = useRef(() => {
    setIsIdle(true)
    setShowLoadingAnimation(false)
    // Reset timeline state when returning to idle
    setSelectedPeriod(null)
    setIsDetailModalOpen(false)
    setSelectedTimelineItem(null)
  })

  // Idle timer - only active when not in idle mode
  // Timer automatically resets on user interactions (click, touch, scroll, mousemove, keypress)
  useIdleTimer(300000, handleIdle.current, !isIdle)

  // Handle activation from idle screen
  const handleActivate = () => {
    if (isIdle) {
      setIsIdle(false)
      setShowLoadingAnimation(true)
      // Show loading animation for 2 seconds, then show timeline
      setTimeout(() => {
        setShowLoadingAnimation(false)
      }, 2000)
    }
  }

  // Handle video loop
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.addEventListener("ended", () => {
        video.currentTime = 0
        video.play()
      })
    }
  }, [])

  // Map API data to component format
  const timelineData = useMemo(() => {
    if (!apiData || apiData.length === 0) return []

    return apiData.map(event => {
      // Get hardcoded gradients based on year
      const gradients = getGradientForEvent(event)

      return {
        id: event.id?.toString() || `event-${event.id}`,
        year: event.year || "",
        title: event.title || "",
        description: event.description || "",
        gradient: gradients.gradient,
        museumGradient: gradients.museumGradient,
        stage: event.stage || 1,
        hasPuzzle:
          event.has_puzzle === true ||
          event.has_puzzle === 1 ||
          event.has_puzzle === "1" ||
          Boolean(event.has_puzzle),
        puzzleImage:
          event.puzzle_image_url && event.puzzle_image_url.trim() !== ""
            ? event.puzzle_image_url
            : null,
        gameType: event.game_type || "none", // 'none', 'puzzle', 'memory'
        hasGame: event.game_type && event.game_type !== "none", // true if any game is enabled
        icon: event.icon || "🌾",
        useDetailedModal: true, // Always use detailed modal
        historicalContext: event.historical_context || "",
        has_key_moments:
          event.has_key_moments === true ||
          event.has_key_moments === 1 ||
          event.has_key_moments === "1" ||
          Boolean(event.has_key_moments),
        category: (event.category || "museum").toLowerCase(), // Normalize to lowercase and default to museum if not set
        mainImage: event.main_image || event.image_url || null, // Add main image for card display
      }
    })
  }, [apiData])

  // Calculate min and max years from data
  const { minYear, maxYear } = useMemo(() => {
    if (!timelineData || timelineData.length === 0)
      return { minYear: 1925, maxYear: 2025 }

    const years = timelineData
      .map(event => extractYearUtil(event.year))
      .filter(y => y !== null)

    if (years.length === 0) return { minYear: 1925, maxYear: 2025 }

    const min = Math.min(...years)
    const max = Math.max(...years)

    // Round down/up to nearest 5
    return {
      minYear: Math.floor(min / 5) * 5,
      maxYear: Math.ceil(max / 5) * 5,
    }
  }, [timelineData])

  // Generate year markers
  const yearMarkers = useMemo(() => {
    return generateYearMarkers(minYear, maxYear, 5)
  }, [minYear, maxYear])

  // Group events by year markers
  const timelineSections = useMemo(() => {
    return groupEventsByMarkers(timelineData, yearMarkers)
  }, [timelineData, yearMarkers])

  const handleMouseDown = e => {
    // Only handle left mouse button
    if (e.button !== 0 && e.type === "mousedown") return
    setIsDragging(true)
    setStartX(e.pageX || (e.touches && e.touches[0]?.pageX) || 0)
    if (timelineRef.current) {
      setScrollLeft(timelineRef.current.scrollLeft)
    }
    resetHintTimer()
  }

  const handleMouseMove = e => {
    if (!isDragging || !timelineRef.current) return
    e.preventDefault()
    e.stopPropagation()
    const x = e.pageX || (e.touches && e.touches[0]?.pageX) || 0
    const walk = (x - startX) * 2
    const newScrollLeft = scrollLeft - walk
    timelineRef.current.scrollLeft = newScrollLeft
    resetHintTimer()
  }

  const handleMouseUp = e => {
    // Only handle left mouse button
    if (e.button !== 0 && e.type === "mouseup") return
    setIsDragging(false)
    resetHintTimer()
  }

  // Scroll Handler for Progress & Year Calculation
  const handleScroll = () => {
    if (!timelineRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = timelineRef.current
    const maxScroll = scrollWidth - clientWidth
    const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0
    setScrollProgress(progress)

    // Calculate approximate year based on progress
    const yearRange = maxYear - minYear
    const year = minYear + Math.round(progress * yearRange)
    setCurrentYear(year)

    resetHintTimer()
  }

  // Scrubber Handler
  const handleScrub = percentage => {
    if (!timelineRef.current) return
    const { scrollWidth, clientWidth } = timelineRef.current
    const maxScroll = scrollWidth - clientWidth
    const newScrollLeft = maxScroll * percentage

    timelineRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    })
  }

  // Hint Timer Logic
  const resetHintTimer = () => {
    setShowSwipeHint(false)
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current)

    if (!isIdle && !isDetailModalOpen) {
      hintTimerRef.current = setTimeout(() => {
        setShowSwipeHint(true)
      }, 4000) // Show hint after 4s of inactivity
    }
  }

  useEffect(() => {
    resetHintTimer()
    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current)
    }
  }, [isIdle, isDetailModalOpen])

  const handleCardClick = periodId => {
    if (!isDragging) {
      playSound()
      const timelineItem = timelineData.find(item => item.id === periodId)
      setSelectedTimelineItem(timelineItem)

      // Always use detailed modal
      setIsDetailModalOpen(true)
      console.log("Navigeer naar periode:", periodId)
    }
  }

  const closeDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedTimelineItem(null)
  }

  // Show loading state with skeleton
  if (loading) {
    return (
      <div
        className="min-h-screen relative overflow-hidden pt-32"
        style={{
          overscrollBehavior: "none",
          overscrollBehaviorY: "none",
          overscrollBehaviorX: "none",
          touchAction: "pan-x pan-y",
          WebkitOverflowScrolling: "touch",
        }}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Background video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={backgroundTimelineVideo} type="video/mp4" />
        </video>

        {/* Theme-based overlay - reduced opacity for less orange tint */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${theme.background.primary}`}
        />

        {/* Subtle pattern overlay - reduced opacity */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${theme.background.overlay}`}
        />

        {/* Studentenwerk Logo */}
        <StudentenwerkLogo />

        {/* Headline */}
        <div className="relative z-10">
          <MuseumHeadline
            text="100 jaar geschiedenis"
            subtext="Fries Landbouwmuseum"
          />
        </div>

        {/* Loading Skeletons */}
        <div className="timeline-container py-8 md:py-16 relative w-full h-full z-10">
          <div className="relative pb-32 overflow-hidden">
            <motion.div
              className="overflow-x-auto scrollbar-hide"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {/* Timeline Line */}
              <div
                className={`absolute top-1/2 transform -translate-y-1/2 h-2 bg-gradient-to-r ${theme.timeline.line} w-full min-w-max shadow-lg rounded-full`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${theme.timeline.line} blur-sm opacity-70 rounded-full`}
                />
              </div>

              {/* Loading Skeletons */}
              <LoadingSkeleton count={9} />
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          overscrollBehavior: "none",
          overscrollBehaviorY: "none",
          overscrollBehaviorX: "none",
          touchAction: "pan-x pan-y",
        }}
      >
        <div className="text-center text-red-500">
          <div className="text-xl">Fout bij het laden van data: {error}</div>
        </div>
      </div>
    )
  }

  // Fallback to empty array if no data
  if (!timelineData || timelineData.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          overscrollBehavior: "none",
          overscrollBehaviorY: "none",
          overscrollBehaviorX: "none",
          touchAction: "pan-x pan-y",
        }}
      >
        <div className="text-center p-8">
          <div className="text-2xl font-bold mb-4">
            Geen timeline data beschikbaar
          </div>
          <div className="text-lg mb-2">
            {error ? (
              <div className="text-red-500">
                <p className="mb-2">Fout bij het ophalen van data:</p>
                <p className="text-sm">{error}</p>
              </div>
            ) : (
              <div>
                <p className="mb-2">Geen actieve events gevonden.</p>
                <p className="text-sm text-gray-400">
                  Controleer of events zijn gemarkeerd als actief in het admin
                  panel.
                </p>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-500 mt-4">
            API URL:{" "}
            {import.meta.env.VITE_API_URL || "http://localhost/backend/api"}
          </div>
        </div>
      </div>
    )
  }

  // Show idle screen
  if (isIdle) {
    return (
      <AnimatePresence mode="wait">
        <IdleScreen key="idle" onActivate={handleActivate} />
      </AnimatePresence>
    )
  }

  // Show loading animation when transitioning from idle
  if (showLoadingAnimation) {
    return (
      <div
        className="min-h-screen relative overflow-hidden pt-32"
        style={{
          overscrollBehavior: "none",
          overscrollBehaviorY: "none",
          overscrollBehaviorX: "none",
          touchAction: "pan-x pan-y",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Background video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={backgroundTimelineVideo} type="video/mp4" />
        </video>

        {/* Theme-based overlay - reduced opacity for less orange tint */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${theme.background.primary}`}
        />

        {/* Subtle pattern overlay - reduced opacity */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${theme.background.overlay}`}
        />

        {/* Studentenwerk Logo */}
        <StudentenwerkLogo />

        {/* Headline */}
        <div className="relative z-10">
          <MuseumHeadline
            text="100 jaar geschiedenis"
            subtext="Fries Landbouwmuseum"
          />
        </div>

        {/* Loading Animation */}
        <div className="timeline-container py-8 md:py-16 relative w-full h-full z-10">
          <div className="relative pb-32 overflow-hidden">
            <motion.div
              className="overflow-x-auto scrollbar-hide"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {/* Timeline Line */}
              <div
                className={`absolute top-1/2 transform -translate-y-1/2 h-2 bg-gradient-to-r ${theme.timeline.line} w-full min-w-max shadow-lg rounded-full`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${theme.timeline.line} blur-sm opacity-70 rounded-full`}
                />
              </div>

              {/* Loading Skeletons */}
              <LoadingSkeleton count={9} />
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden pt-32"
      style={{
        overscrollBehavior: "none",
        overscrollBehaviorY: "none",
        overscrollBehaviorX: "none",
        touchAction: "pan-x pan-y",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* Background video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={backgroundTimelineVideo} type="video/mp4" />
      </video>

      {/* Theme-based overlay - reduced opacity for less orange tint */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${theme.background.primary}`}
      />

      {/* Subtle pattern overlay - reduced opacity */}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${theme.background.overlay}`}
      />

      {/* Era Background Text */}
      <EraBackground currentYear={currentYear} theme={theme} />

      {/* Swipe Hint */}
      <SwipeHint visible={showSwipeHint} />

      {/* Scrubber */}
      <TimelineScrubber
        scrollProgress={scrollProgress}
        onScrub={handleScrub}
        theme={theme}
      />

      {/* Studentenwerk Logo */}
      <StudentenwerkLogo />

      {/* Virtual Guide Mascot */}
      <VirtualGuide
        messages={[
          "Tik op een tijdperk om meer te weten te komen!",
          "Veeg naar links of rechts om door de geschiedenis te bladeren!",
          "Ontdek 100 jaar Fries Landbouwmuseum!",
        ]}
        position="top-right"
      />

      {/* Headline */}
      <div className="relative z-10">
        <MuseumHeadline
          text="100 jaar geschiedenis"
          subtext="Fries Landbouwmuseum"
        />
      </div>

      {/* Animated Animals - only on active timeline, not on idle screen */}
      <AnimatedAnimals />

      <div className="timeline-container py-8 md:py-16 relative w-full h-full z-10">
        {/* Timeline Container - no header, no indicators */}
        <div className="relative pb-32 overflow-hidden">
          <motion.div
            ref={timelineRef}
            className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              scrollBehavior: isDragging ? "auto" : "smooth",
              userSelect: "none",
            }}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDragStart={e => e.preventDefault()}
          >
            {/* Horizontal Timeline with Year Markers and Event Sections */}
            <motion.div
              className="flex flex-row items-start gap-0 min-w-max px-16 md:px-32 pt-16 md:pt-24 pb-16 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Timeline Line - Continuous Horizontal Line - FUTURISTIC GLOW */}
              <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 z-0 pointer-events-none">
                <div className="h-1 bg-[#f3f2e9] shadow-[0_0_20px_rgba(201,163,0,0.6)] w-full relative z-10"></div>
                <div
                  className={`absolute top-1/2 transform -translate-y-1/2 h-6 w-full blur-md opacity-60`}
                  style={{
                    background: `linear-gradient(90deg, ${theme.colors.terracotta}, ${theme.colors.gold}, ${theme.colors.terracotta})`,
                  }}
                ></div>
              </div>
              {timelineSections.map((section, sectionIndex) => (
                <div
                  key={section.markerYear}
                  className="flex flex-col items-start min-w-[500px] md:min-w-[600px] flex-shrink-0 relative pr-16 md:pr-24"
                >
                  {/* Year Marker - Large, Yellow, No Background */}
                  <div className="sticky left-0 top-0 z-20 mb-12">
                    <motion.span
                      className="text-7xl md:text-8xl font-bold block whitespace-nowrap pointer-events-none font-mono"
                      style={{
                        color: "#c9a300",
                        opacity: 0.6,
                        textShadow: "0 0 30px rgba(201, 163, 0, 0.4)", // Neon glow
                        letterSpacing: "-0.05em",
                      }}
                      initial={{ opacity: 0, y: -30 }}
                      animate={{ opacity: 0.6, y: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: sectionIndex * 0.1,
                        ease: "easeOut",
                      }}
                    >
                      {section.markerYear}
                    </motion.span>
                  </div>

                  {/* Events in this section */}
                  <div className="flex flex-row flex-wrap gap-8 md:gap-12 w-full py-5 relative z-10">
                    {section.events.length > 0 ? (
                      section.events.map((period, eventIndex) => (
                        <motion.div
                          key={period.id}
                          className="relative flex-shrink-0"
                          initial={{ opacity: 0, y: 100, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{
                            duration: 0.8,
                            delay: sectionIndex * 0.15 + eventIndex * 0.1,
                            ease: "easeOut",
                          }}
                        >
                          <div
                            className={`${
                              eventIndex % 2 === 0 ? "mb-48" : "mt-48"
                            } relative`}
                          >
                            {/* Event Year Label - Modern & Clean */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10">
                              <span
                                className="text-4xl font-bold whitespace-nowrap pointer-events-none tracking-widest font-heading"
                                style={{
                                  color: "#c9a300",
                                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                }}
                              >
                                {extractYearUtil(period.year)}
                              </span>
                            </div>

                            <motion.div
                              className="cursor-pointer w-[280px] min-w-[280px] max-w-[280px]"
                              onClick={() => handleCardClick(period.id)}
                              whileTap={{ scale: 0.98 }}
                            >
                              <motion.div
                                key={period.id}
                                className="relative flex-shrink-0"
                                initial={{ opacity: 0, y: 100, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                  duration: 0.8,
                                  delay: sectionIndex * 0.15 + eventIndex * 0.1,
                                  ease: "easeOut",
                                }}
                              >
                                <div
                                  className={`${
                                    eventIndex % 2 === 0 ? "mb-48" : "mt-48"
                                  } relative`}
                                >
                                  {/* Event Year Label - Modern & Clean */}
                                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10">
                                    <span
                                      className="text-4xl font-bold whitespace-nowrap pointer-events-none tracking-widest font-heading"
                                      style={{
                                        color: "#c9a300",
                                        textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                      }}
                                    >
                                      {extractYearUtil(period.year)}
                                    </span>
                                  </div>

                                  <motion.div
                                    className="cursor-pointer w-[280px] min-w-[280px] max-w-[280px]"
                                    onClick={() => handleCardClick(period.id)}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <motion.div
                                      key={period.id}
                                      className="relative flex-shrink-0"
                                      initial={{
                                        opacity: 0,
                                        y: 100,
                                        scale: 0.8,
                                      }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      transition={{
                                        duration: 0.8,
                                        delay:
                                          sectionIndex * 0.15 +
                                          eventIndex * 0.1,
                                        ease: "easeOut",
                                      }}
                                    >
                                      <div
                                        className={`${
                                          eventIndex % 2 === 0
                                            ? "mb-48"
                                            : "mt-48"
                                        } relative`}
                                      >
                                        {/* Event Year Label - Modern & Clean */}
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10">
                                          <span
                                            className="text-4xl font-bold whitespace-nowrap pointer-events-none tracking-widest font-heading"
                                            style={{
                                              color: "#c9a300",
                                              textShadow:
                                                "0 2px 4px rgba(0,0,0,0.1)",
                                            }}
                                          >
                                            {extractYearUtil(period.year)}
                                          </span>
                                        </div>

                                        <motion.div
                                          className="cursor-pointer w-[280px] min-w-[280px] max-w-[280px]"
                                          onClick={() =>
                                            handleCardClick(period.id)
                                          }
                                          whileTap={{ scale: 0.98 }}
                                        >
                                          {/* Event Card - Typographic Museum Plaque */}
                                          <motion.div
                                            className={`relative bg-[#f3f2e9] rounded-xl overflow-hidden h-[420px] flex flex-col shadow-lg border-t-4 group`}
                                            style={{
                                              borderTopColor:
                                                getCategoryBorderColor(
                                                  period.category
                                                ),
                                              borderLeft:
                                                "1px solid rgba(167, 184, 180, 0.3)",
                                              borderRight:
                                                "1px solid rgba(167, 184, 180, 0.3)",
                                              borderBottom:
                                                "1px solid rgba(167, 184, 180, 0.3)",
                                            }}
                                            animate={{
                                              y:
                                                selectedPeriod === period.id
                                                  ? -10
                                                  : 0,
                                              boxShadow:
                                                selectedPeriod === period.id
                                                  ? `0 20px 40px -10px rgba(0,0,0,0.15), 0 0 0 1px ${getCategoryBorderColor(
                                                      period.category
                                                    )}`
                                                  : "0 10px 30px -10px rgba(0,0,0,0.05)",
                                            }}
                                            whileHover={{
                                              y: -10,
                                              boxShadow: `0 20px 40px -10px rgba(0,0,0,0.15), 0 0 0 1px ${getCategoryBorderColor(
                                                period.category
                                              )}`,
                                            }}
                                            transition={{ duration: 0.3 }}
                                          >
                                            {/* Game Badge for Kids */}
                                            {period.hasGame && (
                                              <div className="absolute top-0 right-0 z-20">
                                                <div
                                                  className={`${
                                                    period.gameType === "puzzle"
                                                      ? "bg-[#c9a300]"
                                                      : "bg-[#22c55e]"
                                                  } text-white px-4 py-2 rounded-bl-2xl shadow-md flex items-center gap-2 transform transition-transform group-hover:scale-105`}
                                                >
                                                  <Puzzle
                                                    size={18}
                                                    strokeWidth={2.5}
                                                  />
                                                  <span className="text-xs font-bold uppercase tracking-widest">
                                                    {period.gameType ===
                                                    "puzzle"
                                                      ? "Puzzle"
                                                      : "Memory"}
                                                  </span>
                                                </div>
                                              </div>
                                            )}

                                            {/* Background Watermark (Year) */}
                                            <div
                                              className="absolute -right-4 -bottom-12 text-[180px] font-bold font-heading opacity-5 pointer-events-none select-none transform -rotate-12"
                                              style={{
                                                color: getCategoryBorderColor(
                                                  period.category
                                                ),
                                              }}
                                            >
                                              {extractYearUtil(period.year)}
                                            </div>

                                            {/* Card Content */}
                                            <div className="p-8 flex flex-col h-full relative z-10">
                                              {/* Category Label */}
                                              <div className="mb-6">
                                                <span
                                                  className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                                                  style={{
                                                    backgroundColor: `${getCategoryBorderColor(
                                                      period.category
                                                    )}15`,
                                                    color:
                                                      getCategoryBorderColor(
                                                        period.category
                                                      ),
                                                  }}
                                                >
                                                  {period.category === "museum"
                                                    ? "Museum"
                                                    : period.category ===
                                                      "maatschappelijk"
                                                    ? "Maatschappelijk"
                                                    : "Landbouw"}
                                                </span>
                                              </div>

                                              {/* Title */}
                                              <div className="mb-6">
                                                <h3
                                                  className="text-2xl font-bold leading-tight font-heading"
                                                  style={{
                                                    color: "#440f0f",
                                                  }}
                                                >
                                                  {period.title}
                                                </h3>
                                                <div
                                                  className="h-1 w-12 mt-4 rounded-full"
                                                  style={{
                                                    background:
                                                      getCategoryBorderColor(
                                                        period.category
                                                      ),
                                                  }}
                                                />
                                              </div>

                                              {/* Description */}
                                              <div className="flex-grow overflow-hidden relative">
                                                <p className="leading-relaxed font-medium text-base text-[#657575] line-clamp-6">
                                                  {period.description}
                                                </p>
                                                {/* Fade out effect */}
                                                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#f3f2e9] to-transparent" />
                                              </div>

                                              {/* Footer / CTA */}
                                              <div className="mt-auto pt-6 flex items-center justify-between">
                                                <span
                                                  className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all group-hover:gap-3"
                                                  style={{
                                                    color: theme.colors.gold,
                                                  }}
                                                >
                                                  Lees meer
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                  >
                                                    <line
                                                      x1="5"
                                                      y1="12"
                                                      x2="19"
                                                      y2="12"
                                                    ></line>
                                                    <polyline points="12 5 19 12 12 19"></polyline>
                                                  </svg>
                                                </span>
                                              </div>
                                            </div>
                                          </motion.div>
                                        </motion.div>
                                      </div>
                                    </motion.div>
                                  </motion.div>
                                </div>
                              </motion.div>
                            </motion.div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      // Empty section - minimal space placeholder
                      <div className="w-24 h-48 opacity-0" />
                    )}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Fallback: If no sections, show events normally */}
            {timelineSections.length === 0 && (
              <motion.div
                className="flex items-center space-x-16 md:space-x-32 min-w-max px-16 md:px-32 pt-16 md:pt-24 pb-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                {timelineData.map((period, index) => (
                  <motion.div
                    key={period.id}
                    className="relative flex-shrink-0 z-10"
                    initial={{ opacity: 0, y: 100, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.2,
                      ease: "easeOut",
                    }}
                  >
                    <div
                      className={`${index % 2 === 0 ? "mb-48" : "mt-48"} w-80`}
                    >
                      <motion.div
                        className="cursor-pointer"
                        onClick={() => handleCardClick(period.id)}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Year - Animated */}
                        <div className="text-center mb-6">
                          <AnimatedYear
                            year={period.year}
                            theme={theme}
                            gradient={period.gradient}
                          />
                        </div>

                        {/* Event Card - Typographic Museum Plaque */}
                        <motion.div
                          className={`relative bg-[#f3f2e9] rounded-xl overflow-hidden h-[420px] flex flex-col shadow-lg border-t-4 group`}
                          style={{
                            borderTopColor: getCategoryBorderColor(
                              period.category
                            ),
                            borderLeft: "1px solid rgba(167, 184, 180, 0.3)",
                            borderRight: "1px solid rgba(167, 184, 180, 0.3)",
                            borderBottom: "1px solid rgba(167, 184, 180, 0.3)",
                          }}
                          animate={{
                            y: selectedPeriod === period.id ? -10 : 0,
                            boxShadow:
                              selectedPeriod === period.id
                                ? `0 20px 40px -10px rgba(0,0,0,0.15), 0 0 0 1px ${getCategoryBorderColor(
                                    period.category
                                  )}`
                                : "0 10px 30px -10px rgba(0,0,0,0.05)",
                          }}
                          whileHover={{
                            y: -10,
                            boxShadow: `0 20px 40px -10px rgba(0,0,0,0.15), 0 0 0 1px ${getCategoryBorderColor(
                              period.category
                            )}`,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Background Watermark (Year) */}
                          <div
                            className="absolute -right-4 -bottom-12 text-[180px] font-bold font-heading opacity-5 pointer-events-none select-none transform -rotate-12"
                            style={{
                              color: getCategoryBorderColor(period.category),
                            }}
                          >
                            {extractYearUtil(period.year)}
                          </div>

                          {/* Card Content */}
                          <div className="p-8 flex flex-col h-full relative z-10">
                            {/* Category Label */}
                            <div className="mb-6">
                              <span
                                className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                                style={{
                                  backgroundColor: `${getCategoryBorderColor(
                                    period.category
                                  )}15`,
                                  color: getCategoryBorderColor(
                                    period.category
                                  ),
                                }}
                              >
                                {period.category === "museum"
                                  ? "Museum"
                                  : period.category === "maatschappelijk"
                                  ? "Maatschappelijk"
                                  : "Landbouw"}
                              </span>
                            </div>

                            {/* Title */}
                            <div className="mb-6">
                              <h3
                                className="text-2xl font-bold leading-tight font-heading"
                                style={{
                                  color: "#440f0f",
                                }}
                              >
                                {period.title}
                              </h3>
                              <div
                                className="h-1 w-12 mt-4 rounded-full"
                                style={{
                                  background: getCategoryBorderColor(
                                    period.category
                                  ),
                                }}
                              />
                            </div>

                            {/* Description */}
                            <div className="flex-grow overflow-hidden relative">
                              <p className="leading-relaxed font-medium text-base text-[#657575] line-clamp-6">
                                {period.description}
                              </p>
                              {/* Fade out effect */}
                              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#f3f2e9] to-transparent" />
                            </div>

                            {/* Footer / CTA */}
                            <div className="mt-auto pt-6 flex items-center justify-between">
                              <span
                                className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all group-hover:gap-3"
                                style={{ color: theme.colors.gold }}
                              >
                                Lees meer
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <line x1="5" y1="12" x2="19" y2="12"></line>
                                  <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Sliding detail panel disabled per request */}

      {/* New detailed modal for enhanced timeline events */}
      <AnimatePresence>
        {isDetailModalOpen && (
          <TimelineDetailModal
            isOpen={isDetailModalOpen}
            onClose={closeDetailModal}
            eventData={selectedTimelineItem}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Timeline
