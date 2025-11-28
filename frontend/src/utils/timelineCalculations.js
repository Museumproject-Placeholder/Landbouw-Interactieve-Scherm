/**
 * Timeline Calculations Utilities
 * 
 * Functions for calculating time intervals and positioning events on timeline
 */

/**
 * Extract numeric year from year string (handles both "1925" and legacy "1930-1956" formats)
 * @param {string} yearString - Year string from event
 * @returns {number|null} - Numeric year or null if invalid
 */
export const extractYear = (yearString) => {
  if (!yearString) return null
  const match = yearString.match(/\d{4}/)
  return match ? parseInt(match[0], 10) : null
}

/**
 * Format year as a range for display (e.g., "1900 - 1910")
 * If year is already a range (e.g., "1900-1910" or "1900 - 1910"), displays it as "1900 - 1910"
 * If year is single (e.g., "1900"), displays as "1900 - 1910" (10 year range)
 * @param {string} yearString - Year string from event
 * @returns {string} - Formatted year range string
 */
export const formatYearRange = (yearString) => {
  if (!yearString) return ""
  
  // Convert to string if it's not already
  const yearStr = String(yearString).trim()
  
  // Check if year string contains a range (handles both "1900-1910" and "1900 - 1910")
  const rangeMatch = yearStr.match(/(\d{4})\s*-\s*(\d{4})/)
  if (rangeMatch) {
    return `${rangeMatch[1]} - ${rangeMatch[2]}`
  }
  
  // Extract single year
  const yearMatch = yearStr.match(/\d{4}/)
  if (yearMatch) {
    const startYear = parseInt(yearMatch[0], 10)
    const endYear = startYear + 10
    return `${startYear} - ${endYear}`
  }
  
  return yearStr
}

/**
 * Generate timeline years with optimal spacing
 * Automatically calculates years to display above events
 * 
 * @param {Array} events - Array of event objects with 'year' property
 * @returns {Array} - Array of years to display (e.g. [1945, 1950, 1955, 1960])
 */
export const generateTimelineYears = (events) => {
  if (!events || events.length === 0) return []

  // Extract and sort all years
  const years = events
    .map(event => extractYear(event.year))
    .filter(year => year !== null)
    .sort((a, b) => a - b)

  if (years.length === 0) return []

  const minYear = Math.min(...years)
  const maxYear = Math.max(...years)

  // Round to nearest 5 years
  const startYear = Math.floor(minYear / 5) * 5
  const endYear = Math.ceil(maxYear / 5) * 5

  // Calculate optimal interval (5 or 10 years)
  const totalRange = endYear - startYear
  const optimalInterval = totalRange > 100 ? 10 : 5

  // Generate years with equal spacing
  const timelineYears = []
  for (let year = startYear; year <= endYear; year += optimalInterval) {
    timelineYears.push(year)
  }

  // Handle edge case: if all events in one year, show +/- 10 years
  if (timelineYears.length === 1) {
    const singleYear = timelineYears[0]
    return [singleYear - 10, singleYear, singleYear + 10]
  }

  return timelineYears
}

/**
 * Calculate year position as percentage on timeline
 * @param {number} year - Year to position
 * @param {number} minYear - Minimum year in timeline
 * @param {number} maxYear - Maximum year in timeline
 * @returns {number} - Position percentage (0-100)
 */
export const calculateYearPosition = (year, minYear, maxYear) => {
  const range = maxYear - minYear
  if (range === 0) return 50 // Center if no range
  
  const offset = year - minYear
  return (offset / range) * 100
}

/**
 * Calculate time intervals for timeline display
 * Automatically groups events into intervals with year markers at start and end
 * 
 * @param {Array} events - Array of event objects with 'year' property
 * @returns {Array} - Array of interval objects: { startYear, endYear, events }
 */
