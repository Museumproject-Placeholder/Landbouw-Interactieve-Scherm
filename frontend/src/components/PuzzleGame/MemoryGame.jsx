/**
 * MemoryGame Component
 *
 * A memory card matching game with:
 * - Grid of cards with emoji images
 * - Fixed card flip animation
 * - Database-connected leaderboard
 * - Virtual keyboard for name entry
 */

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, RotateCcw, Trophy, Clock } from "lucide-react"
import { getTheme } from "../../config/themes"
import { useSound } from "../../hooks/useSound"
import { api } from "../../services/api"
import VirtualKeyboard from "../Common/VirtualKeyboard"

// Default images for memory game (agricultural/farming themed)
const DEFAULT_MEMORY_IMAGES = [
  "🌾", // Grain
  "🚜", // Tractor
  "🐄", // Cow
  "🐷", // Pig
  "🐔", // Chicken
  "🌽", // Corn
  "🥛", // Milk
  "🥚", // Egg
]

const MemoryGame = ({ isOpen, onClose, images = null }) => {
  const theme = getTheme()
  const playSound = useSound()

  // Game mode state
  const [gameMode, setGameMode] = useState(null) // null = selection, 1 = single, 2 = two players

  // Single player game state
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedPairs, setMatchedPairs] = useState([])
  const [moves, setMoves] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)

  // Two players game state (race mode - split screen)
  const [player1Cards, setPlayer1Cards] = useState([])
  const [player1FlippedCards, setPlayer1FlippedCards] = useState([])
  const [player1MatchedPairs, setPlayer1MatchedPairs] = useState([])
  const [player1Moves, setPlayer1Moves] = useState(0)
  const [player1Started, setPlayer1Started] = useState(false)
  const [player1Won, setPlayer1Won] = useState(false)
  const [player1Time, setPlayer1Time] = useState(0)

  const [player2Cards, setPlayer2Cards] = useState([])
  const [player2FlippedCards, setPlayer2FlippedCards] = useState([])
  const [player2MatchedPairs, setPlayer2MatchedPairs] = useState([])
  const [player2Moves, setPlayer2Moves] = useState(0)
  const [player2Started, setPlayer2Started] = useState(false)
  const [player2Won, setPlayer2Won] = useState(false)
  const [player2Time, setPlayer2Time] = useState(0)

  const [raceWinner, setRaceWinner] = useState(null) // null, 1, or 2

  // Leaderboard state
  const [scores, setScores] = useState([])
  const [loadingScores, setLoadingScores] = useState(true)

  // Win screen state
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [savedRank, setSavedRank] = useState(null)
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  // Use provided images or default emoji images
  const gameImages = useMemo(() => {
    const pairs = []
    const imageSet = images && Array.isArray(images) && images.length >= 4 
      ? images.slice(0, 8) 
      : DEFAULT_MEMORY_IMAGES
    
    imageSet.forEach((img, index) => {
      pairs.push({ id: index * 2, image: img, type: index })
      pairs.push({ id: index * 2 + 1, image: img, type: index })
    })
    return pairs
  }, [images])

  // Shuffle cards
  const shuffleCards = useCallback((cardsArray) => {
    const shuffled = [...cardsArray]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled.map((card, index) => ({
      ...card,
      id: index,
    }))
  }, [])

  // Reset game
  const resetGame = useCallback(() => {
    const shuffled = shuffleCards(gameImages)
    
    // Reset single player state
    setCards(shuffled)
    setFlippedCards([])
    setMatchedPairs([])
    setMoves(0)
    setGameStarted(false)
    setGameWon(false)
    setTimeElapsed(0)
    
    // Reset two players state
    setPlayer1Cards(shuffled)
    setPlayer1FlippedCards([])
    setPlayer1MatchedPairs([])
    setPlayer1Moves(0)
    setPlayer1Started(false)
    setPlayer1Won(false)
    setPlayer1Time(0)
    
    setPlayer2Cards(shuffled)
    setPlayer2FlippedCards([])
    setPlayer2MatchedPairs([])
    setPlayer2Moves(0)
    setPlayer2Started(false)
    setPlayer2Won(false)
    setPlayer2Time(0)
    
    setRaceWinner(null)
    setSavedRank(null)
    setSaveError("")
    setShowLeaderboard(false)
    setGameMode(null)
  }, [gameImages, shuffleCards])

  // Start game with selected mode
  const startGame = useCallback((mode) => {
    const shuffled = shuffleCards(gameImages)
    
    if (mode === 1) {
      // Single player mode
      setCards(shuffled)
      setFlippedCards([])
      setMatchedPairs([])
      setMoves(0)
      setGameStarted(false)
      setGameWon(false)
      setTimeElapsed(0)
    } else if (mode === 2) {
      // Two players race mode - both get the same shuffled cards
      setPlayer1Cards(shuffled)
      setPlayer1FlippedCards([])
      setPlayer1MatchedPairs([])
      setPlayer1Moves(0)
      setPlayer1Started(false)
      setPlayer1Won(false)
      setPlayer1Time(0)
      
      setPlayer2Cards(shuffled)
      setPlayer2FlippedCards([])
      setPlayer2MatchedPairs([])
      setPlayer2Moves(0)
      setPlayer2Started(false)
      setPlayer2Won(false)
      setPlayer2Time(0)
      
      setRaceWinner(null)
    }
    
    setSavedRank(null)
    setSaveError("")
    setShowLeaderboard(false)
    setGameMode(mode)
  }, [gameImages, shuffleCards])

  // Fetch leaderboard
  const fetchScores = useCallback(async () => {
    setLoadingScores(true)
    try {
      const result = await api.getMemoryScores()
      if (result.success) {
        setScores(result.scores || [])
      }
    } catch (error) {
      console.error("Failed to fetch scores:", error)
    } finally {
      setLoadingScores(false)
    }
  }, [])

  // Save score
  const handleSaveScore = useCallback(async (playerName) => {
    setSaveError("")
    try {
      const result = await api.saveMemoryScore(playerName, moves, timeElapsed)
      if (result.success) {
        setSavedRank(result.rank)
        setScores(result.scores || [])
        setShowKeyboard(false)
      } else {
        setSaveError(result.message || "Failed to save score")
      }
    } catch (error) {
      setSaveError("Failed to save score. Try again.")
    }
  }, [moves, timeElapsed])

  // Initialize
  useEffect(() => {
    if (isOpen) {
      resetGame()
      fetchScores()
    }
  }, [isOpen])

  // Timer for single player
  useEffect(() => {
    let interval = null
    if (gameMode === 1 && gameStarted && !gameWon && isOpen) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameMode, gameStarted, gameWon, isOpen])

  // Timer for player 1 (two players mode)
  useEffect(() => {
    let interval = null
    if (gameMode === 2 && player1Started && !player1Won && !raceWinner && isOpen) {
      interval = setInterval(() => {
        setPlayer1Time((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameMode, player1Started, player1Won, raceWinner, isOpen])

  // Timer for player 2 (two players mode)
  useEffect(() => {
    let interval = null
    if (gameMode === 2 && player2Started && !player2Won && !raceWinner && isOpen) {
      interval = setInterval(() => {
        setPlayer2Time((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameMode, player2Started, player2Won, raceWinner, isOpen])

  // Check if card is flipped or matched (single player)
  const isCardFlipped = useCallback((cardId) => {
    return flippedCards.includes(cardId) || matchedPairs.flat().includes(cardId)
  }, [flippedCards, matchedPairs])

  // Check if card is flipped or matched (player 1)
  const isPlayer1CardFlipped = useCallback((cardId) => {
    return player1FlippedCards.includes(cardId) || player1MatchedPairs.flat().includes(cardId)
  }, [player1FlippedCards, player1MatchedPairs])

  // Check if card is flipped or matched (player 2)
  const isPlayer2CardFlipped = useCallback((cardId) => {
    return player2FlippedCards.includes(cardId) || player2MatchedPairs.flat().includes(cardId)
  }, [player2FlippedCards, player2MatchedPairs])

  // Handle card click (single player)
  const handleCardClick = useCallback((cardId) => {
    if (gameMode !== 1) return
    if (flippedCards.length >= 2 || gameWon) return
    if (isCardFlipped(cardId)) return

    playSound()

    if (!gameStarted) {
      setGameStarted(true)
    }

    const newFlipped = [...flippedCards, cardId]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      const [firstId, secondId] = newFlipped
      const firstCard = cards.find((c) => c.id === firstId)
      const secondCard = cards.find((c) => c.id === secondId)

      setMoves((prev) => prev + 1)

      if (firstCard.type === secondCard.type) {
        setTimeout(() => {
          const newMatchedPairs = [...matchedPairs, [firstId, secondId]]
          setMatchedPairs(newMatchedPairs)
          setFlippedCards([])

          if (newMatchedPairs.length === gameImages.length / 2) {
            setGameWon(true)
          }
        }, 600)
      } else {
        setTimeout(() => {
          setFlippedCards([])
        }, 1000)
      }
    }
  }, [gameMode, flippedCards, cards, matchedPairs, gameWon, gameStarted, gameImages.length, playSound, isCardFlipped])

  // Handle card click (player 1 - race mode)
  const handlePlayer1CardClick = useCallback((cardId) => {
    if (gameMode !== 2) return
    if (player1FlippedCards.length >= 2 || player1Won || raceWinner) return
    if (isPlayer1CardFlipped(cardId)) return

    playSound()

    if (!player1Started) {
      setPlayer1Started(true)
    }

    const newFlipped = [...player1FlippedCards, cardId]
    setPlayer1FlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      const [firstId, secondId] = newFlipped
      const firstCard = player1Cards.find((c) => c.id === firstId)
      const secondCard = player1Cards.find((c) => c.id === secondId)

      setPlayer1Moves((prev) => prev + 1)

      if (firstCard.type === secondCard.type) {
        setTimeout(() => {
          const newMatchedPairs = [...player1MatchedPairs, [firstId, secondId]]
          setPlayer1MatchedPairs(newMatchedPairs)
          setPlayer1FlippedCards([])

          if (newMatchedPairs.length === gameImages.length / 2) {
            setPlayer1Won(true)
            setRaceWinner(1)
          }
        }, 600)
      } else {
        setTimeout(() => {
          setPlayer1FlippedCards([])
        }, 1000)
      }
    }
  }, [gameMode, player1FlippedCards, player1Cards, player1MatchedPairs, player1Won, player1Started, gameImages.length, playSound, isPlayer1CardFlipped, raceWinner])

  // Handle card click (player 2 - race mode)
  const handlePlayer2CardClick = useCallback((cardId) => {
    if (gameMode !== 2) return
    if (player2FlippedCards.length >= 2 || player2Won || raceWinner) return
    if (isPlayer2CardFlipped(cardId)) return

    playSound()

    if (!player2Started) {
      setPlayer2Started(true)
    }

    const newFlipped = [...player2FlippedCards, cardId]
    setPlayer2FlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      const [firstId, secondId] = newFlipped
      const firstCard = player2Cards.find((c) => c.id === firstId)
      const secondCard = player2Cards.find((c) => c.id === secondId)

      setPlayer2Moves((prev) => prev + 1)

      if (firstCard.type === secondCard.type) {
        setTimeout(() => {
          const newMatchedPairs = [...player2MatchedPairs, [firstId, secondId]]
          setPlayer2MatchedPairs(newMatchedPairs)
          setPlayer2FlippedCards([])

          if (newMatchedPairs.length === gameImages.length / 2) {
            setPlayer2Won(true)
            setRaceWinner(2)
          }
        }, 600)
      } else {
        setTimeout(() => {
          setPlayer2FlippedCards([])
        }, 1000)
      }
    }
  }, [gameMode, player2FlippedCards, player2Cards, player2MatchedPairs, player2Won, player2Started, gameImages.length, playSound, isPlayer2CardFlipped, raceWinner])

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="relative bg-[#f3f2e9] rounded-3xl shadow-2xl w-[98vw] max-w-6xl max-h-[95vh] flex flex-col overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-[#22c55e] to-[#16a34a]">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-white">
                  Memory Spel
                </h2>
                {gameMode === 2 && (
                  <div className="flex items-center gap-4 ml-4">
                    <div className={`px-4 py-2 rounded-xl ${player1Won ? 'bg-yellow-400/50' : raceWinner === 1 ? 'bg-yellow-400/50' : 'bg-white/20'}`}>
                      <span className="text-white font-bold">Speler 1: {player1MatchedPairs.length}/{gameImages.length / 2}</span>
                    </div>
                    <div className={`px-4 py-2 rounded-xl ${player2Won ? 'bg-yellow-400/50' : raceWinner === 2 ? 'bg-yellow-400/50' : 'bg-white/20'}`}>
                      <span className="text-white font-bold">Speler 2: {player2MatchedPairs.length}/{gameImages.length / 2}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {gameMode === 1 && (
                  <div className="text-white text-lg font-bold flex items-center gap-4">
                    <span>Zetten: <span className="text-green-200">{moves}</span></span>
                    <span className="flex items-center gap-1">
                      <Clock size={18} />
                      <span className="text-green-200">{formatTime(timeElapsed)}</span>
                    </span>
                  </div>
                )}

                <motion.button
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
                  onClick={resetGame}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <RotateCcw size={24} />
                </motion.button>

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
            <div className="flex-1 overflow-auto p-6 lg:p-8">
              {gameMode === null ? (
                /* Mode Selection Screen */
                <div className="flex flex-col items-center justify-center h-full gap-10">
                  <h3 className="text-3xl lg:text-4xl font-bold text-[#440f0f]">
                    Kies je spelmodus
                  </h3>

                  <div className="flex gap-8">
                    {/* Single Player Button */}
                    <motion.button
                      className="flex flex-col items-center justify-center gap-3 w-64 h-64 bg-gradient-to-br from-[#22c55e] to-[#16a34a] rounded-3xl shadow-xl text-white"
                      onClick={() => startGame(1)}
                      whileHover={{ scale: 1.08, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-6xl">👤</span>
                      <span className="text-2xl font-bold">1 Speler</span>
                      <span className="text-sm opacity-90">Speel alleen</span>
                    </motion.button>

                    {/* Two Players Button */}
                    <motion.button
                      className="flex flex-col items-center justify-center gap-3 w-64 h-64 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-xl text-white"
                      onClick={() => startGame(2)}
                      whileHover={{ scale: 1.08, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-6xl">👥</span>
                      <span className="text-2xl font-bold">2 Spelers</span>
                      <span className="text-sm opacity-90">Speel tegen elkaar</span>
                    </motion.button>
                  </div>
                </div>
              ) : (gameWon || raceWinner !== null) ? (
                /* Win Screen */
                <motion.div
                  className="flex flex-col items-center justify-center h-full gap-6"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {showLeaderboard ? (
                    /* Leaderboard View */
                    <div className="w-full max-w-md">
                      <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#a7b8b4]/30">
                        <h3 className="text-xl font-bold text-[#440f0f] mb-4 flex items-center gap-2">
                          <Trophy size={24} className="text-[#22c55e]" />
                          Beste Scores
                        </h3>

                        {loadingScores ? (
                          <div className="text-center py-4 text-[#657575]">Laden...</div>
                        ) : scores.length === 0 ? (
                          <div className="text-center py-4 text-[#657575]">Nog geen scores</div>
                        ) : (
                          <div className="space-y-2">
                            {scores.slice(0, 10).map((score, index) => (
                              <div
                                key={index}
                                className={`flex items-center justify-between p-3 rounded-lg ${
                                  index === 0 ? 'bg-yellow-50 border border-yellow-200' :
                                  index === 1 ? 'bg-gray-50 border border-gray-200' :
                                  index === 2 ? 'bg-orange-50 border border-orange-200' :
                                  'bg-gray-50'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className={`text-lg font-bold ${
                                    index === 0 ? 'text-yellow-500' :
                                    index === 1 ? 'text-gray-400' :
                                    index === 2 ? 'text-orange-400' :
                                    'text-[#657575]'
                                  }`}>
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                                  </span>
                                  <span className="font-medium text-[#440f0f]">{score.player_name}</span>
                                </div>
                                <div className="text-right">
                                  <span className={`font-bold ${
                                    index === 0 ? 'text-yellow-600' :
                                    index === 1 ? 'text-gray-500' :
                                    index === 2 ? 'text-orange-500' :
                                    'text-[#657575]'
                                  }`}>
                                    {score.moves} zetten
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-4 mt-6 justify-center">
                        <motion.button
                          className="px-6 py-3 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white rounded-2xl font-bold shadow-lg"
                          onClick={resetGame}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          🔄 Opnieuw Spelen
                        </motion.button>
                        <motion.button
                          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-[#440f0f] rounded-2xl font-bold shadow-lg"
                          onClick={() => setShowLeaderboard(false)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          ← Terug
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    /* Win Message */
                    <>
                      {gameMode === 2 ? (
                        /* Two Players Race Win Screen */
                        <>
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <Trophy size={120} className={raceWinner === 1 ? "text-blue-500" : raceWinner === 2 ? "text-purple-500" : "text-yellow-500"} />
                          </motion.div>
                          
                          {raceWinner === 1 ? (
                            <>
                              <h3 className="text-4xl lg:text-5xl font-bold text-blue-600">
                                Speler 1 Wint! 🎉
                              </h3>
                              <p className="text-xl text-[#657575]">
                                Speler 1 heeft alle paren gevonden in{" "}
                                <span className="font-bold text-blue-600">{player1Moves}</span> zetten
                                en <span className="font-bold text-blue-600">{formatTime(player1Time)}</span>!
                              </p>
                              <p className="text-lg text-[#657575] mt-2">
                                Speler 2: <span className="font-bold text-purple-600">{player2MatchedPairs.length}</span> paren gevonden
                                in <span className="font-bold text-purple-600">{player2Moves}</span> zetten
                              </p>
                            </>
                          ) : raceWinner === 2 ? (
                            <>
                              <h3 className="text-4xl lg:text-5xl font-bold text-purple-600">
                                Speler 2 Wint! 🎉
                              </h3>
                              <p className="text-xl text-[#657575]">
                                Speler 2 heeft alle paren gevonden in{" "}
                                <span className="font-bold text-purple-600">{player2Moves}</span> zetten
                                en <span className="font-bold text-purple-600">{formatTime(player2Time)}</span>!
                              </p>
                              <p className="text-lg text-[#657575] mt-2">
                                Speler 1: <span className="font-bold text-blue-600">{player1MatchedPairs.length}</span> paren gevonden
                                in <span className="font-bold text-blue-600">{player1Moves}</span> zetten
                              </p>
                            </>
                          ) : (
                            <>
                              <h3 className="text-4xl lg:text-5xl font-bold text-yellow-600">
                                Gelijk Spel! 🤝
                              </h3>
                              <p className="text-xl text-[#657575]">
                                Beide spelers hebben alle paren gevonden!
                              </p>
                            </>
                          )}

                          <div className="flex gap-4 mt-6">
                            <motion.button
                              className="px-6 py-3 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white rounded-2xl font-bold shadow-lg"
                              onClick={resetGame}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              🔄 Opnieuw Spelen
                            </motion.button>
                          </div>
                        </>
                      ) : (
                        /* Single Player Win Screen */
                        <>
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <Trophy size={120} className="text-[#22c55e]" />
                          </motion.div>
                          <h3 className="text-4xl lg:text-5xl font-bold text-[#440f0f]">
                            Gefeliciteerd!
                          </h3>
                          <p className="text-xl lg:text-2xl text-[#657575]">
                            Je hebt alle paren gevonden in{" "}
                            <span className="font-bold text-[#22c55e]">{moves}</span> zetten
                            en <span className="font-bold text-[#22c55e]">{formatTime(timeElapsed)}</span>!
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
                              {saveError && (
                                <p className="text-red-500">{saveError}</p>
                              )}
                            </div>
                          )}

                          <div className="flex gap-4 mt-4">
                            <motion.button
                              className="px-6 py-3 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white rounded-2xl font-bold shadow-lg"
                              onClick={resetGame}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              🔄 Opnieuw Spelen
                            </motion.button>
                            <motion.button
                              className="px-6 py-3 bg-white border-2 border-[#22c55e] text-[#22c55e] rounded-2xl font-bold shadow-lg"
                              onClick={() => setShowLeaderboard(true)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              🏆 Bekijk Scores
                            </motion.button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </motion.div>
              ) : gameMode === 2 ? (
                /* Two Players Race Mode - Split Screen */
                <div className="flex flex-col lg:flex-row gap-4 h-full">
                  {/* Player 1 Board */}
                  <div className="flex-1 flex flex-col border-4 border-blue-500 rounded-2xl p-4 bg-blue-50/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-2xl font-bold ${player1Won || raceWinner === 1 ? 'text-yellow-600' : 'text-blue-600'}`}>
                        {player1Won || raceWinner === 1 ? '🏆 Speler 1 Wint!' : 'Speler 1'}
                      </h3>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="font-bold">Zetten: {player1Moves}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={16} />
                          {formatTime(player1Time)}
                        </span>
                      </div>
                    </div>
                    <div
                      className="grid gap-2 flex-1"
                      style={{ gridTemplateColumns: `repeat(4, 1fr)` }}
                    >
                      {player1Cards.map((card) => {
                        const flipped = isPlayer1CardFlipped(card.id)
                        const matched = player1MatchedPairs.flat().includes(card.id)
                        const canClick = !flipped && player1FlippedCards.length < 2 && !player1Won && !raceWinner

                        return (
                          <motion.div
                            key={card.id}
                            className={`relative ${canClick ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                            style={{ perspective: "1000px" }}
                            onClick={() => canClick && handlePlayer1CardClick(card.id)}
                            whileHover={canClick ? { scale: 1.05 } : {}}
                            whileTap={canClick ? { scale: 0.95 } : {}}
                          >
                            <motion.div
                              className="w-full aspect-square relative"
                              initial={false}
                              animate={{ rotateY: flipped ? 180 : 0 }}
                              transition={{ duration: 0.5, ease: "easeInOut" }}
                              style={{ transformStyle: "preserve-3d" }}
                            >
                              <div
                                className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center rounded-xl shadow-lg border-4 ${
                                  matched ? 'border-blue-300' : 'border-white'
                                }`}
                                style={{ 
                                  backfaceVisibility: "hidden",
                                  WebkitBackfaceVisibility: "hidden"
                                }}
                              >
                                <span className="text-4xl lg:text-5xl opacity-60">❓</span>
                              </div>
                              <div
                                className={`absolute inset-0 bg-white flex items-center justify-center rounded-xl shadow-lg border-4 ${
                                  matched ? 'border-blue-400 bg-blue-50' : 'border-blue-500'
                                }`}
                                style={{ 
                                  backfaceVisibility: "hidden",
                                  WebkitBackfaceVisibility: "hidden",
                                  transform: "rotateY(180deg)"
                                }}
                              >
                                <span className="text-4xl lg:text-5xl">{card.image}</span>
                              </div>
                            </motion.div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-2 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>

                  {/* Player 2 Board */}
                  <div className="flex-1 flex flex-col border-4 border-purple-500 rounded-2xl p-4 bg-purple-50/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-2xl font-bold ${player2Won || raceWinner === 2 ? 'text-yellow-600' : 'text-purple-600'}`}>
                        {player2Won || raceWinner === 2 ? '🏆 Speler 2 Wint!' : 'Speler 2'}
                      </h3>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="font-bold">Zetten: {player2Moves}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={16} />
                          {formatTime(player2Time)}
                        </span>
                      </div>
                    </div>
                    <div
                      className="grid gap-2 flex-1"
                      style={{ gridTemplateColumns: `repeat(4, 1fr)` }}
                    >
                      {player2Cards.map((card) => {
                        const flipped = isPlayer2CardFlipped(card.id)
                        const matched = player2MatchedPairs.flat().includes(card.id)
                        const canClick = !flipped && player2FlippedCards.length < 2 && !player2Won && !raceWinner

                        return (
                          <motion.div
                            key={card.id}
                            className={`relative ${canClick ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                            style={{ perspective: "1000px" }}
                            onClick={() => canClick && handlePlayer2CardClick(card.id)}
                            whileHover={canClick ? { scale: 1.05 } : {}}
                            whileTap={canClick ? { scale: 0.95 } : {}}
                          >
                            <motion.div
                              className="w-full aspect-square relative"
                              initial={false}
                              animate={{ rotateY: flipped ? 180 : 0 }}
                              transition={{ duration: 0.5, ease: "easeInOut" }}
                              style={{ transformStyle: "preserve-3d" }}
                            >
                              <div
                                className={`absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center rounded-xl shadow-lg border-4 ${
                                  matched ? 'border-purple-300' : 'border-white'
                                }`}
                                style={{ 
                                  backfaceVisibility: "hidden",
                                  WebkitBackfaceVisibility: "hidden"
                                }}
                              >
                                <span className="text-4xl lg:text-5xl opacity-60">❓</span>
                              </div>
                              <div
                                className={`absolute inset-0 bg-white flex items-center justify-center rounded-xl shadow-lg border-4 ${
                                  matched ? 'border-purple-400 bg-purple-50' : 'border-purple-500'
                                }`}
                                style={{ 
                                  backfaceVisibility: "hidden",
                                  WebkitBackfaceVisibility: "hidden",
                                  transform: "rotateY(180deg)"
                                }}
                              >
                                <span className="text-4xl lg:text-5xl">{card.image}</span>
                              </div>
                            </motion.div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* Single Player Game Board */
                <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
                  {/* Cards Grid */}
                  <div
                    className="grid gap-4 lg:gap-5"
                    style={{ gridTemplateColumns: `repeat(4, 1fr)` }}
                  >
                    {cards.map((card) => {
                      const flipped = isCardFlipped(card.id)
                      const matched = matchedPairs.flat().includes(card.id)
                      const canClick = !flipped && flippedCards.length < 2 && !gameWon

                      return (
                        <motion.div
                          key={card.id}
                          className={`relative ${canClick ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                          style={{ perspective: "1000px" }}
                          onClick={() => canClick && handleCardClick(card.id)}
                          whileHover={canClick ? { scale: 1.05 } : {}}
                          whileTap={canClick ? { scale: 0.95 } : {}}
                        >
                          <motion.div
                            className="w-24 h-24 lg:w-32 lg:h-32 relative"
                            initial={false}
                            animate={{ rotateY: flipped ? 180 : 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            style={{ transformStyle: "preserve-3d" }}
                          >
                            {/* Card Back (question mark) - visible when not flipped */}
                            <div
                              className={`absolute inset-0 bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center rounded-2xl shadow-lg border-4 ${
                                matched ? 'border-green-300' : 'border-white'
                              }`}
                              style={{ 
                                backfaceVisibility: "hidden",
                                WebkitBackfaceVisibility: "hidden"
                              }}
                            >
                              <span className="text-5xl lg:text-6xl opacity-60">❓</span>
                            </div>

                            {/* Card Front (emoji) - visible when flipped */}
                            <div
                              className={`absolute inset-0 bg-white flex items-center justify-center rounded-2xl shadow-lg border-4 ${
                                matched ? 'border-green-400 bg-green-50' : 'border-[#22c55e]'
                              }`}
                              style={{ 
                                backfaceVisibility: "hidden",
                                WebkitBackfaceVisibility: "hidden",
                                transform: "rotateY(180deg)"
                              }}
                            >
                              <span className="text-5xl lg:text-7xl">{card.image}</span>
                            </div>
                          </motion.div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Leaderboard */}
                  <div className="flex-shrink-0 w-72">
                    <div className="bg-white rounded-2xl shadow-lg p-5 border border-[#a7b8b4]/30">
                      <h3 className="text-lg font-bold text-[#440f0f] mb-4 flex items-center gap-2">
                        <Trophy size={20} className="text-[#22c55e]" />
                        Beste Scores
                      </h3>

                      {loadingScores ? (
                        <div className="text-center py-4 text-[#657575]">Laden...</div>
                      ) : scores.length === 0 ? (
                        <div className="text-center py-4 text-[#657575]">Nog geen scores</div>
                      ) : (
                        <div className="space-y-2">
                          {scores.slice(0, 5).map((score, index) => (
                            <div
                              key={index}
                              className={`flex items-center justify-between p-2.5 rounded-lg ${
                                index === 0 ? 'bg-yellow-50 border border-yellow-200' :
                                index === 1 ? 'bg-gray-50 border border-gray-200' :
                                index === 2 ? 'bg-orange-50 border border-orange-200' :
                                'bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`text-base font-bold ${
                                  index === 0 ? 'text-yellow-500' :
                                  index === 1 ? 'text-gray-400' :
                                  index === 2 ? 'text-orange-400' :
                                  'text-[#657575]'
                                }`}>
                                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                                </span>
                                <span className="font-medium text-[#440f0f] text-sm">{score.player_name}</span>
                              </div>
                              <div className="text-right">
                                <span className={`font-bold text-sm ${
                                  index === 0 ? 'text-yellow-600' :
                                  index === 1 ? 'text-gray-500' :
                                  index === 2 ? 'text-orange-500' :
                                  'text-[#657575]'
                                }`}>
                                  {score.moves}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-[#a7b8b4]/30 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#657575]">Jouw zetten:</span>
                          <span className="font-bold text-[#22c55e]">{moves}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#657575]">Jouw tijd:</span>
                          <span className="font-bold text-[#22c55e]">{formatTime(timeElapsed)}</span>
                        </div>
                      </div>
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

export default MemoryGame
