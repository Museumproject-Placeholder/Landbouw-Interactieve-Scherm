/**
 * ImagePuzzleModal Component
 *
 * A modal popup containing a sliding puzzle game using image pieces instead of numbers.
 * The image is divided into a 3x3 grid where 8 pieces can be moved and 1 space is empty.
 *
 * Features:
 * - 3x3 grid sliding puzzle with image pieces
 * - Configurable source image
 * - Each tile shows the correct portion of the image
 * - CSS background-position used to display correct image fragment
 * - Drag and drop or click to move tiles
 * - Move counter and win detection
 * - Auto-shuffle when opened
 */

import React, { useState, useCallback, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Lightbulb, LightbulbOff, Grid3X3, ChevronDown } from "lucide-react"
import { splitImageIntoPieces, createImagePreview } from "../../utils/imageSplitter"

const ImagePuzzleModal = ({ isOpen, onClose, puzzleImage = "/images/puzzle-image.jpg" }) => {
  // Puzzle levels configuration
  const puzzleLevels = [
    {
      id: 1,
      name: "Bruine Koe",
      image: "./images/brown_cow_kids.jpg",
      gridSize: 3,
      difficulty: "3x3"
    },
    {
      id: 2,
      name: "Koe",
      image: "./images/cow_kids.jpg",
      gridSize: 3,
      difficulty: "3x3"
    },
    {
      id: 3,
      name: "Friese Paard",
      image: "./images/fries_pard_kids.jpg",
      gridSize: 3,
      difficulty: "3x3"
    },
    {
      id: 4,
      name: "Rode Boerderij",
      image: "./images/red_dutch_barn.jpg",
      gridSize: 3,
      difficulty: "3x3"
    },
    {
      id: 5,
      name: "Tractor",
      image: "./images/tractor_kids.jpg",
      gridSize: 3,
      difficulty: "3x3"
    }
  ]
  // Constants for puzzle configuration
  const GRID_SIZE = 3
  const TILE_COUNT = GRID_SIZE * GRID_SIZE - 1 // 8 image pieces + 1 empty space

  /**
   * Creates the initial solved state of the puzzle
   * @returns {Array} Array with numbers 1-8 and null for empty space
   */
  const createInitialState = () => {
    const tiles = []
    for (let i = 1; i <= TILE_COUNT; i++) {
      tiles.push(i)
    }
    tiles.push(null) // Empty space represented as null
    return tiles
  }

  /**
   * Shuffles the puzzle tiles by making random valid moves
   * This ensures the puzzle is always solvable
   * @param {Array} tiles - Current tile arrangement
   * @returns {Array} Shuffled tiles array
   */
  const shuffleTiles = tiles => {
    const shuffled = [...tiles]
    // Make 1000 random moves to shuffle thoroughly
    for (let i = 0; i < 1000; i++) {
      const emptyIndex = shuffled.indexOf(null)
      const neighbors = getNeighbors(emptyIndex, GRID_SIZE)
      const randomNeighbor =
        neighbors[Math.floor(Math.random() * neighbors.length)]
      ;[shuffled[emptyIndex], shuffled[randomNeighbor]] = [
        shuffled[randomNeighbor],
        shuffled[emptyIndex],
      ]
    }
    return shuffled
  }

  /**
   * Gets valid neighboring positions for a given tile index
   * @param {number} index - Current tile position (0-8)
   * @param {number} size - Grid size (3 for 3x3 grid)
   * @returns {Array} Array of valid neighbor indices
   */
  const getNeighbors = (index, size) => {
    const neighbors = []
    const row = Math.floor(index / size)
    const col = index % size

    // Add valid neighbors (not crossing grid boundaries)
    if (row > 0) neighbors.push(index - size) // Above
    if (row < size - 1) neighbors.push(index + size) // Below
    if (col > 0) neighbors.push(index - 1) // Left
    if (col < size - 1) neighbors.push(index + 1) // Right

    return neighbors
  }

  /**
   * Calculates the background position for an image piece
   * @param {number} pieceNumber - The piece number (1-8)
   * @returns {string} CSS background-position value
   */
  const getBackgroundPosition = (pieceNumber) => {
    if (pieceNumber === null) return "0 0"

    // Convert piece number to 0-based index
    const index = pieceNumber - 1
    const row = Math.floor(index / GRID_SIZE)
    const col = index % GRID_SIZE

    // Calculate percentage positions (each piece is 33.33% of the image)
    const x = col * -33.33
    const y = row * -33.33

    return `${x}% ${y}%`
  }

  /**
   * Gets the correct piece number that should be at given position
   * @param {number} position - Position index (0-8)
   * @returns {number|null} The piece number that belongs at this position
   */
  const getCorrectPieceForPosition = (position) => {
    // In solved state, position 0 should have piece 1, position 1 should have piece 2, etc.
    // Last position (8) should be null (empty)
    if (position === GRID_SIZE * GRID_SIZE - 1) return null
    return position + 1
  }

  /**
   * Checks if the correct piece for this position is currently being dragged
   * @param {number} position - Position index (0-8)
   * @returns {boolean} True if the correct piece is being dragged
   */
  const isCorrectPieceBeingDragged = (position) => {
    if (draggedTile === null) return false
    const correctPiece = getCorrectPieceForPosition(position)
    return tiles[draggedTile] === correctPiece
  }

  // Game state
  const [tiles, setTiles] = useState(() => shuffleTiles(createInitialState()))
  const [isWon, setIsWon] = useState(false)
  const [moves, setMoves] = useState(0)
  const [imagePieces, setImagePieces] = useState([])
  const [imagePreview, setImagePreview] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [draggedTile, setDraggedTile] = useState(null)
  const [hoveredTile, setHoveredTile] = useState(null)
  const [hintsEnabled, setHintsEnabled] = useState(false)
  const [correctPieces, setCorrectPieces] = useState(new Set())
  const [justPlacedCorrect, setJustPlacedCorrect] = useState(null)
  const [currentLevel, setCurrentLevel] = useState(null)
  const [showLevelSelector, setShowLevelSelector] = useState(false)
  const [gameMode, setGameMode] = useState('menu') // 'menu' or 'game'

  /**
   * Plays audio feedback
   * @param {string} type - Type of sound ('correct' or 'complete')
   */
  const playSound = (type) => {
    try {
      let audio
      if (type === 'correct') {
        audio = new Audio('./sounds/correct_sound.wav')
      } else if (type === 'complete') {
        audio = new Audio('./sounds/correct_sound.wav') // Same sound for now
      }

      if (audio) {
        audio.volume = 0.3 // Moderate volume
        audio.play().catch(e => console.log('Audio play failed:', e))
      }
    } catch (error) {
      console.log('Audio error:', error)
    }
  }

  /**
   * Calculates puzzle completion percentage
   * @returns {number} Percentage of correctly placed pieces (0-100)
   */
  const getProgress = useMemo(() => {
    const correctOrder = createInitialState()
    let correctCount = 0

    tiles.forEach((tile, index) => {
      if (tile === correctOrder[index] && tile !== null) {
        correctCount++
      }
    })

    return Math.round((correctCount / TILE_COUNT) * 100)
  }, [tiles])

  /**
   * Checks if the puzzle is in the winning state
   * @param {Array} currentTiles - Current tile arrangement to check
   * @returns {boolean} True if puzzle is solved
   */
  const checkWin = useCallback(currentTiles => {
    const correctOrder = createInitialState()
    return currentTiles.every((tile, index) => tile === correctOrder[index])
  }, [])

  /**
   * Handles tile movement when clicked
   * Only allows movement if tile is adjacent to empty space
   * @param {number} clickedIndex - Index of clicked tile
   */
  const moveTile = useCallback(clickedIndex => {
    const emptyIndex = tiles.indexOf(null)
    const neighbors = getNeighbors(emptyIndex, GRID_SIZE)

    if (neighbors.includes(clickedIndex)) {
      const newTiles = [...tiles]
      ;[newTiles[emptyIndex], newTiles[clickedIndex]] = [
        newTiles[clickedIndex],
        newTiles[emptyIndex],
      ]

      setTiles(newTiles)
      setMoves(prev => prev + 1)

      const correctOrder = createInitialState()
      const movedPiece = newTiles[emptyIndex]
      const isCorrect = movedPiece === correctOrder[emptyIndex] && movedPiece !== null

      if (isCorrect) {
        playSound('correct')
        setJustPlacedCorrect(emptyIndex)
        setTimeout(() => setJustPlacedCorrect(null), 1000)
      }

      if (checkWin(newTiles)) {
        setIsWon(true)
        playSound('complete')
      }
    }
  }, [tiles, checkWin])

  /**
   * Resets the game to a new shuffled state
   */
  const restartGame = () => {
    setTiles(shuffleTiles(createInitialState()))
    setIsWon(false)
    setMoves(0)
    setJustPlacedCorrect(null)
  }

  /**
   * Changes the puzzle level and resets the game
   */
  const changeLevel = (level) => {
    setCurrentLevel(level)
    setIsLoading(true)
    setTiles(shuffleTiles(createInitialState()))
    setIsWon(false)
    setMoves(0)
    setJustPlacedCorrect(null)
    setShowLevelSelector(false)
  }

  /**
   * Starts the game with selected level
   */
  const startGame = (level) => {
    setCurrentLevel(level)
    setGameMode('game')
    setIsLoading(true)
    setTiles(shuffleTiles(createInitialState()))
    setIsWon(false)
    setMoves(0)
    setJustPlacedCorrect(null)
  }

  /**
   * Returns to puzzle selection menu
   */
  const backToMenu = () => {
    setGameMode('menu')
    setCurrentLevel(null)
    setIsWon(false)
    setMoves(0)
  }

  /**
   * Enhanced drag and drop handlers - optimized
   */
  const handleDragStart = useCallback((e, index) => {
    e.dataTransfer.setData("text/plain", index.toString())
    setDraggedTile(index)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedTile(null)
    setHoveredTile(null)
  }, [])

  const handleDragOver = useCallback(e => {
    e.preventDefault()
  }, [])

  const handleDragEnter = useCallback((e, index) => {
    e.preventDefault()
    if (tiles[index] === null) {
      setHoveredTile(index)
    }
  }, [tiles])

  const handleDragLeave = useCallback(() => {
    setHoveredTile(null)
  }, [])

  const handleDrop = useCallback((e, dropIndex) => {
    e.preventDefault()
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"))

    setDraggedTile(null)
    setHoveredTile(null)

    if (tiles[dropIndex] === null) {
      moveTile(dragIndex)
    }
  }, [tiles, moveTile])

  // Touch events for mobile/touchscreen support - optimized
  const handleTouchStart = useCallback((e, index) => {
    if (tiles[index] === null) return
    setDraggedTile(index)
    const touch = e.touches[0]
    e.target.touchStartX = touch.clientX
    e.target.touchStartY = touch.clientY
  }, [tiles])

  const handleTouchMove = useCallback((e, index) => {
    if (draggedTile !== index) return
    e.preventDefault()
  }, [draggedTile])

  const handleTouchEnd = useCallback((e, index) => {
    if (draggedTile !== index) return

    const touch = e.changedTouches[0]
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)

    let targetTile = elementBelow
    while (targetTile && !targetTile.dataset.tileIndex) {
      targetTile = targetTile.parentElement
    }

    if (targetTile && targetTile.dataset.tileIndex) {
      const dropIndex = parseInt(targetTile.dataset.tileIndex)
      if (tiles[dropIndex] === null) {
        moveTile(index)
      }
    }

    setDraggedTile(null)
    setHoveredTile(null)
  }, [draggedTile, tiles, moveTile])

  /**
   * Load and split image when modal opens or image changes
   */
  useEffect(() => {
    if (isOpen && gameMode === 'game' && currentLevel?.image) {
      const loadImage = async () => {
        try {
          setIsLoading(true)

          // Split image into pieces
          const pieces = await splitImageIntoPieces(currentLevel.image, currentLevel.gridSize)
          setImagePieces(pieces)

          // Create preview
          const preview = await createImagePreview(currentLevel.image)
          setImagePreview(preview)

          // Reset game with new image
          restartGame()
        } catch (error) {
          console.error('Error loading puzzle image:', error)
          // Fallback to original background-position method if splitting fails
          setImagePieces([])
        } finally {
          setIsLoading(false)
        }
      }

      loadImage()
    }
  }, [isOpen, gameMode, currentLevel])

  /**
   * Reset to menu mode when modal opens
   */
  useEffect(() => {
    if (isOpen) {
      setGameMode('menu')
      setCurrentLevel(null)
    }
  }, [isOpen])

  /**
   * Reset game state when modal opens to ensure fresh start
   */
  useEffect(() => {
    if (isOpen && !isLoading && gameMode === 'game') {
      restartGame()
    }
  }, [isOpen, isLoading, gameMode])

  if (!isOpen) return null

  // PUZZLE SELECTION MENU COMPONENT
  const PuzzleSelectionMenu = () => (
    <div className="text-center">
      <motion.h1
        className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Kies je Puzzle
      </motion.h1>

      {/* Puzzle Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-6xl mx-auto">
        {puzzleLevels.map((level, index) => (
          <motion.div
            key={level.id}
            className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden hover:bg-white/20 transition-all duration-300 cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => startGame(level)}
          >
            {/* Preview Image */}
            <div className="h-48 bg-gray-700 relative overflow-hidden">
              <img
                src={level.image}
                alt={level.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Puzzle Info */}
            <div className="p-4">
              <h3 className="text-xl font-bold text-white mb-2">{level.name}</h3>
              <p className="text-cyan-300 font-medium">{level.difficulty}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  return (
    <AnimatePresence>
      {/* Modal Overlay - Dark background with blur effect */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose} // Close modal when clicking outside
      >
        {/* Main Modal Container */}
        <motion.div
          className="relative w-full max-w-7xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
        >
          {/* Close Button - Red X in top right */}
          <motion.button
            className="absolute top-6 right-6 z-10 w-12 h-12 bg-red-500/90 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
          >
            <X size={24} />
          </motion.button>

          {/* Conditional rendering based on game mode */}
          {gameMode === 'menu' ? (
            <PuzzleSelectionMenu />
          ) : (
            <>
              {/* Back to Menu Button - Top left when in game mode */}
              <motion.button
                className="absolute top-6 left-6 z-10 w-12 h-12 bg-gray-500/90 hover:bg-gray-600 rounded-full flex items-center justify-center text-white shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={backToMenu}
              >
                <ChevronDown size={20} className="rotate-90" />
              </motion.button>

              {/* Hints Toggle Button - Top left */}
              <motion.button
                className={`absolute top-6 left-20 z-10 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-colors ${
                  hintsEnabled
                    ? 'bg-yellow-500/90 hover:bg-yellow-600'
                    : 'bg-gray-500/90 hover:bg-gray-600'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setHintsEnabled(!hintsEnabled)}
              >
                {hintsEnabled ? <Lightbulb size={20} /> : <LightbulbOff size={20} />}
              </motion.button>

              {/* Level Selector Button */}
              <motion.button
                className="absolute top-6 left-32 z-10 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-colors bg-purple-500/90 hover:bg-purple-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowLevelSelector(!showLevelSelector)}
              >
                <Grid3X3 size={20} />
              </motion.button>

              {/* Game Content Container */}
              <div className="text-center">
            {/* Game Title */}
            <motion.h1
              className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Foto Schuifpuzzel
            </motion.h1>

            {/* Current Level Display */}
            <div className="mb-4">
              <motion.div
                className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-500/20 rounded-xl border border-purple-400/30 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-purple-300 font-medium">{currentLevel.name}</span>
                <span className="text-purple-400 text-sm">({currentLevel.difficulty})</span>
              </motion.div>
            </div>

            {/* Move Counter Display */}
            <div className="mb-4">
              <p className="text-lg font-semibold text-white/80">
                Zetten: <span className="text-cyan-300">{moves}</span>
              </p>
            </div>

            {/* Loading message */}
            {isLoading && (
              <div className="mb-6 p-4 bg-blue-500/20 rounded-lg border border-blue-400/30 backdrop-blur-sm">
                <p className="text-lg text-blue-300">
                  🔄 Foto wordt geladen...
                </p>
              </div>
            )}

            {/* Win Celebration Message - Only shown when puzzle is solved */}
            {isWon && (
              <motion.div
                className="mb-6 p-4 bg-green-500/20 rounded-lg border border-green-400/30 backdrop-blur-sm"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-xl font-bold text-green-300">
                  🎉 Gefeliciteerd! 🎉
                </p>
                <p className="text-green-200">
                  Je hebt de fotopuzzel voltooid in {moves} zetten!
                </p>
              </motion.div>
            )}

            {/* Main Game Area - Three column layout */}
            <div className="flex items-start justify-center gap-8 mb-6">
              {/* Image Preview - Left Side */}
              {imagePreview && !isLoading && (
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="p-3 bg-black/40 rounded-2xl border border-white/20 backdrop-blur-sm">
                    <img
                      src={imagePreview}
                      alt="Puzzle preview"
                      className="w-64 h-64 object-contain"
                    />
                  </div>
                  <p className="text-sm text-white/80 mt-2 font-medium">Origineel</p>
                </motion.div>
              )}

              {/* Puzzle Grid - Center */}
              <div className="grid grid-cols-3 gap-2 w-[32rem] h-[32rem] bg-black/50 p-3 rounded-lg backdrop-blur-sm border border-white/20">
              {/* Individual Puzzle Tiles */}
              {tiles.map((tile, index) => {
                const isEmptySpace = tile === null
                const isHovered = hoveredTile === index
                const isJustPlaced = justPlacedCorrect === index
                const isDragged = draggedTile === index
                const isHintTarget = hintsEnabled && isCorrectPieceBeingDragged(index)

                let tileClassName = "w-full h-full rounded-md overflow-hidden transition-all duration-200 select-none relative "

                if (isEmptySpace) {
                  if (isHovered) {
                    tileClassName += "bg-gradient-to-br from-green-500/30 to-blue-500/30 border-2 border-dashed border-green-400/60"
                  } else if (isHintTarget) {
                    tileClassName += "border-2 border-dashed border-yellow-400/80 animate-pulse"
                  } else {
                    tileClassName += "bg-black/30 border-2 border-dashed border-white/40"
                  }
                } else {
                  if (isJustPlaced) {
                    tileClassName += "border-2 border-green-400 bg-green-400/20"
                  } else if (isDragged) {
                    tileClassName += "border-2 border-cyan-400/80"
                  } else {
                    tileClassName += "border border-white/30 hover:border-cyan-400/60 cursor-grab active:cursor-grabbing"
                  }
                }

                return (
                <motion.div
                  key={index}
                  data-tile-index={index}
                  className={tileClassName}
                  style={{ touchAction: 'none' }} // Prevent scrolling on touch
                  draggable={tile !== null} // Only image pieces are draggable
                  onDragStart={e => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDragEnter={e => handleDragEnter(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={e => handleDrop(e, index)}
                  onTouchStart={e => handleTouchStart(e, index)}
                  onTouchMove={e => handleTouchMove(e, index)}
                  onTouchEnd={e => handleTouchEnd(e, index)}
                  whileHover={tile !== null && draggedTile !== index ? { scale: 1.02 } : undefined}
                  animate={
                    justPlacedCorrect === index
                      ? { scale: [1, 1.1, 1] }
                      : draggedTile === index
                      ? { scale: 1.05 }
                      : undefined
                  }
                  transition={{ duration: 0.2 }}
                >
                  {tile !== null ? (
                    <div className="w-full h-full relative">
                      {/* Use split image pieces if available, fallback to background-position */}
                      {imagePieces.length > 0 && imagePieces[tile - 1] ? (
                        <img
                          src={imagePieces[tile - 1]}
                          alt={`Puzzle piece ${tile}`}
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      ) : (
                        <div
                          className="w-full h-full bg-cover bg-no-repeat"
                          style={{
                            backgroundImage: `url(${puzzleImage})`,
                            backgroundPosition: getBackgroundPosition(tile),
                            backgroundSize: '300%', // 3x3 grid = 300%
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    /* Ghost preview for empty spaces when hints are enabled */
                    hintsEnabled && (
                      <div className="w-full h-full relative">
                        <div className="absolute inset-0 opacity-30">
                          {/* Show the correct piece that should go here */}
                          {(() => {
                            const correctPiece = getCorrectPieceForPosition(index)
                            if (correctPiece !== null && imagePieces.length > 0 && imagePieces[correctPiece - 1]) {
                              return (
                                <img
                                  src={imagePieces[correctPiece - 1]}
                                  alt={`Ghost piece ${correctPiece}`}
                                  className="w-full h-full object-cover"
                                  draggable={false}
                                />
                              )
                            } else if (correctPiece !== null) {
                              return (
                                <div
                                  className="w-full h-full bg-cover bg-no-repeat"
                                  style={{
                                    backgroundImage: `url(${puzzleImage})`,
                                    backgroundPosition: getBackgroundPosition(correctPiece),
                                    backgroundSize: '300%',
                                  }}
                                />
                              )
                            }
                            return null
                          })()}
                        </div>

                        {/* Subtle hint text */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-white/60 text-xs font-medium bg-black/30 px-2 py-1 rounded">
                            {getCorrectPieceForPosition(index)}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </motion.div>
                )
              })}
              </div>

              {/* Leaderboard - Right Side */}
              <motion.div
                className="flex flex-col w-72"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="p-4 bg-black/40 rounded-2xl border border-white/20 backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-white mb-4 text-center">
                    🏆 Beste Tijden
                  </h3>

                  <div className="space-y-3">
                    {/* Temporary leaderboard entries */}
                    <div className="flex justify-between items-center p-2 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-400 font-bold">🥇</span>
                        <span className="text-white text-sm">Emma</span>
                      </div>
                      <span className="text-yellow-400 font-bold text-sm">12 zetten</span>
                    </div>

                    <div className="flex justify-between items-center p-2 bg-gray-500/20 rounded-lg border border-gray-400/30">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 font-bold">🥈</span>
                        <span className="text-white text-sm">Lucas</span>
                      </div>
                      <span className="text-gray-400 font-bold text-sm">15 zetten</span>
                    </div>

                    <div className="flex justify-between items-center p-2 bg-orange-500/20 rounded-lg border border-orange-400/30">
                      <div className="flex items-center space-x-2">
                        <span className="text-orange-400 font-bold">🥉</span>
                        <span className="text-white text-sm">Sophie</span>
                      </div>
                      <span className="text-orange-400 font-bold text-sm">18 zetten</span>
                    </div>

                    <div className="flex justify-between items-center p-2 bg-white/10 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-white/60">4.</span>
                        <span className="text-white/80 text-sm">Milan</span>
                      </div>
                      <span className="text-white/60 text-sm">22 zetten</span>
                    </div>

                    <div className="flex justify-between items-center p-2 bg-white/10 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-white/60">5.</span>
                        <span className="text-white/80 text-sm">Anna</span>
                      </div>
                      <span className="text-white/60 text-sm">25 zetten</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 pt-3 border-t border-white/20">
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/80 text-sm">Voortgang:</span>
                        <span className="text-cyan-400 font-bold text-sm">{getProgress}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full shadow-lg"
                          style={{ width: `${getProgress}%` }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          transformOrigin="left"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-white/80 text-sm">Jouw score:</span>
                      <span className="text-cyan-400 font-bold">{moves} zetten</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Level Selector Dropdown */}
            <AnimatePresence>
              {showLevelSelector && (
                <motion.div
                  className="mb-6 relative"
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-black/50 backdrop-blur-xl rounded-2xl border border-white/20 p-4 max-w-md mx-auto">
                    <h3 className="text-lg font-bold text-white mb-3 text-center">Kies Niveau</h3>
                    <div className="space-y-2">
                      {puzzleLevels.map((level) => (
                        <motion.button
                          key={level.id}
                          className={`w-full p-3 rounded-xl text-left transition-colors ${
                            currentLevel.id === level.id
                              ? 'bg-purple-500/30 border border-purple-400/50 text-purple-200'
                              : 'bg-white/10 border border-white/20 text-white/80 hover:bg-white/20'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => changeLevel(level)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{level.name}</div>
                              <div className="text-sm opacity-70">{level.difficulty} • {level.gridSize}x{level.gridSize}</div>
                            </div>
                            {currentLevel.id === level.id && (
                              <div className="text-purple-400">✓</div>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Game Controls */}
            <div className="text-center">
              {/* Restart Game Button */}
              <motion.button
                onClick={restartGame}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg backdrop-blur-sm border border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                🔄 Nieuw Spel
              </motion.button>
            </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ImagePuzzleModal