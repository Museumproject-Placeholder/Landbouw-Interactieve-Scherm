import React, { useState } from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { getTheme } from '../../../config/themes'

const MiniTimeline = ({ events, activeYear }) => {
  const [hoveredEvent, setHoveredEvent] = useState(null)
  const theme = getTheme()

  return (
    <div className="w-full py-8">
      {/* Timeline Container */}
      <div className="relative px-4">
        {/* Base Line - gray background */}
        <div
          className="absolute top-6 left-0 right-0 h-1"
          style={{
            backgroundColor: theme.name === 'museum' ? '#a7b8b4' : 'rgb(100 116 139)',
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
                  backgroundColor: theme.name === 'museum' ? '#ae5514' : '#f97316',
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
                        backgroundColor: theme.name === 'museum' ? '#ae5514' : '#f97316'
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
                            backgroundColor: theme.name === 'museum' ? '#ae5514' : '#f97316',
                            border: '3px solid',
                            borderColor: theme.name === 'museum' ? '#c9a300' : '#fb923c',
                            boxShadow: theme.name === 'museum'
                              ? '0 4px 8px rgba(174, 85, 20, 0.4), 0 0 0 4px rgba(174, 85, 20, 0.1)'
                              : '0 4px 8px rgba(249, 115, 22, 0.4), 0 0 0 4px rgba(249, 115, 22, 0.1)'
                          }
                        : {
                            width: '14px',
                            height: '14px',
                            backgroundColor: theme.name === 'museum' ? '#a7b8b4' : '#64748b',
                            border: '2px solid',
                            borderColor: theme.name === 'museum' ? '#a7b8b4' : '#64748b'
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
                      color: isActive
                        ? theme.name === 'museum' ? '#ae5514' : '#fb923c'
                        : theme.name === 'museum' ? '#657575' : '#cbd5e1'
                    }}
                  >
                    {eventYear}
                  </div>
                  <div
                    className="text-sm mb-1 font-medium"
                    style={{
                      color: isActive
                        ? theme.name === 'museum' ? '#440f0f' : '#ffffff'
                        : theme.name === 'museum' ? '#a7b8b4' : '#94a3b8'
                    }}
                  >
                    {event.title}
                  </div>
                  {event.shortDescription && (
                    <div
                      className="text-xs leading-tight mt-1"
                      style={{ color: theme.name === 'museum' ? '#a7b8b4' : '#64748b' }}
                    >
                      {event.shortDescription}
                    </div>
                  )}
                </div>

                {/* "You are here" indicator */}
                {isActive && (
                  <motion.div
                    className="mt-3 text-xs font-semibold flex items-center justify-center gap-1"
                    style={{ color: theme.name === 'museum' ? '#ae5514' : '#fb923c' }}
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
                      backgroundColor: theme.name === 'museum' ? '#f3f2e9' : '#1e293b',
                      color: theme.name === 'museum' ? '#440f0f' : '#ffffff',
                      borderColor: theme.name === 'museum' ? '#a7b8b4' : '#334155'
                    }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="text-xs font-semibold mb-1">{event.title}</div>
                    <div
                      className="text-xs"
                      style={{ color: theme.name === 'museum' ? '#657575' : '#cbd5e1' }}
                    >
                      {event.fullDescription}
                    </div>
                    {/* Arrow pointer */}
                    <div
                      className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent"
                      style={{
                        borderBottomColor: theme.name === 'museum' ? '#f3f2e9' : '#1e293b'
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
