/**
 * PuzzleModal Component
 *
 * A modal popup containing a sliding puzzle game. This component renders a 3x3 sliding puzzle
 * with numbers 1-8 and one empty space. The goal is to arrange the numbers in order by
 * sliding tiles into the empty space.
 *
 * Features:
 * - 3x3 grid sliding puzzle
 * - Drag and drop or click to move tiles
 * - Move counter
 * - Win detection with celebration
 * - Auto-shuffle when opened
 * - Restart functionality
 * - Touch-friendly for kiosk interfaces
 *
 * Props:
 * - isOpen (boolean): Controls modal visibility
 * - onClose (function): Callback when modal should be closed
 */

import React, { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

const PuzzleModal = ({ isOpen, onClose }) => {
  // Constants for puzzle configuration
  const GRID_SIZE = 3
  const TILE_COUNT = GRID_SIZE * GRID_SIZE - 1 // 8 numbered tiles + 1 empty space

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

  // Game state
  const [tiles, setTiles] = useState(() => shuffleTiles(createInitialState()))
  const [isWon, setIsWon] = useState(false)
  const [moves, setMoves] = useState(0)

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
  const moveTile = clickedIndex => {
    const emptyIndex = tiles.indexOf(null)
    const neighbors = getNeighbors(emptyIndex, GRID_SIZE)

    // Check if clicked tile is adjacent to empty space
    if (neighbors.includes(clickedIndex)) {
      const newTiles = [...tiles]
      // Swap clicked tile with empty space
      ;[newTiles[emptyIndex], newTiles[clickedIndex]] = [
        newTiles[clickedIndex],
        newTiles[emptyIndex],
      ]

      setTiles(newTiles)
      setMoves(prev => prev + 1)

      // Check for win condition
      if (checkWin(newTiles)) {
        setIsWon(true)
      }
    }
  }

  /**
   * Resets the game to a new shuffled state
   */
  const restartGame = () => {
    setTiles(shuffleTiles(createInitialState()))
    setIsWon(false)
    setMoves(0)
  }

  /**
   * Drag and drop event handlers for alternative interaction method
   */
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index.toString())
  }

  const handleDragOver = e => {
    e.preventDefault()
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"))

    // Only allow drop on empty space
    if (tiles[dropIndex] === null) {
      moveTile(dragIndex)
    }
  }

  /**
   * Reset game state when modal opens to ensure fresh start
   */
  React.useEffect(() => {
    if (isOpen) {
      restartGame()
    }
  }, [isOpen])

  if (!isOpen) return null

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
          className="relative w-full max-w-2xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8"
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

          {/* Game Content Container */}
          <div className="text-center">
            {/* Game Title */}
            <motion.h1
              className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Schuifpuzzel 🧩
            </motion.h1>

            {/* Move Counter Display */}
            <div className="mb-4">
              <p className="text-lg font-semibold text-white/80">
                Zetten: <span className="text-cyan-300">{moves}</span>
              </p>
            </div>

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
                  Je hebt de puzzel voltooid in {moves} zetten!
                </p>
              </motion.div>
            )}

            {/* Puzzle Grid - 3x3 game board */}
            <div className="grid grid-cols-3 gap-2 mb-6 w-80 h-80 mx-auto bg-black/30 p-2 rounded-lg backdrop-blur-sm border border-white/10">
              {/* Individual Puzzle Tiles */}
              {tiles.map((tile, index) => (
                <motion.div
                  key={index}
                  className={`
                    w-full h-full rounded-md flex items-center justify-center text-2xl font-bold cursor-pointer
                    transition-all duration-200 select-none
                    ${
                      tile === null
                        ? "bg-transparent border-2 border-dashed border-white/30" // Empty space styling
                        : "bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20" // Numbered tile styling
                    }
                  `}
                  onClick={() => tile !== null && moveTile(index)} // Handle click to move tile
                  draggable={tile !== null} // Only numbered tiles are draggable
                  onDragStart={e => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={e => handleDrop(e, index)}
                  whileHover={tile !== null ? { scale: 1.05 } : {}} // Hover animation for numbered tiles
                  whileTap={tile !== null ? { scale: 0.95 } : {}} // Tap animation for numbered tiles
                  layout // Smooth layout transitions when tiles move
                >
                  {tile !== null && (
                    <div className="text-center">
                      <div className="text-2xl font-bold">{tile}</div>
                      <div className="text-xs opacity-75">#{tile}</div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Game Controls and Instructions */}
            <div className="space-y-4">
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

              {/* Game Instructions */}
              <div className="text-sm text-white/70 space-y-1">
                <p className="text-white font-semibold">💡 Hoe te spelen:</p>
                <p>• Klik op tegels om ze te verplaatsen</p>
                <p>• Of sleep een tegel naar de lege plek</p>
                <p>• Orden de nummers van 1 tot 8 in volgorde!</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Usage Example:
 *
 * import PuzzleModal from './PuzzleModal';
 *
 * const ParentComponent = () => {
 *   const [isPuzzleOpen, setIsPuzzleOpen] = useState(false);
 *
 *   return (
 *     <div>
 *       <button onClick={() => setIsPuzzleOpen(true)}>Open Puzzle</button>
 *       <PuzzleModal
 *         isOpen={isPuzzleOpen}
 *         onClose={() => setIsPuzzleOpen(false)}
 *       />
 *     </div>
 *   );
 * };
 *
 * Technical Notes:
 * - Uses Framer Motion for smooth animations
 * - Implements proper puzzle shuffling algorithm to ensure solvability
 * - Supports both click and drag-and-drop interactions
 * - Optimized for touch interfaces with larger touch targets
 * - Auto-resets when modal reopens for fresh gameplay
 * - Glassmorphism styling matches timeline design system
 */

export default PuzzleModal
