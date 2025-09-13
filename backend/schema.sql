-- Me-API Playground Database Schema
-- SQLite version

CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    education TEXT,
    skills JSON,  -- Array of skill strings
    projects JSON,  -- Array of project objects: {title, description, links[]}
    links JSON,  -- Object: {github, linkedin, portfolio}
    resume_link VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sample data insert
INSERT OR REPLACE INTO profiles (
    id, name, email, education, skills, projects, links, resume_link
) VALUES (
    1,
    'John Doe',
    'john.doe@example.com',
    'Bachelor of Science in Computer Science',
    '["Python", "JavaScript", "React", "FastAPI", "SQLAlchemy", "Docker"]',
    '[
        {
            "title": "E-commerce Platform",
            "description": "Full-stack e-commerce application with payment integration",
            "links": ["https://github.com/johndoe/ecommerce", "https://ecommerce-demo.com"]
        },
        {
            "title": "Task Management API", 
            "description": "RESTful API for task management with user authentication",
            "links": ["https://github.com/johndoe/task-api"]
        },
        {
            "title": "Data Visualization Dashboard",
            "description": "Interactive dashboard for data analysis using React and D3.js", 
            "links": ["https://github.com/johndoe/data-viz", "https://dataviz-demo.com"]
        }
    ]',
    '{
        "github": "https://github.com/johndoe",
        "linkedin": "https://linkedin.com/in/johndoe", 
        "portfolio": "https://johndoe.dev"
    }',
    'https://johndoe.dev/resume.pdf'
);
