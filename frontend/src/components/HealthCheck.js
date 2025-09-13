"use client"

import { useState, useEffect } from "react"
import { api } from "../utils/api"

const HealthCheck = () => {
  const [status, setStatus] = useState("checking")
  const [lastChecked, setLastChecked] = useState(null)

  useEffect(() => {
    checkHealth()
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkHealth = async () => {
    try {
      await api.health()
      setStatus("healthy")
      setLastChecked(new Date().toLocaleTimeString())
    } catch (error) {
      setStatus("unhealthy")
      setLastChecked(new Date().toLocaleTimeString())
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "healthy":
        return "#27ae60"
      case "unhealthy":
        return "#e74c3c"
      default:
        return "#f39c12"
    }
  }

  return (
    <div style={{ padding: "0.5rem", fontSize: "0.9rem", color: "#666" }}>
      API Status:{" "}
      <span style={{ color: getStatusColor(), fontWeight: "bold" }}>
        {status === "checking" ? "Checking..." : status.toUpperCase()}
      </span>
      {lastChecked && <span> (Last checked: {lastChecked})</span>}
    </div>
  )
}

export default HealthCheck
