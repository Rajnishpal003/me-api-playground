"use client"

import { useState } from "react"
import ProfileView from "./components/ProfileView"
import ProjectsView from "./components/ProjectsView"
import SearchView from "./components/SearchView"
import HealthCheck from "./components/HealthCheck"

// Strip trailing slash to avoid double slashes in fetch URLs
const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:8000").replace(/\/$/, "")

function App() {
  const [currentView, setCurrentView] = useState("profile")

  const renderView = () => {
    switch (currentView) {
      case "profile":
        return <ProfileView apiUrl={API_URL} />
      case "projects":
        return <ProjectsView apiUrl={API_URL} />
      case "search":
        return <SearchView apiUrl={API_URL} />
      default:
        return <ProfileView apiUrl={API_URL} />
    }
  }

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <h1>Me-API Playground</h1>
          <nav className="nav">
            <button className={currentView === "profile" ? "active" : ""} onClick={() => setCurrentView("profile")}>
              Profile
            </button>
            <button className={currentView === "projects" ? "active" : ""} onClick={() => setCurrentView("projects")}>
              Projects
            </button>
            <button className={currentView === "search" ? "active" : ""} onClick={() => setCurrentView("search")}>
              Search
            </button>
          </nav>
          <HealthCheck apiUrl={API_URL} />
        </div>
      </header>

      <main className="container">{renderView()}</main>
    </div>
  )
}

export default App
