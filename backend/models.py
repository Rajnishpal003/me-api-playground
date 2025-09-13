from sqlalchemy import Column, Integer, String, Text, JSON, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import json

Base = declarative_base()

class Profile(Base):
    __tablename__ = "profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    education = Column(Text, nullable=True)
    skills = Column(JSON, nullable=True)  # List of strings
    projects = Column(JSON, nullable=True)  # List of project objects
    links = Column(JSON, nullable=True)  # Object with github, linkedin, portfolio
    resume_link = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "education": self.education,
            "skills": self.skills or [],
            "projects": self.projects or [],
            "links": self.links or {},
            "resume_link": self.resume_link,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

# Database configuration
DATABASE_URL = "sqlite:///./me_api.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    Base.metadata.create_all(bind=engine)

def seed_default_profile():
    """Seed the database with a default profile"""
    db = SessionLocal()
    try:
        # Check if profile already exists
        existing_profile = db.query(Profile).first()
        if existing_profile:
            return existing_profile
        
        # Create default profile
        default_profile = Profile(
            name="John Doe",
            email="john.doe@example.com",
            education="Bachelor of Science in Computer Science",
            skills=["Python", "JavaScript", "React", "FastAPI", "SQLAlchemy", "Docker"],
            projects=[
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
            ],
            links={
                "github": "https://github.com/johndoe",
                "linkedin": "https://linkedin.com/in/johndoe",
                "portfolio": "https://johndoe.dev"
            },
            resume_link="https://johndoe.dev/resume.pdf"
        )
        
        db.add(default_profile)
        db.commit()
        db.refresh(default_profile)
        return default_profile
    finally:
        db.close()
