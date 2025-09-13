"use client"

import { useState, useEffect } from "react"
import { api, ApiError } from "../utils/api"

// Custom hook for API calls with loading and error states
export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await apiCall()
        if (isMounted) {
          setData(result)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof ApiError ? err.message : "An unexpected error occurred")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, dependencies)

  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiCall()
      setData(result)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch }
}

// Hook for profile data
export const useProfile = () => {
  return useApi(() => api.getProfile())
}

// Hook for projects data
export const useProjects = (skill = null) => {
  return useApi(() => api.getProjects(skill), [skill])
}

// Hook for skills data
export const useSkills = () => {
  return useApi(() => api.getTopSkills())
}
