import React from "react"
import { motion } from "framer-motion"

/**
 * LoadingSkeleton Component
 *
 * Displays skeleton cards with glassmorphism styling during data loading.
 * Includes pulse and shimmer animations for professional loading effect.
 */
const LoadingSkeleton = ({ count = 9 }) => {
  return (
    <div className="flex items-center space-x-16 md:space-x-32 min-w-max px-16 md:px-32 pt-16 md:pt-24 pb-16">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={`skeleton-${index}`}
          className={`relative flex-shrink-0 z-10 ${
            index % 2 === 0 ? "mb-48" : "mt-48"
          } w-80`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          {/* Skeleton Card */}
          <motion.div
            className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 overflow-hidden h-72"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{
                x: ["-300%", "300%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                width: "100%",
                height: "100%",
              }}
            />

            <div className="relative z-10">
              {/* Year Placeholder */}
              <div className="text-center mb-6">
                <div className="h-16 w-32 bg-white/20 rounded-lg mx-auto" />
              </div>

              {/* Icon Placeholder */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white/20 rounded-lg" />
              </div>

              {/* Title Placeholder */}
              <div className="text-center mb-4">
                <div className="h-8 w-3/4 bg-white/20 rounded-lg mx-auto mb-3" />
              </div>

              {/* Description Placeholders */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-white/15 rounded" />
                <div className="h-4 w-5/6 bg-white/15 rounded" />
                <div className="h-4 w-4/6 bg-white/15 rounded" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}

export default LoadingSkeleton



