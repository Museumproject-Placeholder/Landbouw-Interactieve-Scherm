import { useState, useEffect } from "react"
import { api } from "../services/api"

export const useTimeline = () => {
  const [timelineData, setTimelineData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTimeline = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Fetching timeline data from API...")
      const response = await api.getTimeline()
      console.log("API response:", response)
      const data = response.data || []
      console.log(`Received ${data.length} timeline events`)
      if (data.length === 0) {
        console.warn(
          "No timeline events found. Check if events are marked as active in admin panel."
        )
      }
      setTimelineData(data)
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch timeline data"
      setError(errorMessage)
      console.error("Timeline fetch error:", err)
      console.error("Error details:", {
        message: err.message,
        response: err.response,
        code: err.code,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTimeline()
  }, [])

  const refetch = () => {
    fetchTimeline()
  }

  const addTimelineItem = async newItem => {
    try {
      setLoading(true)
      const response = await api.createContent(newItem)
      await fetchTimeline() // Refresh the timeline
      return response.data
    } catch (err) {
      setError(err.message || "Failed to add timeline item")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateTimelineItem = async (id, updatedItem) => {
    try {
      setLoading(true)
      const response = await api.updateContent(id, updatedItem)
      await fetchTimeline() // Refresh the timeline
      return response.data
    } catch (err) {
      setError(err.message || "Failed to update timeline item")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeTimelineItem = async id => {
    try {
      setLoading(true)
      await api.deleteContent(id)
      await fetchTimeline() // Refresh the timeline
    } catch (err) {
      setError(err.message || "Failed to remove timeline item")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getTimelineItemById = id => {
    return timelineData.find(item => item.id === parseInt(id))
  }

  const getTimelineItemsByEra = era => {
    return timelineData.filter(item =>
      item.era.toLowerCase().includes(era.toLowerCase())
    )
  }

  const getTimelineItemsByTag = tag => {
    return timelineData.filter(
      item =>
        item.tags &&
        item.tags.some(itemTag =>
          itemTag.toLowerCase().includes(tag.toLowerCase())
        )
    )
  }

  const searchTimeline = query => {
    const lowerQuery = query.toLowerCase()
    return timelineData.filter(
      item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.era.toLowerCase().includes(lowerQuery) ||
        (item.tags &&
          item.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    )
  }

  return {
    timelineData,
    loading,
    error,
    refetch,
    addTimelineItem,
    updateTimelineItem,
    removeTimelineItem,
    getTimelineItemById,
    getTimelineItemsByEra,
    getTimelineItemsByTag,
    searchTimeline,
  }
}
