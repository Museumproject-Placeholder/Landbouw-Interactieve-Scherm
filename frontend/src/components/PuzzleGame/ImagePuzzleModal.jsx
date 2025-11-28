/**
 * ImagePuzzleModal Component
 *
 * A sliding puzzle game with:
 * - 3x3 grid (8 pieces + 1 empty)
 * - Difficulty levels (Easy: max 2 correct, Hard: 0 correct)
 * - Hint button (limited uses)
 * - Green border on correctly placed tiles
 * - Separate leaderboards per difficulty
 * - Virtual keyboard for name entry
 */

import React, { useState, useCallback, useEffect, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, RotateCcw, Trophy, Lightbulb, Zap, Brain } from "lucide-react"
import {
  splitImageIntoPieces,
  createImagePreview,
} from "../../utils/imageSplitter"
import { getTheme } from "../../config/themes"
import { useSound } from "../../hooks/useSound"
import { api } from "../../services/api"
import VirtualKeyboard from "../Common/VirtualKeyboard"

const ImagePuzzleModal = ({ isOpen, onClose, puzzleImage }) => {
  const theme = getTheme()
  const playSound = useSound()
  const loadedPuzzleImageRef = useRef(null)

  // Constants
  const GRID_SIZE = 3
  const TILE_COUNT = GRID_SIZE * GRID_SIZE - 1
  const MAX_HINTS = 3

  // Difficulty state
  const [difficulty, setDifficulty] = useState(null) // null = selecting, 'easy' or 'hard'
  const [showDifficultySelect, setShowDifficultySelect] = useState(true)

  // Create initial solved state
  const createInitialState = useCallback(() => {
    const tiles = []
    for (let i = 1; i <= TILE_COUNT; i++) {
      tiles.push(i)
    }
    tiles.push(null)
    return tiles
  }, [TILE_COUNT])

  // Get neighbors for a tile
  const getNeighbors = useCallback(index => {
    const neighbors = []
    const row = Math.floor(index / GRID_SIZE)
    const col = index % GRID_SIZE

    if (row > 0) neighbors.push(index - GRID_SIZE)
    if (row < GRID_SIZE - 1) neighbors.push(index + GRID_SIZE)
    if (col > 0) neighbors.push(index - 1)
    if (col < GRID_SIZE - 1) neighbors.push(index + 1)

    return neighbors
  }, [])

  // Count correct tiles
  const countCorrectTiles = useCallback(tiles => {
    let count = 0
    for (let i = 0; i < tiles.length - 1; i++) {
      if (tiles[i] === i + 1) count++
    }
    return count
  }, [])

  // Shuffle tiles with difficulty control
  const shuffleTiles = useCallback(
    (tiles, targetDifficulty) => {
      let shuffled = [...tiles]
      let attempts = 0
      const maxAttempts = 1000

      while (attempts < maxAttempts) {
        // Do random shuffles
        const shuffleCount = targetDifficulty === "easy" ? 20 : 50
        shuffled = [...tiles]

        for (let i = 0; i < shuffleCount; i++) {
          const emptyIndex = shuffled.indexOf(null)
          const neighbors = getNeighbors(emptyIndex)
          const randomNeighbor =
            neighbors[Math.floor(Math.random() * neighbors.length)]
          ;[shuffled[emptyIndex], shuffled[randomNeighbor]] = [
            shuffled[randomNeighbor],
            shuffled[emptyIndex],
          ]
        }

        const correctCount = countCorrectTiles(shuffled)

        if (targetDifficulty === "easy") {
          // Easy: exactly 1 or 2 tiles correct
          if (correctCount >= 1 && correctCount <= 2) {
            return shuffled
          }
        } else {
          // Hard: 0 tiles correct
          if (correctCount === 0) {
            return shuffled
          }
        }

        attempts++
      }

      // Fallback: return whatever we have
      return shuffled
    },
    [getNeighbors, countCorrectTiles]
  )

  // Game state
  const [tiles, setTiles] = useState([])
  const [moves, setMoves] = useState(0)
  const [isWon, setIsWon] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [imagePieces, setImagePieces] = useState([])
  const [imagePreview, setImagePreview] = useState(null)

  // Hint state
  const [hintsRemaining, setHintsRemaining] = useState(MAX_HINTS)
  const [highlightedTile, setHighlightedTile] = useState(null)

  // Leaderboard state
  const [scoresEasy, setScoresEasy] = useState([])
  const [scoresHard, setScoresHard] = useState([])
  const [loadingScores, setLoadingScores] = useState(true)

  // Win/Save state
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [savedRank, setSavedRank] = useState(null)

  // Check if tile is in correct position
  const isTileCorrect = useCallback((tile, index) => {
    if (tile === null) return false
    return tile === index + 1
  }, [])

  // Check win
  const checkWin = useCallback(
    currentTiles => {
      const correctOrder = createInitialState()
      return currentTiles.every((tile, index) => tile === correctOrder[index])
    },
    [createInitialState]
  )

  // Calculate progress
  const progress = useMemo(() => {
    const correctOrder = createInitialState()
    let correct = 0
    tiles.forEach((tile, index) => {
      if (tile === correctOrder[index] && tile !== null) correct++
    })
    return Math.round((correct / TILE_COUNT) * 100)
  }, [tiles, createInitialState, TILE_COUNT])

  // Find a tile that can be moved to improve the puzzle
  const findHintMove = useCallback(() => {
    const emptyIndex = tiles.indexOf(null)
    const neighbors = getNeighbors(emptyIndex)

    for (const neighborIndex of neighbors) {
      const tile = tiles[neighborIndex]
      if (tile === emptyIndex + 1) {
        return neighborIndex
      }
    }

    for (const neighborIndex of neighbors) {
      const tile = tiles[neighborIndex]
      if (!isTileCorrect(tile, neighborIndex)) {
        return neighborIndex
      }
    }

    return neighbors[0]
  }, [tiles, getNeighbors, isTileCorrect])

  // Use hint
  const useHint = useCallback(() => {
    if (hintsRemaining <= 0 || isWon) return

    const hintTile = findHintMove()
    setHighlightedTile(hintTile)
    setHintsRemaining(prev => prev - 1)

    setTimeout(() => {
      setHighlightedTile(null)
    }, 2000)
  }, [hintsRemaining, isWon, findHintMove])

  // Handle tile click
  const handleTileClick = useCallback(
    clickedIndex => {
      if (isWon) return

      const emptyIndex = tiles.indexOf(null)
      const neighbors = getNeighbors(emptyIndex)

      if (neighbors.includes(clickedIndex)) {
        playSound()
        const newTiles = [...tiles]
        ;[newTiles[emptyIndex], newTiles[clickedIndex]] = [
          newTiles[clickedIndex],
          newTiles[emptyIndex],
        ]
        setTiles(newTiles)
        setMoves(prev => prev + 1)
        setHighlightedTile(null)

        if (checkWin(newTiles)) {
          setIsWon(true)
        }
      }
    },
    [tiles, isWon, getNeighbors, playSound, checkWin]
  )

  // Start game with selected difficulty
  const startGame = useCallback(
    selectedDifficulty => {
      setDifficulty(selectedDifficulty)
      setShowDifficultySelect(false)
      const initial = createInitialState()
      setTiles(shuffleTiles(initial, selectedDifficulty))
      setMoves(0)
      setIsWon(false)
      setHintsRemaining(selectedDifficulty === "easy" ? MAX_HINTS : 1) // Less hints for hard
      setHighlightedTile(null)
      setSavedRank(null)
      setSaveError("")
    },
    [createInitialState, shuffleTiles]
  )

  // Reset game (restart with same difficulty)
  const resetGame = useCallback(() => {
    if (difficulty) {
      const initial = createInitialState()
      setTiles(shuffleTiles(initial, difficulty))
      setMoves(0)
      setIsWon(false)
      setHintsRemaining(difficulty === "easy" ? MAX_HINTS : 1)
      setHighlightedTile(null)
      setSavedRank(null)
      setSaveError("")
    }
  }, [difficulty, createInitialState, shuffleTiles])

  // Go back to difficulty selection
  const changeDifficulty = useCallback(() => {
    setShowDifficultySelect(true)
    setDifficulty(null)
    setIsWon(false)
    setMoves(0)
    setSavedRank(null)
  }, [])

  // Fetch leaderboards
  const fetchScores = useCallback(async () => {
    setLoadingScores(true)
    try {
      const [easyResult, hardResult] = await Promise.all([
        api.getPuzzleScores("easy"),
        api.getPuzzleScores("hard"),
      ])
      if (easyResult.success) setScoresEasy(easyResult.scores || [])
      if (hardResult.success) setScoresHard(hardResult.scores || [])
    } catch (error) {
      console.error("Failed to fetch scores:", error)
    } finally {
      setLoadingScores(false)
    }
  }, [])

  // Save score
  const handleSaveScore = useCallback(
    async playerName => {
      setSaveError("")
      try {
        const result = await api.savePuzzleScore(playerName, moves, difficulty)
        if (result.success) {
          setSavedRank(result.rank)
          // Refresh scores
          fetchScores()
          setShowKeyboard(false)
        } else {
          setSaveError(result.message || "Kon score niet opslaan")
        }
      } catch (error) {
        setSaveError("Kon score niet opslaan. Probeer opnieuw.")
      }
    },
    [moves, difficulty, fetchScores]
  )

  // Get background position for tile
  const getBackgroundPosition = useCallback(pieceNumber => {
    if (pieceNumber === null) return "0 0"
    const index = pieceNumber - 1
    const row = Math.floor(index / GRID_SIZE)
    const col = index % GRID_SIZE
    return `${col * 50}% ${row * 50}%`
  }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      // Also prevent touch scrolling on touch devices
      document.body.style.position = "fixed"
      document.body.style.width = "100%"
    } else {
      document.body.style.overflow = "unset"
      document.body.style.position = "unset"
      document.body.style.width = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
      document.body.style.position = "unset"
      document.body.style.width = "unset"
    }
  }, [isOpen])

  // Load image when modal opens
  useEffect(() => {
    if (isOpen && puzzleImage && loadedPuzzleImageRef.current !== puzzleImage) {
      fetchScores()
      setLoadError(null)
      setShowDifficultySelect(true)
      setDifficulty(null)

      const loadImage = async () => {
        try {
          setIsLoading(true)
          const pieces = await splitImageIntoPieces(puzzleImage, GRID_SIZE)
          setImagePieces(pieces)
          const preview = await createImagePreview(puzzleImage)
          setImagePreview(preview)
          loadedPuzzleImageRef.current = puzzleImage
        } catch (error) {
          console.error("Error loading puzzle image:", error)
          setLoadError({ message: error.message, url: puzzleImage })
          setImagePieces([])
          loadedPuzzleImageRef.current = puzzleImage
        } finally {
          setIsLoading(false)
        }
      }
      loadImage()
    }
  }, [isOpen, puzzleImage, fetchScores])

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      loadedPuzzleImageRef.current = null
      setIsWon(false)
      setMoves(0)
      setLoadError(null)
      setSavedRank(null)
      setSaveError("")
      setShowKeyboard(false)
      setHintsRemaining(MAX_HINTS)
      setHighlightedTile(null)
      setShowDifficultySelect(true)
      setDifficulty(null)
    }
  }, [isOpen])

  // Get current scores based on difficulty
  const currentScores = difficulty === "easy" ? scoresEasy : scoresHard

  if (!isOpen || !puzzleImage) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="relative bg-[#f3f2e9] rounded-3xl shadow-2xl w-[98vw] max-w-7xl max-h-[98vh] flex flex-col overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-[#c9a300] to-[#a68600]">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-white">
                  Foto Schuifpuzzel
                </h2>
                {difficulty && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      difficulty === "easy"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {difficulty === "easy" ? "Makkelijk" : "Moeilijk"}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {!showDifficultySelect && (
                  <>
                    <div className="text-white text-lg font-bold">
                      Zetten: <span className="text-yellow-200">{moves}</span>
                    </div>

                    {/* Hint Button */}
                    <motion.button
                      className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors ${
                        hintsRemaining > 0 && !isWon
                          ? "bg-white/20 hover:bg-white/30 text-white"
                          : "bg-white/10 text-white/50 cursor-not-allowed"
                      }`}
                      onClick={useHint}
                      disabled={hintsRemaining <= 0 || isWon}
                      whileHover={hintsRemaining > 0 ? { scale: 1.05 } : {}}
                      whileTap={hintsRemaining > 0 ? { scale: 0.95 } : {}}
                    >
                      <Lightbulb size={20} />
                      <span>{hintsRemaining}</span>
                    </motion.button>

                    {/* Change Difficulty Button */}
                    <motion.button
                      className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors font-medium text-sm"
                      onClick={changeDifficulty}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Terug
                    </motion.button>

                    <motion.button
                      className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
                      onClick={resetGame}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <RotateCcw size={24} />
                    </motion.button>
                  </>
                )}

                <motion.button
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={28} />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4 lg:p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin w-16 h-16 border-4 border-[#c9a300] border-t-transparent rounded-full" />
                </div>
              ) : loadError ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <p className="text-red-500 text-xl">
                    Kon afbeelding niet laden
                  </p>
                  <p className="text-gray-500 text-sm">{loadError.message}</p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-[#c9a300] text-white rounded-xl font-bold"
                  >
                    Sluiten
                  </button>
                </div>
              ) : showDifficultySelect ? (
                /* Difficulty Selection Screen - Simple */
                <div className="flex flex-col items-center justify-center h-full gap-10">
                  <h3 className="text-3xl lg:text-4xl font-bold text-[#440f0f]">
                    Kies je niveau
                  </h3>

                  <div className="flex gap-8">
                    {/* Easy Button */}
                    <motion.button
                      className="flex flex-col items-center justify-center gap-2 w-48 h-48 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl shadow-xl text-white"
                      onClick={() => startGame("easy")}
                      whileHover={{ scale: 1.08, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Zap size={56} />
                      <span className="text-2xl font-bold">Makkelijk</span>
                    </motion.button>

                    {/* Hard Button */}
                    <motion.button
                      className="flex flex-col items-center justify-center gap-2 w-48 h-48 bg-gradient-to-br from-red-400 to-red-600 rounded-3xl shadow-xl text-white"
                      onClick={() => startGame("hard")}
                      whileHover={{ scale: 1.08, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Brain size={56} />
                      <span className="text-2xl font-bold">Moeilijk</span>
                    </motion.button>
                  </div>
                </div>
              ) : isWon ? (
                /* Win Screen */
                <motion.div
                  className="flex flex-col items-center justify-center h-full gap-6"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Trophy size={120} className="text-[#c9a300]" />
                  </motion.div>
                  <h3 className="text-4xl lg:text-5xl font-bold text-[#440f0f]">
                    Gefeliciteerd!
                  </h3>
                  <p className="text-xl lg:text-2xl text-[#657575]">
                    Je hebt de puzzel opgelost in{" "}
                    <span className="font-bold text-[#c9a300]">{moves}</span>{" "}
                    zetten!
                  </p>
                  <p className="text-lg text-[#657575]">
                    Niveau:{" "}
                    <span
                      className={`font-bold ${
                        difficulty === "easy"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {difficulty === "easy" ? "Makkelijk" : "Moeilijk"}
                    </span>
                  </p>

                  {savedRank ? (
                    <div className="text-center">
                      <p className="text-2xl text-green-600 font-bold mb-4">
                        🎉 Je staat op plaats #{savedRank}!
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <motion.button
                        className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-bold text-lg shadow-lg"
                        onClick={() => setShowKeyboard(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        📝 Score Opslaan
                      </motion.button>
                      {saveError && <p className="text-red-500">{saveError}</p>}
                    </div>
                  )}

                  <div className="flex gap-4 mt-4">
                    <motion.button
                      className="px-6 py-3 bg-gradient-to-r from-[#c9a300] to-[#a68600] text-white rounded-2xl font-bold shadow-lg"
                      onClick={resetGame}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🔄 Opnieuw
                    </motion.button>
                    <motion.button
                      className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-2xl font-bold shadow-lg"
                      onClick={changeDifficulty}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Terug
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                /* Game Board */
                <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
                  {/* Preview - always visible */}
                  {imagePreview && (
                    <div className="flex-shrink-0">
                      <div className="p-4 bg-white rounded-2xl shadow-lg border-4 border-[#c9a300]">
                        <img
                          src={imagePreview}
                          alt="Origineel"
                          className="w-72 h-72 object-cover rounded-xl"
                        />
                        <p className="text-center text-base text-[#657575] mt-3 font-semibold">
                          Origineel
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Puzzle Grid - 3x3 */}
                  <div className="grid grid-cols-3 gap-3 p-5 bg-[#440f0f]/10 rounded-2xl">
                    {tiles.map((tile, index) => {
                      const isCorrect = isTileCorrect(tile, index)
                      const isHighlighted = highlightedTile === index

                      return (
                        <motion.div
                          key={index}
                          className={`w-32 h-32 lg:w-40 lg:h-40 rounded-xl cursor-pointer overflow-hidden relative ${
                            tile === null
                              ? "bg-[#440f0f]/20 border-3 border-dashed border-[#440f0f]/30"
                              : isHighlighted
                              ? "shadow-xl border-4 border-yellow-400 ring-4 ring-yellow-300/50"
                              : isCorrect
                              ? "shadow-lg border-4 border-green-500"
                              : "shadow-lg border-3 border-white hover:border-[#c9a300]"
                          }`}
                          onClick={() => handleTileClick(index)}
                          whileHover={tile !== null ? { scale: 1.02 } : {}}
                          whileTap={tile !== null ? { scale: 0.98 } : {}}
                          layout
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        >
                          {tile !== null && (
                            <>
                              {imagePieces.length > 0 &&
                              imagePieces[tile - 1] ? (
                                <img
                                  src={imagePieces[tile - 1]}
                                  alt={`Piece ${tile}`}
                                  className="w-full h-full object-cover"
                                  draggable={false}
                                />
                              ) : (
                                <div
                                  className="w-full h-full bg-cover bg-no-repeat"
                                  style={{
                                    backgroundImage: `url(${puzzleImage})`,
                                    backgroundPosition:
                                      getBackgroundPosition(tile),
                                    backgroundSize: "300%",
                                  }}
                                />
                              )}
                              {isCorrect && (
                                <div className="absolute top-1 right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                                  <span className="text-white text-sm">✓</span>
                                </div>
                              )}
                            </>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Leaderboard */}
                  <div className="flex-shrink-0 w-72">
                    <div className="bg-white rounded-2xl shadow-lg p-5 border border-[#a7b8b4]/30">
                      <h3 className="text-lg font-bold text-[#440f0f] mb-4 flex items-center gap-2">
                        <Trophy
                          size={20}
                          className={
                            difficulty === "easy"
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        />
                        Beste Scores (
                        {difficulty === "easy" ? "Makkelijk" : "Moeilijk"})
                      </h3>

                      {loadingScores ? (
                        <div className="text-center py-4 text-[#657575]">
                          Laden...
                        </div>
                      ) : currentScores.length === 0 ? (
                        <div className="text-center py-4 text-[#657575]">
                          Nog geen scores
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {currentScores.slice(0, 5).map((score, index) => (
                            <div
                              key={index}
                              className={`flex items-center justify-between p-2.5 rounded-lg ${
                                index === 0
                                  ? "bg-yellow-50 border border-yellow-200"
                                  : index === 1
                                  ? "bg-gray-50 border border-gray-200"
                                  : index === 2
                                  ? "bg-orange-50 border border-orange-200"
                                  : "bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-base font-bold ${
                                    index === 0
                                      ? "text-yellow-500"
                                      : index === 1
                                      ? "text-gray-400"
                                      : index === 2
                                      ? "text-orange-400"
                                      : "text-[#657575]"
                                  }`}
                                >
                                  {index === 0
                                    ? "🥇"
                                    : index === 1
                                    ? "🥈"
                                    : index === 2
                                    ? "🥉"
                                    : `${index + 1}.`}
                                </span>
                                <span className="font-medium text-[#440f0f] text-sm">
                                  {score.player_name}
                                </span>
                              </div>
                              <span
                                className={`font-bold text-sm ${
                                  index === 0
                                    ? "text-yellow-600"
                                    : index === 1
                                    ? "text-gray-500"
                                    : index === 2
                                    ? "text-orange-500"
                                    : "text-[#657575]"
                                }`}
                              >
                                {score.moves}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Progress */}
                      <div className="mt-4 pt-4 border-t border-[#a7b8b4]/30">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-[#657575]">Voortgang:</span>
                          <span className="font-bold text-[#c9a300]">
                            {progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-[#c9a300] to-[#a68600] rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <div className="flex justify-between text-sm mt-3">
                          <span className="text-[#657575]">Jouw score:</span>
                          <span className="font-bold text-[#c9a300]">
                            {moves} zetten
                          </span>
                        </div>
                      </div>

                      {/* Change difficulty button */}
                      <motion.button
                        className="w-full mt-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-[#657575] transition-colors"
                        onClick={changeDifficulty}
                        whileTap={{ scale: 0.98 }}
                      >
                        Ander niveau kiezen
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Virtual Keyboard */}
          <VirtualKeyboard
            isOpen={showKeyboard}
            onClose={() => setShowKeyboard(false)}
            onSubmit={handleSaveScore}
            maxLength={10}
            title="Voer je naam in"
            placeholder="Bijv. Emma"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ImagePuzzleModal
