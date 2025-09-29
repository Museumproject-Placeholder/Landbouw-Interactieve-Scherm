/**
 * SlidePuzzle Component (Legacy - Not Currently Used)
 *
 * This is a standalone sliding puzzle game component that was originally created
 * as a full-page puzzle game. It has been superseded by PuzzleModal.jsx which
 * provides the same functionality in a modal format.
 *
 * This file is kept for reference but PuzzleModal.jsx is the active component.
 *
 * Features:
 * - Full-page 3x3 sliding puzzle game
 * - Dutch language interface
 * - Framer Motion animations
 * - Click and drag-and-drop support
 * - Move counter and win detection
 */

import React, { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"

const SlidePuzzle = () => {
  const GRID_SIZE = 3
  const TILE_COUNT = GRID_SIZE * GRID_SIZE - 1

  // Function to create initial solved puzzle state
  const createInitialState = () => {
    const tiles = []
    for (let i = 1; i <= TILE_COUNT; i++) {
      tiles.push(i)
    }
    tiles.push(null) // empty space
    return tiles
  }

  // Function to shuffle puzzle tiles
  const shuffleTiles = tiles => {
    const shuffled = [...tiles]
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

  // Function to find neighboring positions
  const getNeighbors = (index, size) => {
    const neighbors = []
    const row = Math.floor(index / size)
    const col = index % size

    if (row > 0) neighbors.push(index - size) // above
    if (row < size - 1) neighbors.push(index + size) // below
    if (col > 0) neighbors.push(index - 1) // left
    if (col < size - 1) neighbors.push(index + 1) // right

    return neighbors
  }

  const [tiles, setTiles] = useState(() => shuffleTiles(createInitialState()))
  const [isWon, setIsWon] = useState(false)
  const [moves, setMoves] = useState(0)

  // Check if puzzle is in winning state
  const checkWin = useCallback(currentTiles => {
    const correctOrder = createInitialState()
    return currentTiles.every((tile, index) => tile === correctOrder[index])
  }, [])

  // Function to handle tile movement
  const moveTile = clickedIndex => {
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

      if (checkWin(newTiles)) {
        setIsWon(true)
      }
    }
  }

  // Restart game function
  const restartGame = () => {
    setTiles(shuffleTiles(createInitialState()))
    setIsWon(false)
    setMoves(0)
  }

  // Drag and drop event handlers
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index.toString())
  }

  const handleDragOver = e => {
    e.preventDefault()
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"))

    // Check if tile can be moved to empty space
    if (tiles[dropIndex] === null) {
      moveTile(dragIndex)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Schuifpuzzel 🧩
        </motion.h1>

        <div className="text-center mb-4">
          <p className="text-lg font-semibold text-white/80">
            Zetten: <span className="text-cyan-300">{moves}</span>
          </p>
        </div>

        {isWon && (
          <motion.div
            className="text-center mb-4 p-4 bg-green-500/20 rounded-lg border border-green-400/30 backdrop-blur-sm"
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

        <div className="grid grid-cols-3 gap-2 mb-6 w-80 h-80 mx-auto bg-black/30 p-2 rounded-lg backdrop-blur-sm border border-white/10">
          {tiles.map((tile, index) => (
            <motion.div
              key={index}
              className={`
                w-full h-full rounded-md flex items-center justify-center text-2xl font-bold cursor-pointer
                transition-all duration-200 select-none
                ${
                  tile === null
                    ? "bg-transparent border-2 border-dashed border-white/30"
                    : "bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20"
                }
              `}
              onClick={() => tile !== null && moveTile(index)}
              draggable={tile !== null}
              onDragStart={e => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={e => handleDrop(e, index)}
              whileHover={tile !== null ? { scale: 1.05 } : {}}
              whileTap={tile !== null ? { scale: 0.95 } : {}}
              layout
            >
              {tile !== null && (
                <div className="text-center">
                  <div className="text-3xl font-bold">{tile}</div>
                  <div className="text-xs opacity-75">#{tile}</div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="text-center space-y-4">
          <motion.button
            onClick={restartGame}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg backdrop-blur-sm border border-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            🔄 Nieuw Spel
          </motion.button>

          <div className="text-sm text-white/70 space-y-1">
            <p className="text-white font-semibold">💡 Hoe te spelen:</p>
            <p>• Klik op tegels om ze te verplaatsen</p>
            <p>• Of sleep een tegel naar de lege plek</p>
            <p>• Orden de nummers van 1 tot 8 in volgorde!</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SlidePuzzle
