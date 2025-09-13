"use client"

import { useState } from "react"

const SearchView = ({ apiUrl }) => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${apiUrl}/search?q=${encodeURIComponent(query.trim())}`)

      if (!response.ok) {
        throw new Error("Search failed")
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const hasMatches =
    results &&
    (results.matches.name ||
      results.matches.email ||
      results.matches.education ||
      results.matches.skills.length > 0 ||
      results.matches.projects.length > 0)

  return (
    <div>
      <div className="card">
        <h2>Search Profile</h2>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across name, projects, skills, education..."
            disabled={loading}
          />
          <button type="submit" disabled={loading || !query.trim()}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && <div className="error">Error: {error}</div>}

        {results && (
          <div>
            <h3>Search Results for: "{results.query}"</h3>

            {!hasMatches ? (
              <div className="no-results">No matches found</div>
            ) : (
              <div>
                {results.matches.name && (
                  <div className="card">
                    <h4>Name Match</h4>
                    <p>Found match in profile name</p>
                  </div>
                )}

                {results.matches.email && (
                  <div className="card">
                    <h4>Email Match</h4>
                    <p>Found match in email address</p>
                  </div>
                )}

                {results.matches.education && (
                  <div className="card">
                    <h4>Education Match</h4>
                    <p>Found match in education field</p>
                  </div>
                )}

                {results.matches.skills.length > 0 && (
                  <div className="card">
                    <h4>Skills Matches</h4>
                    <div className="skills-list">
                      {results.matches.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {results.matches.projects.length > 0 && (
                  <div className="card">
                    <h4>Project Matches</h4>
                    {results.matches.projects.map((project, index) => (
                      <div key={index} className="project-item">
                        <h5>{project.title}</h5>
                        <p>{project.description}</p>
                        {project.links && project.links.length > 0 && (
                          <div className="project-links">
                            {project.links.map((link, linkIndex) => (
                              <a key={linkIndex} href={link} target="_blank" rel="noopener noreferrer">
                                {link}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchView
