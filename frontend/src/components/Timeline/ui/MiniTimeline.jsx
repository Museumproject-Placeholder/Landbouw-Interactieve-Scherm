import React, { useState } from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { getTheme } from '../../../config/themes'

const MiniTimeline = ({ events, activeYear, variant = 'default' }) => {
  const [hoveredEvent, setHoveredEvent] = useState(null)
  const theme = getTheme()
  
  // Define styles based on variant
  const styles = variant === 'landbouw' ? {
    // Landbouw Theme (Rustic Paper)
    lineBase: '#d1c7a7',      // Light brown/beige for inactive line
    lineActive: '#7c8f38',    // Green for active line
    dotBase: '#d1c7a7',       // Light brown dot
    dotActive: '#7c8f38',     // Green active dot
    dotActiveBorder: '#5e4b35', // Dark brown border
    dotShadow: '0 4px 8px rgba(124, 143, 56, 0.4), 0 0 0 4px rgba(124, 143, 56, 0.1)',
    textYearActive: '#7c8f38', // Green text
    textYearBase: '#6b5a45',   // Muted brown text
    textTitleActive: '#3a2d20',// Dark brown title
    textTitleBase: '#8c7b66',  // Light brown title
    tooltipBg: '#f3eeda',      // Paper bg
    tooltipText: '#3a2d20',    // Dark brown text
    tooltipBorder: '#d1c7a7'   // Light brown border
  } : {
    // Default Museum styles
    lineBase: '#a7b8b4',
    lineActive: '#ae5514',
    dotBase: '#a7b8b4',
    dotActive: '#ae5514',
    dotActiveBorder: '#c9a300',
    dotShadow: '0 4px 8px rgba(174, 85, 20, 0.4), 0 0 0 4px rgba(174, 85, 20, 0.1)',
    textYearActive: '#ae5514',
    textYearBase: '#657575',
    textTitleActive: '#440f0f',
    textTitleBase: '#a7b8b4',
    tooltipBg: '#f3f2e9',
    tooltipText: '#440f0f',
    tooltipBorder: '#a7b8b4'
  }

  return (
    <div className="w-full py-8">
      {/* Timeline Container */}
      <div className="relative px-4">
        {/* Base Line - gray background */}
        <div
          className="absolute top-6 left-0 right-0 h-1"
          style={{
            backgroundColor: styles.lineBase,
            height: '3px',
            borderRadius: '2px'
          }}
        />
        
        {/* Active Segment Line - highlight between active and previous/next */}
        {events.map((event, index) => {
          const eventYear = typeof event.year === 'number' ? event.year : parseInt(event.year)
          const currentActiveYear = typeof activeYear === 'number' ? activeYear : (activeYear ? parseInt(activeYear) : null)
          const isActive = activeYear !== null && eventYear === currentActiveYear
          
          if (isActive && events.length > 1) {
            const activeIndex = index
            const prevIndex = activeIndex > 0 ? activeIndex - 1 : null
            const nextIndex = activeIndex < events.length - 1 ? activeIndex + 1 : null
            
            // Calculate positions for active segment
            const segmentWidth = 100 / events.length
            const leftPercent = prevIndex !== null ? (prevIndex + 0.5) * segmentWidth : 0
            const rightPercent = nextIndex !== null ? (nextIndex + 0.5) * segmentWidth : 100
            
            return (
              <div
                key={`active-segment-${index}`}
                className="absolute top-6 h-1"
                style={{
                  left: `${leftPercent}%`,
                  width: `${rightPercent - leftPercent}%`,
                  backgroundColor: styles.lineActive,
                  height: '3px',
                  borderRadius: '2px',
                  zIndex: 1
                }}
              />
            )
          }
          return null
        })}

        {/* Events */}
        <div className="relative flex justify-between items-start">
          {events.map((event, index) => {
            // Compare years as numbers
            const eventYear = typeof event.year === 'number' ? event.year : parseInt(event.year)
            const currentActiveYear = typeof activeYear === 'number' ? activeYear : (activeYear ? parseInt(activeYear) : null)
            const isActive = activeYear !== null && eventYear === currentActiveYear
            const isHovered = hoveredEvent === eventYear

            return (
              <motion.div
                key={`${event.year}-${index}`}
                className="flex flex-col items-center relative"
                style={{ flex: 1 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                onMouseEnter={() => setHoveredEvent(eventYear)}
                onMouseLeave={() => setHoveredEvent(null)}
                onTouchStart={() => setHoveredEvent(eventYear)}
              >
                {/* Marker - positioned on the line */}
                <div className="relative mb-2" style={{ top: '24px', transform: 'translateY(-50%)' }}>
                  {/* Pulsing Ring for Active */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '40px',
                        height: '40px',
                        opacity: 0.2,
                        backgroundColor: styles.lineActive
                      }}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.1, 0.2] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}

                  {/* Main Dot */}
                  <motion.div
                    className="relative z-10 rounded-full cursor-pointer transition-all"
                    style={{
                      ...(isActive
                        ? {
                            width: '20px',
                            height: '20px',
                            backgroundColor: styles.dotActive,
                            border: '3px solid',
                            borderColor: styles.dotActiveBorder,
                            boxShadow: styles.dotShadow
                          }
                        : {
                            width: '14px',
                            height: '14px',
                            backgroundColor: styles.dotBase,
                            border: '2px solid',
                            borderColor: styles.dotBase
                          })
                    }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                  />

                </div>

                {/* Event Info */}
                <div className="text-center max-w-[140px] mt-2">
                  <div
                    className="text-base mb-1 font-semibold"
                    style={{
                      color: isActive ? styles.textYearActive : styles.textYearBase
                    }}
                  >
                    {eventYear}
                  </div>
                  <div
                    className="text-sm mb-1 font-medium"
                    style={{
                      color: isActive ? styles.textTitleActive : styles.textTitleBase
                    }}
                  >
                    {event.title}
                  </div>
                  {event.shortDescription && (
                    <div
                      className="text-xs leading-tight mt-1"
                      style={{ color: styles.textTitleBase }}
                    >
                      {event.shortDescription}
                    </div>
                  )}
                </div>

                {/* "You are here" indicator */}
                {isActive && (
                  <motion.div
                    className="mt-3 text-xs font-semibold flex items-center justify-center gap-1"
                    style={{ color: styles.lineActive }}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 + 0.3 }}
                  >
                    <span style={{ fontSize: '10px' }}>▲</span>
                    <span>Jij bent hier</span>
                  </motion.div>
                )}

                {/* Tooltip on Hover */}
                {isHovered && event.fullDescription && (
                  <motion.div
                    className="absolute top-full mt-8 p-3 rounded-lg shadow-xl border max-w-[200px] z-20"
                    style={{
                      backgroundColor: styles.tooltipBg,
                      color: styles.tooltipText,
                      borderColor: styles.tooltipBorder
                    }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="text-xs font-semibold mb-1">{event.title}</div>
                    <div
                      className="text-xs"
                      style={{ color: variant === 'landbouw' ? '#9ca8a0' : '#657575' }}
                    >
                      {event.fullDescription}
                    </div>
                    {/* Arrow pointer */}
                    <div
                      className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent"
                      style={{
                        borderBottomColor: styles.tooltipBg
                      }}
                    />
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

MiniTimeline.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      shortDescription: PropTypes.string,
      fullDescription: PropTypes.string
    })
  ).isRequired,
  activeYear: PropTypes.number.isRequired
}

export default MiniTimeline
