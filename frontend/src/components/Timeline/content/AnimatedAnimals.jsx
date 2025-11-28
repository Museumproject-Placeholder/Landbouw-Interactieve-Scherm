import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import chickenImg from "../../../assets/icons/chicken.png"
import cowImg from "../../../assets/icons/cow.png"
import horseImg from "../../../assets/icons/horse.png"
import pigImg from "../../../assets/icons/pig.png"
import sheepImg from "../../../assets/icons/sheep.png"

/**
 * Animal configuration with speeds and sizes
 * Order: cow -> horse -> sheep -> pig -> chicken
 */
const ANIMALS = [
  {
    name: "cow",
    image: cowImg,
    duration: 45000, // 45 seconds (slower)
    height: 80,
    order: 0, // First
  },
  {
    name: "horse",
    image: horseImg,
    duration: 45000, // 45 seconds (slower)
    height: 90,
    order: 1, // Second
  },
  {
    name: "sheep",
    image: sheepImg,
    duration: 45000, // 45 seconds (slower)
    height: 65,
    order: 2, // Third
  },
  {
    name: "pig",
    image: pigImg,
    duration: 45000, // 45 seconds (slower)
    height: 70,
    order: 3, // Fourth
  },
  {
    name: "chicken",
    image: chickenImg,
    duration: 45000, // 45 seconds (slower)
    height: 45,
    order: 4, // Fifth
  },
]

/**
 * AnimatedAnimals Component
 * 
 * Displays farm animals walking across the bottom of the timeline screen.
 * Animals spawn randomly and move from left to right at different speeds.
 */
const AnimatedAnimals = () => {
  const [activeAnimals, setActiveAnimals] = useState([])
  const timersRef = useRef([])
  const currentAnimalIndexRef = useRef(0)
  const isSpawningRef = useRef(false)

  // Spawn animals in sequence: cow -> horse -> sheep -> pig -> chicken
  // All animals spawn with spacing so they walk together but don't overlap
  const spawnNextAnimal = useCallback(() => {
    const animalConfig = ANIMALS[currentAnimalIndexRef.current]
    if (!animalConfig) {
      // Reset to start of sequence
      currentAnimalIndexRef.current = 0
      return
    }
    
    const id = `${animalConfig.name}-${Date.now()}-${Math.random()}`
    const yOffset = 0 // No vertical variation - all at same height
    
    console.log(`[AnimatedAnimals] Spawning ${animalConfig.name} (ID: ${id})`)
    
    setActiveAnimals(prev => [...prev, { id, config: animalConfig, yOffset }])

    // Remove animal after animation completes
    const removeTimer = setTimeout(() => {
      setActiveAnimals(current => current.filter(a => a.id !== id))
    }, animalConfig.duration)

    timersRef.current.push(removeTimer)
    
    // Move to next animal in sequence
    currentAnimalIndexRef.current = (currentAnimalIndexRef.current + 1) % ANIMALS.length
    
    // Spawn next animal after spacing delay (so they follow each other but are all on screen)
    // Spacing: ~7 seconds between animals (so they don't overlap)
    const spacingDelay = 7000 // 7 seconds between animals
    const nextTimer = setTimeout(() => {
      spawnNextAnimal()
    }, spacingDelay)
    
    timersRef.current.push(nextTimer)
  }, [])

  // Initialize animals on mount
  useEffect(() => {
    // Small initial delay to ensure component is mounted
    const initTimer = setTimeout(() => {
      // Start spawning animals in sequence
      spawnNextAnimal()
    }, 1000)

    // Cleanup on unmount
    return () => {
      clearTimeout(initTimer)
      timersRef.current.forEach(timer => clearTimeout(timer))
      timersRef.current = []
      isSpawningRef.current = false
      currentAnimalIndexRef.current = 0
    }
  }, [spawnNextAnimal])

  // Debug: log active animals count
  useEffect(() => {
    if (activeAnimals.length > 0) {
      console.log(`[AnimatedAnimals] Active animals: ${activeAnimals.length}`)
    }
  }, [activeAnimals])

  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-[15] overflow-visible" style={{ height: "200px", position: "fixed" }}>
      {activeAnimals.map(({ id, config, yOffset }) => (
        <motion.div
          key={id}
          className="absolute"
          initial={{ x: "110vw" }}
          animate={{
            x: "-10%",
            y: [0, -3, 0, -3, 0], // Subtle bounce effect
          }}
          transition={{
            x: {
              duration: config.duration / 1000,
              ease: "linear",
            },
            y: {
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          style={{
            bottom: `0px`,
            willChange: "transform",
            position: "fixed",
          }}
          whileHover={{
            scale: 1.1,
            transition: { duration: 0.2 },
          }}
        >
          <img
            src={config.image}
            alt={config.name}
            className="select-none"
            style={{
              height: `${config.height}px`,
              width: "auto",
              opacity: 1,
              filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.2))",
              pointerEvents: "auto",
              cursor: "pointer",
            }}
            draggable={false}
          />
        </motion.div>
      ))}
    </div>
  )
}

export default AnimatedAnimals

