"use client"

import { useState, useEffect } from "react"

const ProfileView = ({ apiUrl }) => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${apiUrl}/profile`)
      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }
      const data = await response.json()
      setProfile(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading profile...</div>
  if (error) return <div className="error">Error: {error}</div>
  if (!profile) return <div className="no-results">No profile found</div>

  return (
    <div>
      <div className="card">
        <h2>Profile Information</h2>
        <div className="profile-info">
          <div>
            <h3>Personal Details</h3>
            <p>
              <strong>Name:</strong> {profile.name}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            {profile.education && (
              <p>
                <strong>Education:</strong> {profile.education}
              </p>
            )}
            {profile.resume_link && (
              <p>
                <strong>Resume:</strong>{" "}
                <a href={profile.resume_link} target="_blank" rel="noopener noreferrer">
                  View Resume
                </a>
              </p>
            )}
          </div>

          <div>
            <h3>Skills</h3>
            <div className="skills-list">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))
              ) : (
                <p>No skills listed</p>
              )}
            </div>
          </div>
        </div>

        {profile.links && Object.keys(profile.links).length > 0 && (
          <div>
            <h3>Links</h3>
            <div className="social-links">
              {profile.links.github && (
                <a href={profile.links.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
              {profile.links.linkedin && (
                <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              )}
              {profile.links.portfolio && (
                <a href={profile.links.portfolio} target="_blank" rel="noopener noreferrer">
                  Portfolio
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h2>Projects</h2>
        {profile.projects && profile.projects.length > 0 ? (
          profile.projects.map((project, index) => (
            <div key={index} className="project-item">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {project.links && project.links.length > 0 && (
                <div className="project-links">
                  {project.links.map((link, linkIndex) => (
                    <a key={linkIndex} href={link} target="_blank" rel="noopener noreferrer">
                      Link {linkIndex + 1}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No projects found</p>
        )}
      </div>
    </div>
  )
}

export default ProfileView
