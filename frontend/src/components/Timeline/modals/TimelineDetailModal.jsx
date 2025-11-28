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
import { getGalleryData } from "../../../config/timelineGalleries"
import ImagePuzzleModal from "../../PuzzleGame/ImagePuzzleModal"
import MemoryGame from "../../PuzzleGame/MemoryGame"
import LeeuwardenMap from "../content/LeeuwardenMap"
import MiniTimeline from "../ui/MiniTimeline"
import Breadcrumb from "../ui/Breadcrumb"
import { useSound } from "../../../hooks/useSound"
import { api } from "../../../services/api"

// Import Landbouw Icon
import landbouwIcon from "../../../assets/icons/landbouw-model.png"

const TimelineDetailModal = ({ isOpen, onClose, eventData }) => {
  const playSound = useSound()
  const [activeMedia, setActiveMedia] = useState("image")
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

  // Determine Category Style
  const isLandbouw = eventData?.category === "landbouw"

  // Theme Configuration
  const theme = isLandbouw
    ? {
        // Landbouw Theme (Rustic Paper / Pergamin) - Darker/Richer version
        bg: "bg-[#e6dbbf] bg-[radial-gradient(circle_at_center,#f2ebd4_0%,#d9ceae_100%)] shadow-[inset_0_0_40px_rgba(58,45,32,0.1)] relative before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnPjxmaWx0ZXIgaWQ9J25vaXNlJz48ZmVUdXJidWxlbmNlIHR5cGU9J2ZyYWN0YWxOb2lzZScgYmFzZUZyZXF1ZW5jeT0nMC44JyBudW1PY3RhdmVzPSczJyBzdGl0Y2hUaWxlcz0nc3RpdGNoJy8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJScgZmlsdGVyPSd1cmwoI25vaXNlKScgb3BhY2l0eT0nMC40Jy8+PC9zdmc+')] before:opacity-60 before:pointer-events-none before:z-0 before:mix-blend-multiply",
        text: "text-[#3a2d20]",
        textMuted: "text-[#6b5a45]",
        heading: "text-[#42301e]", // Darker brown heading
        accent: "text-[#42301e]",
        accentBg: "bg-[#5c7a4f]", // Darker green for stamp
        accentBorder: "border-[#42301e]",
        cardBg: "bg-[#e6dfc8]/80 backdrop-blur-sm", // Slightly darker paper for cards
        cardBorder: "border-[#d1c7a7]",
        buttonPrimary:
          "bg-[#7c8f38] text-[#f3eeda] hover:bg-[#66752e] shadow-md", // Green button
        buttonSecondary: "bg-[#5e4b35] text-[#f3eeda] hover:bg-[#4a3b2a]", // Brown button for toggles
        closeBtn: "bg-[#5e4b35]/10 hover:bg-[#5e4b35]/20 text-[#5e4b35]",
        timelineLine: "bg-[#7c8f38]",
      }
    : {
        // History Theme (Default Museum)
        bg: "bg-[#f3f2e9]",
        text: "text-[#657575]",
        textMuted: "text-[#8c9999]",
        heading: "text-[#c9a300]",
        accent: "text-[#ae5514]",
        accentBg: "bg-[#c9a300]/20",
        accentBorder: "border-[#c9a300]/30",
        cardBg: "bg-[#f3f2e9]",
        cardBorder: "border-[#a7b8b4]/40",
        buttonPrimary: "bg-[#ae5514] text-[#f3eeda] hover:bg-[#89350a]",
        buttonSecondary:
          "bg-white text-[#657575] border border-[#a7b8b4]/40 hover:bg-[#f3f2e9]",
        closeBtn: "bg-[#657575]/10 hover:bg-[#657575]/20 text-[#657575]",
        timelineLine: "bg-[#c9a300]",
      }

  // ... [Data Fetching Hooks - Same as before] ...
  const getGalleryKey = (eventId, year) => {
    const idMap = { 1: "museum-foundation" }
    if (idMap[eventId]) return idMap[eventId]
    return eventId?.toString() || "unknown"
  }

  const galleryKey = getGalleryKey(eventData?.id, eventData?.year)
  const galleryConfig = getGalleryData(galleryKey)
  const configGalleryImages = galleryConfig.gallery || []

  useEffect(() => {
    if (isOpen && eventData?.id) {
      setIsLoadingMedia(true)
      api
        .getEventMedia(eventData.id)
        .then(result => {
          if (result.data && result.data.length > 0) {
            setEventMedia(
              result.data.map(media => ({
                src: media.file_url,
                caption: media.caption || "",
                alt: media.caption || `Event image ${media.id}`,
              }))
            )
          } else setEventMedia([])
        })
        .finally(() => setIsLoadingMedia(false))
    } else setEventMedia([])
  }, [isOpen, eventData?.id])

  useEffect(() => {
    if (isOpen && eventData?.id) {
      setIsLoadingSections(true)
      const eventId =
        typeof eventData.id === "string" ? parseInt(eventData.id) : eventData.id
      api
        .getEventSections(eventId)
        .then(result => {
          if (result.data && result.data.length > 0) {
            setEventSections(
              result.data.sort(
                (a, b) => (a.section_order || 0) - (b.section_order || 0)
              )
            )
          } else setEventSections([])
        })
        .finally(() => setIsLoadingSections(false))
    } else setEventSections([])
  }, [isOpen, eventData?.id])

  useEffect(() => {
    if (isOpen && eventData?.id && eventData?.has_key_moments) {
      setIsLoadingKeyMoments(true)
      const eventId =
        typeof eventData.id === "string" ? parseInt(eventData.id) : eventData.id
      api
        .getKeyMoments(eventId)
        .then(result => {
          if (result.data && result.data.length > 0) {
            setKeyMoments(
              result.data.map(moment => ({
                year: parseInt(moment.year) || moment.year,
                title: moment.title || "",
                shortDescription: moment.shortDescription || "",
                fullDescription: moment.fullDescription || "",
              }))
            )
          } else setKeyMoments([])
        })
        .finally(() => setIsLoadingKeyMoments(false))
    } else setKeyMoments([])
  }, [isOpen, eventData?.id, eventData?.has_key_moments])

  useEffect(() => {
    if (isOpen) {
      const puzzleImg =
        eventData?.puzzle_image_url ||
        eventData?.puzzleImage ||
        eventData?.puzzle_image
      if (puzzleImg && puzzleImg.trim() !== "" && puzzleImg !== "null") {
        setIsLoadingPuzzleUrl(true)
        api
          .getPuzzleImageUrl(puzzleImg)
          .then(data => {
            if (data.success && data.url) setPuzzleImageUrl(data.url)
            else setPuzzleImageUrl(null)
          })
          .catch(() => {
            setPuzzleImageUrl(null)
          })
          .finally(() => setIsLoadingPuzzleUrl(false))
      } else setPuzzleImageUrl(null)
    }
  }, [isOpen, eventData?.puzzle_image_url])

  const galleryImages = eventMedia.length > 0 ? eventMedia : configGalleryImages

  const getActiveYear = () => {
    if (!eventData?.year) return null
    const yearMatch = eventData.year.toString().match(/\d{4}/)
    return yearMatch ? parseInt(yearMatch[0]) : null
  }

  const breadcrumbItems = [
    { label: "Timeline" },
    { label: eventData?.year?.toString() || "1925" },
    { label: eventData?.title || "Oprichting van het museum" },
  ]

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && activeMedia === "image" && galleryImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlideIndex(prev => (prev + 1) % galleryImages.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [isOpen, activeMedia, galleryImages.length])

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
  const handleCloseImagePuzzleModal = React.useCallback(
    () => setIsImagePuzzleModalOpen(false),
    []
  )
  const handleCloseMemoryGameModal = React.useCallback(
    () => setIsMemoryGameModalOpen(false),
    []
  )

  const handleSlideChange = direction => {
    if (galleryImages.length === 0) return
    if (direction === "next")
      setCurrentSlideIndex(prev => (prev + 1) % galleryImages.length)
    else
      setCurrentSlideIndex(
        prev => (prev - 1 + galleryImages.length) % galleryImages.length
      )
  }

  // Updated Media Renderer with "Wooden Frame" support for Landbouw
  const renderMediaContent = () => {
    const frameClass = isLandbouw
      ? "border-[12px] border-[#5e4b35] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] rounded-sm"
      : ""

    switch (activeMedia) {
      case "video":
        return (
          <div
            className={`w-full h-full flex items-center justify-center bg-black ${frameClass}`}
          >
            <div className="text-center space-y-4 p-4">
              <Video
                size={48}
                className="mx-auto text-white/50 animate-pulse lg:w-16 lg:h-16"
              />
              <p className="text-white text-lg font-medium">Video</p>
              <motion.button
                className="px-6 py-2 bg-white text-black rounded-full font-semibold flex items-center gap-2 mx-auto text-sm mt-4 hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play size={16} /> Play Video
              </motion.button>
            </div>
          </div>
        )
      default:
        return (
          <div className="w-full h-full flex flex-col">
            {/* Main Image Container */}
            <div
              className={`relative flex-grow bg-black group overflow-hidden ${frameClass}`}
            >
              {galleryImages.length > 0 ? (
                <>
                  <motion.div
                    key={currentSlideIndex}
                    className="w-full h-full relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {galleryImages[currentSlideIndex]?.src ? (
                      <img
                        src={galleryImages[currentSlideIndex].src}
                        alt={galleryImages[currentSlideIndex].caption}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={48} className="text-white/30" />
                      </div>
                    )}

                    {/* Caption */}
                    {galleryImages[currentSlideIndex]?.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-12">
                        <p className="text-white font-medium text-lg">
                          {galleryImages[currentSlideIndex].caption}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center space-y-3 p-4">
                    <ImageIcon size={64} className="mx-auto text-white/20" />
                    <p className="text-white text-xl font-semibold">
                      {eventData?.title}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Strip (Landbouw only) */}
            {isLandbouw && galleryImages.length > 1 && (
              <div className="h-24 bg-[#f3eeda] p-2 flex gap-2 overflow-x-auto items-center border-t border-[#d1c7a7]">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                      currentSlideIndex === idx
                        ? "border-[#7c8f38] scale-105"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.src}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <AnimatePresence>
      {/* Custom Scrollbar Styles based on Theme */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: ${isLandbouw ? "14px" : "8px"};
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isLandbouw ? "#3a2d2010" : "transparent"};
          border-radius: ${isLandbouw ? "2px" : "4px"};
          ${isLandbouw ? "box-shadow: inset 0 0 6px rgba(0,0,0,0.1);" : ""}
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: ${isLandbouw ? "#8b5a2b" : "#a7b8b4"};
          background-image: ${
            isLandbouw
              ? "linear-gradient(45deg, rgba(255,255,255,.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.1) 50%, rgba(255,255,255,.1) 75%, transparent 75%, transparent)"
              : "none"
          };
          border-radius: ${isLandbouw ? "4px" : "4px"};
          border: ${isLandbouw ? "1px solid #5e4b35" : "2px solid transparent"};
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: ${isLandbouw ? "#6d4520" : "#657575"};
        }
      `}</style>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
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

          {/* MAIN CARD */}
          <motion.div
            className={`relative w-full max-w-[95vw] xl:max-w-[90vw] h-[90vh] ${theme.bg} rounded-[16px] shadow-[0_10px_40px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col-reverse md:flex-row`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <motion.button
              className={`absolute top-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-colors cursor-pointer ${theme.closeBtn}`}
              onClick={() => {
                playSound()
                onClose()
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={24} />
            </motion.button>

            {/* LEFT SIDE - MEDIA */}
            <div
              className={`w-full md:w-1/2 h-[300px] md:h-full ${
                isLandbouw
                  ? "bg-[#f3eeda] p-8 flex flex-col justify-center"
                  : "bg-black relative overflow-hidden flex items-center justify-center"
              }`}
            >
              {/* Media Toggle Buttons (Top Left for Landbouw) */}
              {isLandbouw && (
                <div className="flex justify-center gap-3 mb-6">
                  <motion.button
                    className={`px-6 py-2 rounded-full font-bold font-heading flex items-center gap-2 transition-all text-sm ${
                      activeMedia === "image"
                        ? theme.buttonPrimary
                        : "bg-[#5e4b35] text-[#f3eeda] opacity-50 hover:opacity-100"
                    }`}
                    onClick={() => {
                      playSound()
                      setActiveMedia("image")
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ImageIcon size={18} /> FOTO'S
                  </motion.button>

                  <motion.button
                    className={`px-6 py-2 rounded-full font-bold font-heading flex items-center gap-2 transition-all text-sm ${
                      activeMedia === "video"
                        ? theme.buttonPrimary
                        : "bg-[#5e4b35] text-[#f3eeda] opacity-50 hover:opacity-100"
                    }`}
                    onClick={() => {
                      playSound()
                      setActiveMedia("video")
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Video size={18} /> VIDEO
                  </motion.button>
                </div>
              )}

              {renderMediaContent()}
            </div>

            {/* RIGHT SIDE - CONTENT WRAPPER */}
            <div
              className={`w-full md:w-1/2 h-full relative overflow-hidden ${theme.bg}`}
            >
              {/* Background Layer - MERGED INTO WRAPPER */}
              {/* Wheat Background for Landbouw */}
              {isLandbouw && (
                <div className="absolute bottom-[-10%] -right-[20%] w-[100%] h-[100%] pointer-events-none z-0 opacity-40 rotate-[-10deg] mix-blend-multiply">
                  <motion.img
                    src={landbouwIcon}
                    alt="Landbouw background"
                    className="w-full h-full object-contain object-bottom-right"
                    animate={{
                      rotate: [0, 2, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              )}

              {/* Scrollable Content Layer */}
              <div className="relative z-10 h-full w-full overflow-y-auto custom-scrollbar p-8 md:p-12 flex flex-col">
                {/* Regular Breadcrumb */}
                {!isLandbouw && <Breadcrumb items={breadcrumbItems} />}

                {/* Standard Toggle Buttons (Top Right for Museum) */}
                {!isLandbouw && (
                  <div className="mt-4 mb-6 flex justify-end gap-3">
                    <motion.button
                      className={`px-5 py-2.5 rounded-xl font-bold font-heading flex items-center gap-2 transition-all text-sm ${
                        activeMedia === "image"
                          ? theme.buttonPrimary
                          : theme.buttonSecondary
                      }`}
                      onClick={() => {
                        playSound()
                        setActiveMedia("image")
                      }}
                    >
                      <ImageIcon size={18} /> Foto's
                    </motion.button>
                    <motion.button
                      className={`px-5 py-2.5 rounded-xl font-bold font-heading flex items-center gap-2 transition-all text-sm ${
                        activeMedia === "video"
                          ? theme.buttonPrimary
                          : theme.buttonSecondary
                      }`}
                      onClick={() => {
                        playSound()
                        setActiveMedia("video")
                      }}
                    >
                      <Video size={18} /> Video
                    </motion.button>
                  </div>
                )}

                <motion.div
                  className="mb-8 mt-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Year Badge */}
                  <div
                    className={`inline-flex items-center px-6 py-2 mb-6 shadow-sm transition-transform hover:scale-105 ${
                      isLandbouw
                        ? "rounded-md border-2 border-[#42301e] bg-[#5c7a4f] rotate-[-2deg] mask-border-rough"
                        : `rounded-full ${theme.accentBg}`
                    }`}
                  >
                    <span
                      className={`text-xl font-bold ${
                        isLandbouw ? "text-[#f0e6d2]" : theme.accent
                      } tracking-widest font-heading uppercase`}
                    >
                      {eventData.year}
                    </span>
                  </div>

                  <h1
                    className={`text-4xl lg:text-5xl font-bold mb-6 ${theme.heading} leading-tight tracking-tight font-heading`}
                  >
                    {eventData.title}
                  </h1>
                </motion.div>

                {eventData?.description && (
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <p className={`${theme.text} leading-relaxed text-lg`}>
                      {eventData.description}
                    </p>
                  </motion.div>
                )}

                <motion.div className="space-y-8 flex-grow">
                  {(() => {
                    const historicalContext =
                      eventData?.historicalContext ||
                      eventData?.historical_context ||
                      ""
                    if (!historicalContext || historicalContext.trim() === "")
                      return null
                    return (
                      <div className="mb-8">
                        <div
                          className={`flex items-center gap-2 ${theme.heading} font-bold text-xl mb-4 font-heading border-b ${theme.accentBorder} pb-2`}
                        >
                          <Clock size={24} />
                          <h3>Historische Context</h3>
                        </div>
                        <div
                          className={`${theme.cardBg} rounded-2xl p-6 border ${theme.cardBorder}`}
                        >
                          <p className={`${theme.text} leading-relaxed`}>
                            {historicalContext}
                          </p>
                        </div>
                      </div>
                    )
                  })()}

                  {/* Key Moments */}
                  {(eventData?.has_key_moments || keyMoments.length > 0) && (
                    <div className="mb-8">
                      <div
                        className={`flex items-center gap-2 ${theme.heading} font-bold text-xl mb-4 font-heading border-b ${theme.accentBorder} pb-2`}
                      >
                        <Clock size={24} />
                        <h3>Belangrijke momenten</h3>
                      </div>
                      {keyMoments.length > 0 ? (
                        <MiniTimeline
                          events={keyMoments}
                          activeYear={getActiveYear()}
                          variant={isLandbouw ? "landbouw" : "default"}
                        />
                      ) : (
                        <p className={`text-sm ${theme.textMuted} italic`}>
                          Geen momenten gevonden.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Extra Sections */}
                  {eventSections.map((section, index) => (
                    <div
                      key={index}
                      className={`${theme.cardBg} rounded-2xl p-6 border ${theme.cardBorder} mb-4`}
                    >
                      <h3 className={`text-xl font-bold ${theme.heading} mb-2`}>
                        {section.section_title}
                      </h3>
                      <p className={theme.text}>{section.section_content}</p>
                    </div>
                  ))}

                  {/* Game Button */}
                  <div className="mt-8 pt-4">
                    {eventData?.game_type === "puzzle" && (
                      <motion.button
                        className={`w-full py-4 rounded-xl font-bold font-heading flex items-center justify-center gap-3 shadow-lg ${theme.buttonPrimary}`}
                        onClick={handlePuzzleGame}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Puzzle size={24} />{" "}
                        {isLandbouw ? "Bekijk de Ploeg" : "Speel Puzzle"}
                      </motion.button>
                    )}
                    {eventData?.game_type === "memory" && (
                      <motion.button
                        className={`w-full py-4 rounded-xl font-bold font-heading flex items-center justify-center gap-3 shadow-lg ${theme.buttonPrimary}`}
                        onClick={handleMemoryGame}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Brain size={24} /> Speel Memory
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      <ImagePuzzleModal
        isOpen={isImagePuzzleModalOpen}
        onClose={handleCloseImagePuzzleModal}
        puzzleImage={puzzleImageUrl}
      />
      <MemoryGame
        isOpen={isMemoryGameModalOpen}
        onClose={handleCloseMemoryGameModal}
        images={
          galleryImages.length > 0
            ? galleryImages.map(img => img.src || img)
            : null
        }
      />
    </AnimatePresence>
  )
}

export default TimelineDetailModal
