import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Play,
  Puzzle,
  Image as ImageIcon,
  Video,
  MapPin,
  Clock,
  Brain,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getTheme } from "../../../config/themes"
import {
  getGalleryData,
  hasGallery,
  hasVideo,
} from "../../../config/timelineGalleries"
import ImagePuzzleModal from "../../PuzzleGame/ImagePuzzleModal"
import MemoryGame from "../../PuzzleGame/MemoryGame"
import LeeuwardenMap from "../content/LeeuwardenMap"
import MiniTimeline from "../ui/MiniTimeline"
import Breadcrumb from "../ui/Breadcrumb"
import { useSound } from "../../../hooks/useSound"
import { api } from "../../../services/api"

const TimelineDetailModal = ({ isOpen, onClose, eventData }) => {
  const playSound = useSound()
  const [activeMedia, setActiveMedia] = useState("image") // 'image', 'gallery', 'video'
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null)
  const [isImagePuzzleModalOpen, setIsImagePuzzleModalOpen] = useState(false)
  const [isMemoryGameModalOpen, setIsMemoryGameModalOpen] = useState(false)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [eventMedia, setEventMedia] = useState([])
  const [isLoadingMedia, setIsLoadingMedia] = useState(false)
  const [keyMoments, setKeyMoments] = useState([])
  const [isLoadingKeyMoments, setIsLoadingKeyMoments] = useState(false)
  const [eventSections, setEventSections] = useState([])
  const [isLoadingSections, setIsLoadingSections] = useState(false)
  const [puzzleImageUrl, setPuzzleImageUrl] = useState(null)
  const [isLoadingPuzzleUrl, setIsLoadingPuzzleUrl] = useState(false)
  const navigate = useNavigate()
  const theme = getTheme()

  // Map database event ID to gallery key
  // Event ID 1 (1925) -> 'museum-foundation'
  const getGalleryKey = (eventId, year) => {
    // Map by ID first (most reliable)
    const idMap = {
      1: "museum-foundation", // 1925 - Oprichting van het museum
    }

    if (idMap[eventId]) {
      return idMap[eventId]
    }

    // Fallback: try to map by year or use eventId as string
    return eventId?.toString() || "unknown"
  }

  // Get gallery data from configuration
  const galleryKey = getGalleryKey(eventData?.id, eventData?.year)
  const galleryConfig = getGalleryData(galleryKey)
  const configGalleryImages = galleryConfig.gallery || []
  const mainImage = galleryConfig.mainImage || eventData?.mainImage
  const videoUrl = galleryConfig.video
  const model3dUrl = galleryConfig.model3d

  // Fetch event media from API when modal opens
  useEffect(() => {
    if (isOpen && eventData?.id) {
      setIsLoadingMedia(true)
      api
        .getEventMedia(eventData.id)
        .then(result => {
          if (result.data && result.data.length > 0) {
            // Convert API media to gallery format
            const apiImages = result.data.map(media => ({
              src: media.file_url,
              caption: media.caption || "",
              alt: media.caption || `Event image ${media.id}`,
            }))
            setEventMedia(apiImages)
          } else {
            setEventMedia([])
          }
        })
        .catch(error => {
          console.warn("Failed to fetch event media:", error)
          setEventMedia([])
        })
        .finally(() => {
          setIsLoadingMedia(false)
        })
    } else {
      setEventMedia([])
    }
  }, [isOpen, eventData?.id])

  // Fetch event sections from API when modal opens
  useEffect(() => {
    if (isOpen && eventData?.id) {
      setIsLoadingSections(true)
      const eventId =
        typeof eventData.id === "string" ? parseInt(eventData.id) : eventData.id
      api
        .getEventSections(eventId)
        .then(result => {
          if (result.data && result.data.length > 0) {
            // Sort sections by section_order
            const sortedSections = result.data.sort(
              (a, b) => (a.section_order || 0) - (b.section_order || 0)
            )
            setEventSections(sortedSections)
          } else {
            setEventSections([])
          }
        })
        .catch(error => {
          console.warn("Failed to fetch event sections:", error)
          setEventSections([])
        })
        .finally(() => {
          setIsLoadingSections(false)
        })
    } else {
      setEventSections([])
    }
  }, [isOpen, eventData?.id])

  // Fetch key moments from API when modal opens
  useEffect(() => {
    if (isOpen && eventData?.id && eventData?.has_key_moments) {
      setIsLoadingKeyMoments(true)
      // Convert id to number if it's a string
      const eventId =
        typeof eventData.id === "string" ? parseInt(eventData.id) : eventData.id
      api
        .getKeyMoments(eventId)
        .then(result => {
          if (result.data && result.data.length > 0) {
            // Convert API key moments to MiniTimeline format
            const moments = result.data.map(moment => ({
              year: parseInt(moment.year) || moment.year,
              title: moment.title || "",
              shortDescription: moment.shortDescription || "",
              fullDescription: moment.fullDescription || "",
            }))
            setKeyMoments(moments)
          } else {
            setKeyMoments([])
          }
        })
        .catch(error => {
          console.error("Failed to fetch key moments:", error)
          setKeyMoments([])
        })
        .finally(() => {
          setIsLoadingKeyMoments(false)
        })
    } else {
      setKeyMoments([])
    }
  }, [isOpen, eventData?.id, eventData?.has_key_moments])

  // Fetch puzzle image URL from API endpoint when modal opens
  useEffect(() => {
    if (isOpen) {
      // Try both snake_case (from API) and camelCase (from Timeline transform)
      const puzzleImg = eventData?.puzzle_image_url || eventData?.puzzleImage || eventData?.puzzle_image

      if (puzzleImg && puzzleImg.trim() !== "" && puzzleImg !== "null" && puzzleImg !== "undefined") {
        setIsLoadingPuzzleUrl(true)
        
        console.log("🧩 Fetching puzzle image URL for:", puzzleImg)
        
        api.getPuzzleImageUrl(puzzleImg)
          .then(data => {
            if (data.success && data.url) {
              console.log("✅ Puzzle image URL received:", data.url)
              
              // Use direct URL (no proxy needed for same-domain images)
              // Proxy is only needed for cross-origin images (CORS)
              setPuzzleImageUrl(data.url)
            } else {
              console.error("❌ Puzzle image API returned error:", data.message)
              setPuzzleImageUrl(null)
            }
          })
          .catch(error => {
            console.error("❌ Failed to fetch puzzle image URL:", error)
            // Fallback: try to construct URL manually
            const origin = window.location.origin
            const pathname = window.location.pathname
            let basePath = ""
            
            if (pathname.includes("/frontend/")) {
              basePath = pathname.split("/frontend/")[0]
            } else if (pathname.includes("/Landbouw-Interactieve-Scherm/")) {
              basePath = "/Landbouw-Interactieve-Scherm"
            } else if (pathname.includes("/timeline")) {
              const match = pathname.match(/^(.+\/timeline)/)
              basePath = match ? match[1] : pathname.substring(0, pathname.lastIndexOf("/"))
            } else {
              basePath = pathname.substring(0, pathname.lastIndexOf("/"))
            }
            
            if (basePath && !basePath.startsWith("/")) {
              basePath = "/" + basePath
            }
            if (basePath.endsWith("/")) {
              basePath = basePath.slice(0, -1)
            }
            
            const fallbackUrl = `${origin}${basePath}/adminpanel/uploads/${puzzleImg}`
            console.log("🔄 Using fallback URL:", fallbackUrl)
            setPuzzleImageUrl(fallbackUrl)
          })
          .finally(() => {
            setIsLoadingPuzzleUrl(false)
          })
      } else {
        setPuzzleImageUrl(null)
      }
    } else {
      setPuzzleImageUrl(null)
    }
  }, [isOpen, eventData?.puzzle_image_url, eventData?.puzzleImage, eventData?.puzzle_image])

  // Use API media if available, otherwise fall back to config gallery images
  const galleryImages = eventMedia.length > 0 ? eventMedia : configGalleryImages

  // Get active year for mini timeline (extract numeric year from event year string)
  const getActiveYear = () => {
    if (!eventData?.year) return null
    const yearMatch = eventData.year.toString().match(/\d{4}/)
    return yearMatch ? parseInt(yearMatch[0]) : null
  }

  // Breadcrumb items
  const breadcrumbItems = [
    {
      label: "Timeline",
    },
    {
      label: eventData?.year?.toString() || "1925",
    },
    {
      label: eventData?.title || "Oprichting van het museum",
    },
  ]

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Auto-slideshow timer (5 seconds)
  useEffect(() => {
    if (isOpen && activeMedia === "image" && galleryImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlideIndex(prev => (prev + 1) % galleryImages.length)
      }, 5000) // 5 seconds

      return () => clearInterval(timer)
    }
  }, [isOpen, activeMedia, galleryImages.length])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setActiveMedia("image")
      setSelectedGalleryImage(null)
      setCurrentSlideIndex(0)
    }
  }, [isOpen])

  if (!isOpen || !eventData) return null

  const handlePuzzleGame = () => {
    playSound()
    setIsImagePuzzleModalOpen(true)
  }

  const handleMemoryGame = () => {
    playSound()
    setIsMemoryGameModalOpen(true)
  }

  // Memoize close handler to prevent ImagePuzzleModal re-renders
  const handleCloseImagePuzzleModal = React.useCallback(() => {
    setIsImagePuzzleModalOpen(false)
  }, [])

  // Memoize close handler for MemoryGame
  const handleCloseMemoryGameModal = React.useCallback(() => {
    setIsMemoryGameModalOpen(false)
  }, [])

  const handleSlideChange = direction => {
    if (galleryImages.length === 0) return

    if (direction === "next") {
      setCurrentSlideIndex(prev => (prev + 1) % galleryImages.length)
    } else {
      setCurrentSlideIndex(
        prev => (prev - 1 + galleryImages.length) % galleryImages.length
      )
    }
  }

  const renderMediaContent = () => {
    switch (activeMedia) {
      case "video":
        return (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <div className="text-center space-y-4 p-4">
              <Video
                size={48}
                className="mx-auto text-white/50 animate-pulse lg:w-16 lg:h-16"
              />
              <p className="text-white text-lg font-medium">Historical Video</p>
              <p className="text-gray-400 text-sm max-w-md mx-auto">
                Archival footage and animated reconstruction
              </p>
              <motion.button
                className="px-6 py-2 bg-white text-black rounded-full font-semibold flex items-center gap-2 mx-auto text-sm mt-4 hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play size={16} />
                Play Video
              </motion.button>
            </div>
          </div>
        )

      default: // slideshow
        return (
          <div className="w-full h-full relative bg-black group">
            {galleryImages.length > 0 ? (
              <>
                <motion.div
                  key={currentSlideIndex}
                  className="w-full h-full relative cursor-grab active:cursor-grabbing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = Math.abs(offset.x) * velocity.x
                    if (swipe > 1000) {
                      handleSlideChange("prev")
                    } else if (swipe < -1000) {
                      handleSlideChange("next")
                    }
                  }}
                >
                  {galleryImages[currentSlideIndex]?.src ? (
                    <img
                      src={galleryImages[currentSlideIndex].src}
                      alt={galleryImages[currentSlideIndex].caption}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center p-4">
                        <ImageIcon
                          size={48}
                          className="mx-auto text-white/30 mb-3"
                        />
                        <p className="text-white/50 text-sm">
                          Image not available
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Caption Overlay (Gradient) */}
                  {galleryImages[currentSlideIndex]?.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-12">
                      <p className="text-white font-medium text-lg">
                        {galleryImages[currentSlideIndex].caption}
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Indicators (Dots) */}
                {galleryImages.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                    {galleryImages.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentSlideIndex
                            ? "bg-white w-6"
                            : "bg-white/40 hover:bg-white/60"
                        }`}
                        onClick={() => setCurrentSlideIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center space-y-3 p-4">
                  <ImageIcon
                    size={64}
                    className="mx-auto text-white/20"
                  />
                  <p className="text-white text-xl font-semibold">
                    {eventData?.title}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Foto's worden binnenkort toegevoegd
                  </p>
                </div>
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              playSound()
              onClose()
            }}
          />

          {/* Modal Content - SPLIT SCREEN LAYOUT */}
          <motion.div
            className="relative w-full max-w-[95vw] xl:max-w-[90vw] h-[90vh] bg-[#f3f2e9] rounded-[16px] shadow-[0_10px_40px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col-reverse md:flex-row"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Close Button - Top Right (Absolute) - Styled to match museum theme */}
            <motion.button
              className="absolute top-6 right-6 z-50 w-12 h-12 bg-[#657575]/10 hover:bg-[#657575]/20 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              onClick={() => {
                playSound()
                onClose()
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={24} className="text-[#657575]" />
            </motion.button>

            {/* LEFT SIDE - MEDIA (Black background, full fill) - NEW LAYOUT */}
            <div className="w-full md:w-1/2 h-[300px] md:h-full bg-black relative overflow-hidden flex items-center justify-center">
              {renderMediaContent()}
            </div>

            {/* RIGHT SIDE - CONTENT (Restored Linen Background & Styles) - RESTORED LAYOUT */}
            <div className="w-full md:w-1/2 h-full bg-[#f3f2e9] p-8 md:p-12 flex flex-col relative overflow-y-auto custom-scrollbar">
              
              {/* Breadcrumb Navigation */}
              <Breadcrumb items={breadcrumbItems} />
              
              {/* Media Toggle Buttons - Moved to top for visibility */}
              <div className="mt-4 mb-6 flex justify-end gap-3">
                <motion.button 
                  className={`px-5 py-2.5 rounded-xl font-bold font-heading flex items-center gap-2 transition-all text-sm ${
                    activeMedia === 'image' 
                      ? 'bg-[#ae5514] text-[#f3f2e9] shadow-md hover:bg-[#89350a]' 
                      : 'bg-white text-[#657575] border border-[#a7b8b4]/40 hover:bg-[#f3f2e9]'
                  }`}
                  onClick={() => {
                    playSound()
                    setActiveMedia('image')
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ImageIcon size={18} />
                  Foto's
                </motion.button>
                
                <motion.button 
                  className={`px-5 py-2.5 rounded-xl font-bold font-heading flex items-center gap-2 transition-all text-sm ${
                    activeMedia === 'video' 
                      ? 'bg-[#ae5514] text-[#f3f2e9] shadow-md hover:bg-[#89350a]' 
                      : 'bg-white text-[#657575] border border-[#a7b8b4]/40 hover:bg-[#f3f2e9]'
                  }`}
                  onClick={() => {
                    playSound()
                    setActiveMedia('video')
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Video size={18} />
                  Video
                </motion.button>
              </div>
              
              {/* Top Section: Title & Year */}
              <motion.div 
                className="mb-8 mt-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                 {/* Year Badge */}
                 <div className="inline-flex items-center px-5 py-2 rounded-full bg-[#c9a300]/20 border border-[#c9a300]/30 mb-6 backdrop-blur-sm">
                    <span className="text-lg font-bold text-[#c9a300] tracking-wider font-heading">
                      {eventData.year}
                    </span>
                 </div>

                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-[#c9a300] leading-tight tracking-tight font-heading">
                  {eventData.title}
                </h1>
                
                {/* Event Description - ONLY if NO key moments */}
                {eventSections.length === 0 &&
                  !isLoadingSections &&
                  eventData.description && 
                  (!eventData.has_key_moments && keyMoments.length === 0) && (
                    <div className="relative group/reader">
                      <p className="text-[#657575] leading-relaxed text-lg lg:text-xl mb-8 font-light">
                        {eventData.description}
                      </p>
                    </div>
                  )}
              </motion.div>

              {/* Middle Section: Dynamic Content */}
              <motion.div 
                className="space-y-8 flex-grow"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                
                {/* Key Moments - Mini Timeline */}
                {(eventData?.has_key_moments || keyMoments.length > 0) && (
                   <div className="mb-8">
                     <div className="flex items-center gap-2 text-[#440f0f] font-bold text-xl mb-4 font-heading">
                        <Clock size={24} className="text-[#440f0f]" />
                        <h3>Belangrijke momenten</h3>
                     </div>
                     
                     {isLoadingKeyMoments ? (
                        <div className="animate-pulse space-y-3">
                          <div className="h-4 bg-[#a7b8b4]/30 rounded w-3/4"></div>
                          <div className="h-4 bg-[#a7b8b4]/30 rounded w-1/2"></div>
                        </div>
                      ) : keyMoments.length > 0 ? (
                        <MiniTimeline
                          events={keyMoments}
                          activeYear={getActiveYear()}
                        />
                      ) : (
                        <p className="text-sm text-[#657575] italic">Geen momenten gevonden.</p>
                      )}

                      {/* Description shown HERE if key moments exist */}
                      {eventData.description && (
                        <div className="mt-8 pt-6 border-t border-[#a7b8b4]/30 relative group/reader">
                            <p className="text-[#657575] leading-relaxed text-lg lg:text-xl font-light">
                                {eventData.description}
                            </p>
                        </div>
                      )}
                   </div>
                )}

                {/* Sections */}
                {eventSections.length > 0 && (
                  <div className="space-y-6">
                    {eventSections.map((section, index) => {
                       const hasBorder =
                        section.has_border === 1 ||
                        section.has_border === true ||
                        section.has_border === "1"
                        
                       return hasBorder ? (
                        <div key={`section-border-${section.id || index}`} className="bg-[#f3f2e9] rounded-2xl p-6 lg:p-8 border border-[#a7b8b4]/40 hover:border-[#c9a300]/30 shadow-sm transition-all duration-300 relative group/reader">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl lg:text-2xl font-bold text-[#c9a300] font-heading pr-8">
                              {section.section_title}
                            </h3>
                          </div>
                          <p className="text-[#657575] leading-relaxed text-base lg:text-lg">
                            {section.section_content}
                          </p>
                        </div>
                       ) : (
                        <div key={`section-plain-${section.id || index}`} className="py-2 relative group/reader">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl lg:text-2xl font-bold text-[#440f0f] font-heading pr-8">
                              {section.section_title}
                            </h3>
                          </div>
                          <p className="text-[#657575] leading-relaxed text-base lg:text-lg">
                            {section.section_content}
                          </p>
                        </div>
                       )
                    })}
                  </div>
                )}

                {/* Map (if applicable) */}
                {(eventData.year === "1925" || eventData.id === 1 || eventData.id === "museum-foundation") && (
                  <div className="space-y-3 pt-4">
                    <div className="flex items-center gap-3 mb-4">
                      <MapPin size={24} className="text-[#ae5514]" />
                      <div>
                        <h3 className="text-xl font-bold text-[#440f0f] font-heading">Historische Reis</h3>
                        <p className="text-sm text-[#657575]">Van Eysingahuis naar de huidige locatie</p>
                      </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-[#a7b8b4]/40 shadow-md">
                      <LeeuwardenMap />
                    </div>
                  </div>
                )}
                
                {/* Game Buttons - Based on game_type */}
                <div className="space-y-4 lg:space-y-6 mt-8 pt-4">
                  {(() => {
                    // Get game_type from eventData (supports both snake_case and camelCase)
                    const gameType = eventData?.game_type || eventData?.gameType || 'none'
                    
                    console.log("🎮 Game type for event:", eventData?.id, eventData?.title, "->", gameType)
                    
                    if (gameType === 'puzzle') {
                      return (
                        <motion.button
                          className={`w-full py-4 lg:py-5 px-6 lg:px-8 bg-gradient-to-r from-[#c9a300] to-[#a68600] hover:brightness-110 text-white rounded-2xl font-bold font-heading text-sm lg:text-base xl:text-lg flex items-center justify-center gap-3 shadow-lg min-h-[50px] lg:min-h-[60px] transition-all`}
                          onClick={handlePuzzleGame}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Puzzle size={24} />
                          Speel Puzzle
                        </motion.button>
                      )
                    } else if (gameType === 'memory') {
                      return (
                        <motion.button
                          className={`w-full py-4 lg:py-5 px-6 lg:px-8 bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:brightness-110 text-white rounded-2xl font-bold font-heading text-sm lg:text-base xl:text-lg flex items-center justify-center gap-3 shadow-lg min-h-[50px] lg:min-h-[60px] transition-all`}
                          onClick={handleMemoryGame}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Brain size={24} />
                          Speel Memory
                        </motion.button>
                      )
                    }
                    return null
                  })()}
                </div>

              </motion.div>

            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Image Puzzle Modal (nested) */}
      <ImagePuzzleModal
        isOpen={isImagePuzzleModalOpen}
        onClose={handleCloseImagePuzzleModal}
        puzzleImage={puzzleImageUrl}
      />

      {/* Memory Game Modal (nested) */}
      <MemoryGame
        isOpen={isMemoryGameModalOpen}
        onClose={handleCloseMemoryGameModal}
        images={galleryImages.length > 0 ? galleryImages.map(img => img.src || img) : null}
      />
    </AnimatePresence>
  )
}

export default TimelineDetailModal
