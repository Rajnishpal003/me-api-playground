// API utility functions for Me-API Playground

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000"

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`

    try {
      const errorJson = JSON.parse(errorText)
      errorMessage = errorJson.detail || errorMessage
    } catch {
      // If not JSON, use the text as is
      errorMessage = errorText || errorMessage
    }

    throw new ApiError(errorMessage, response.status)
  }

  return response.json()
}

export const api = {
  // Health check
  health: async () => {
    const response = await fetch(`${API_BASE_URL}/health`)
    return handleResponse(response)
  },

  // Profile operations
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/profile`)
    return handleResponse(response)
  },

  createProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    })
    return handleResponse(response)
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    })
    return handleResponse(response)
  },

  // Projects operations
  getProjects: async (skill = null) => {
    const url = skill ? `${API_BASE_URL}/projects?skill=${encodeURIComponent(skill)}` : `${API_BASE_URL}/projects`

    const response = await fetch(url)
    return handleResponse(response)
  },

  // Skills operations
  getTopSkills: async () => {
    const response = await fetch(`${API_BASE_URL}/skills/top`)
    return handleResponse(response)
  },

  // Search operations
  search: async (query) => {
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`)
    return handleResponse(response)
  },
}

export { ApiError }
