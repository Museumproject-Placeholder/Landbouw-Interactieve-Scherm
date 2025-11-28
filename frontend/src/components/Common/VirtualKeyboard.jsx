/**
 * Virtual Keyboard Component
 * 
 * On-screen keyboard for touchscreen devices
 * Supports letters, numbers, and basic actions
 */

import React, { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Delete, Check, X } from "lucide-react"

const VirtualKeyboard = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  maxLength = 10,
  placeholder = "Voer je naam in...",
  title = "Voer je naam in"
}) => {
  const [value, setValue] = useState("")
  const [error, setError] = useState("")

  // Keyboard layout
  const rows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '_', '-'],
  ]

  const handleKeyPress = useCallback((key) => {
    setError("")
    if (value.length < maxLength) {
      setValue(prev => prev + key)
    }
  }, [value, maxLength])

  const handleBackspace = useCallback(() => {
    setError("")
    setValue(prev => prev.slice(0, -1))
  }, [])

  const handleClear = useCallback(() => {
    setValue("")
    setError("")
  }, [])

  const handleSubmit = useCallback(() => {
    if (value.trim().length === 0) {
      setError("Voer een naam in")
      return
    }
    if (value.trim().length < 2) {
      setError("Naam moet minimaal 2 tekens zijn")
      return
    }
    onSubmit(value.trim())
  }, [value, onSubmit])

  const handleClose = useCallback(() => {
    setValue("")
    setError("")
    onClose()
  }, [onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-white/10 max-w-2xl w-full mx-4"
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X size={24} className="text-white" />
            </button>
          </div>

          {/* Input Display */}
          <div className="mb-6">
            <div className="bg-black/30 rounded-xl p-4 border-2 border-cyan-500/50 min-h-[60px] flex items-center justify-center">
              {value ? (
                <span className="text-3xl font-bold text-white tracking-widest">
                  {value}
                </span>
              ) : (
                <span className="text-xl text-gray-500">{placeholder}</span>
              )}
            </div>
            <div className="flex justify-between mt-2 px-2">
              <span className="text-sm text-gray-400">
                {value.length} / {maxLength} tekens
              </span>
              {error && (
                <span className="text-sm text-red-400">{error}</span>
              )}
            </div>
          </div>

          {/* Keyboard */}
          <div className="space-y-2">
            {rows.map((row, rowIndex) => (
              <div 
                key={rowIndex} 
                className="flex justify-center gap-1.5"
                style={{ paddingLeft: rowIndex === 2 ? '20px' : rowIndex === 3 ? '40px' : '0' }}
              >
                {row.map((key) => (
                  <motion.button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    className="w-12 h-14 md:w-14 md:h-16 bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 active:from-gray-700 active:to-gray-800 rounded-lg text-white font-bold text-lg md:text-xl shadow-lg border border-white/10 transition-all"
                    whileTap={{ scale: 0.95 }}
                  >
                    {key}
                  </motion.button>
                ))}
              </div>
            ))}

            {/* Action Row */}
            <div className="flex justify-center gap-3 mt-4">
              {/* Clear */}
              <motion.button
                onClick={handleClear}
                className="px-6 py-4 bg-gradient-to-b from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 rounded-xl text-white font-bold shadow-lg flex items-center gap-2"
                whileTap={{ scale: 0.95 }}
              >
                <X size={20} />
                Wissen
              </motion.button>

              {/* Backspace */}
              <motion.button
                onClick={handleBackspace}
                className="px-6 py-4 bg-gradient-to-b from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 rounded-xl text-white font-bold shadow-lg flex items-center gap-2"
                whileTap={{ scale: 0.95 }}
              >
                <Delete size={20} />
                Terug
              </motion.button>

              {/* Space */}
              <motion.button
                onClick={() => handleKeyPress(' ')}
                className="px-12 py-4 bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 rounded-xl text-white font-bold shadow-lg"
                whileTap={{ scale: 0.95 }}
                disabled={value.length >= maxLength}
              >
                Spatie
              </motion.button>

              {/* Submit */}
              <motion.button
                onClick={handleSubmit}
                className="px-8 py-4 bg-gradient-to-b from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 rounded-xl text-white font-bold shadow-lg flex items-center gap-2"
                whileTap={{ scale: 0.95 }}
              >
                <Check size={20} />
                Opslaan
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default VirtualKeyboard