export const calculateTimeIntervals = (events) => {
  if (!events || events.length === 0) return []

  // Extract and sort all years
  const years = events
    .map(event => extractYear(event.year))
    .filter(year => year !== null)
    .sort((a, b) => a - b)

  if (years.length === 0) return []

  const minYear = Math.min(...years)
  const maxYear = Math.max(...years)

  // Round to nearest 5 years for cleaner intervals
  const startYear = Math.floor(minYear / 5) * 5
  const endYear = Math.ceil(maxYear / 5) * 5

  const intervals = []
  let currentStart = startYear

  while (currentStart < endYear) {
    // Default interval size - try to create intervals of 10-15 years
    let intervalSize = 15

    // Find events in current potential interval
    const eventsInInterval = events.filter(event => {
      const eventYear = extractYear(event.year)
      return eventYear !== null && eventYear >= currentStart && eventYear < currentStart + intervalSize
    })

    // Adjust interval size based on number of events
    if (eventsInInterval.length > 8) {
      intervalSize = 10 // Smaller interval if too many events
    } else if (eventsInInterval.length === 0) {
      // If no events, check if we can extend to find events
      const extendedEvents = events.filter(event => {
        const eventYear = extractYear(event.year)
        return eventYear !== null && eventYear >= currentStart && eventYear < currentStart + 20
      })
      if (extendedEvents.length > 0) {
        intervalSize = 20 // Extend to find events
      } else {
        // Skip empty intervals unless it's the first or last
        if (currentStart !== startYear) {
          currentStart += intervalSize
          continue
        }
      }
    } else if (eventsInInterval.length < 3 && currentStart + 20 <= endYear) {
      // Check if extending would help
      const extendedEvents = events.filter(event => {
        const eventYear = extractYear(event.year)
        return eventYear !== null && eventYear >= currentStart && eventYear < currentStart + 20
      })
      if (extendedEvents.length <= 5) {
        intervalSize = 20 // Larger interval if few events
      }
    }

    const intervalEnd = currentStart + intervalSize

    // Get events for this interval
    const intervalEvents = events.filter(event => {
      const eventYear = extractYear(event.year)
      return eventYear !== null && eventYear >= currentStart && eventYear < intervalEnd
    })

    // Always add interval if it has events, or if it's the first/last interval
    if (intervalEvents.length > 0 || currentStart === startYear || intervalEnd >= endYear) {
      intervals.push({
        startYear: currentStart,
        endYear: intervalEnd,
        events: intervalEvents,
      })
    }

    currentStart = intervalEnd
  }

  // Handle edge case: if all events in one year, create interval around it
  if (intervals.length === 0) {
    const singleYear = years[0]
    intervals.push({
      startYear: singleYear - 5,
      endYear: singleYear + 5,
      events: events,
    })
  }

  return intervals
}

/**
 * Calculate event position within an interval (as percentage)
 * @param {number} eventYear - Year of the event
 * @param {Object} interval - Interval object with startYear and endYear
 * @returns {number} - Position percentage (0-100)
 */
export const calculateEventPosition = (eventYear, interval) => {
  const { startYear, endYear } = interval
  const totalYears = endYear - startYear
  
  if (totalYears === 0) return 50 // Center if no range
  
  const yearOffset = eventYear - startYear
  const positionPercent = (yearOffset / totalYears) * 100
  
  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, positionPercent))
}

/**
 * Generate fixed year markers for timeline (1925, 1930, 1935... 2025)
 * @param {number} startYear - Starting year (default 1925)
 * @param {number} endYear - Ending year (default 2025)
 * @param {number} interval - Years between markers (default 5)
 * @returns {number[]} Array of year markers
 */
export const generateYearMarkers = (startYear = 1925, endYear = 2025, interval = 5) => {
  const markers = []
  for (let year = startYear; year <= endYear; year += interval) {
    markers.push(year)
  }
  return markers
}

/**
 * Group events by year markers
 * Events are grouped into sections between consecutive markers
 * Example: Events from 1926-1929 go into section with marker 1925
 * @param {Array} events - Array of event objects with year property
 * @param {number[]} markers - Array of year markers
 * @returns {Array} Array of sections with markerYear, startYear, endYear, and events
 */
export const groupEventsByMarkers = (events, markers) => {
  const sections = []

  for (let i = 0; i < markers.length; i++) {
    const startYear = markers[i]
    const endYear = markers[i + 1] || startYear + 5 // Last section

    const eventsInSection = events.filter((event) => {
      const eventYear = extractYear(event.year)
      return eventYear >= startYear && eventYear < endYear
    })

    sections.push({
      markerYear: startYear,
      startYear,
      endYear,
      events: eventsInSection,
    })
  }

  return sections
}

