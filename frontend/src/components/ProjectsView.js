"use client"

import { useState, useEffect } from "react"

const ProjectsView = ({ apiUrl }) => {
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [selectedSkill, setSelectedSkill] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSkills()
    fetchProjects()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await fetch(`${apiUrl}/skills/top`)
      if (!response.ok) {
        throw new Error("Failed to fetch skills")
      }
      const data = await response.json()
      setSkills(data.skills || [])
    } catch (err) {
      console.error("Error fetching skills:", err)
    }
  }

  const fetchProjects = async (skill = "") => {
    try {
      setLoading(true)
      const url = skill ? `${apiUrl}/projects?skill=${encodeURIComponent(skill)}` : `${apiUrl}/projects`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Failed to fetch projects")
      }
      const data = await response.json()
      setProjects(data.projects || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSkillFilter = (skill) => {
    setSelectedSkill(skill)
    fetchProjects(skill)
  }

  if (loading) return <div className="loading">Loading projects...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div>
      <div className="card">
        <h2>Projects</h2>

        <div className="filter-form">
          <label htmlFor="skill-filter">Filter by skill: </label>
          <select id="skill-filter" value={selectedSkill} onChange={(e) => handleSkillFilter(e.target.value)}>
            <option value="">All Projects</option>
            {skills.map((skillObj, index) => (
              <option key={index} value={skillObj.skill}>
                {skillObj.skill} ({skillObj.count})
              </option>
            ))}
          </select>
        </div>

        {projects.length > 0 ? (
          <div>
            <p>Showing {projects.length} project(s)</p>
            {projects.map((project, index) => (
              <div key={index} className="project-item">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                {project.links && project.links.length > 0 && (
                  <div className="project-links">
                    <strong>Links:</strong>
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
        ) : (
          <div className="no-results">
            {selectedSkill ? `No projects found for skill: ${selectedSkill}` : "No projects found"}
          </div>
        )}
      </div>

      <div className="card">
        <h2>Top Skills</h2>
        <div className="skills-list">
          {skills.map((skillObj, index) => (
            <span
              key={index}
              className="skill-tag"
              style={{ cursor: "pointer" }}
              onClick={() => handleSkillFilter(skillObj.skill)}
            >
              {skillObj.skill} ({skillObj.count})
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectsView
