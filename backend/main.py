from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import uvicorn
from models import Profile, get_db, create_tables, seed_default_profile
from collections import Counter

app = FastAPI(title="profile Playground", version="1.0.0")

origins = [
    "https://me-api-playground-rose.vercel.app",  # your frontend
    "http://localhost:3000",   # optional: for local dev
]

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def read_root():
    return {"status": "Backend is running 🚀"}
# Pydantic models for request/response
class ProjectModel(BaseModel):
    title: str
    description: str
    links: List[str] = []

class LinksModel(BaseModel):
    github: Optional[str] = None
    linkedin: Optional[str] = None
    portfolio: Optional[str] = None

class ProfileCreate(BaseModel):
    name: str
    email: str
    education: Optional[str] = None
    skills: List[str] = []
    projects: List[ProjectModel] = []
    links: LinksModel = LinksModel()
    resume_link: Optional[str] = None

class ProfileResponse(BaseModel):
    id: int
    name: str
    email: str
    education: Optional[str]
    skills: List[str]
    projects: List[dict]
    links: dict
    resume_link: Optional[str]
    created_at: Optional[str]
    updated_at: Optional[str]

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    create_tables()
    seed_default_profile()

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok"}

# Get profile
@app.get("/profile", response_model=ProfileResponse)
async def get_profile(db: Session = Depends(get_db)):
    profile = db.query(Profile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return ProfileResponse(**profile.to_dict())

# Create/seed profile (replace existing)
@app.post("/profile", response_model=ProfileResponse)
async def create_profile(profile_data: ProfileCreate, db: Session = Depends(get_db)):
    # Delete existing profile if any
    existing_profile = db.query(Profile).first()
    if existing_profile:
        db.delete(existing_profile)
    
    # Convert Pydantic models to dict for JSON storage
    projects_dict = [project.dict() for project in profile_data.projects]
    links_dict = profile_data.links.dict()
    
    # Create new profile
    new_profile = Profile(
        name=profile_data.name,
        email=profile_data.email,
        education=profile_data.education,
        skills=profile_data.skills,
        projects=projects_dict,
        links=links_dict,
        resume_link=profile_data.resume_link
    )
    
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    
    return ProfileResponse(**new_profile.to_dict())

# Update profile
@app.put("/profile", response_model=ProfileResponse)
async def update_profile(profile_data: ProfileCreate, db: Session = Depends(get_db)):
    profile = db.query(Profile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Convert Pydantic models to dict for JSON storage
    projects_dict = [project.dict() for project in profile_data.projects]
    links_dict = profile_data.links.dict()
    
    # Update profile fields
    profile.name = profile_data.name
    profile.email = profile_data.email
    profile.education = profile_data.education
    profile.skills = profile_data.skills
    profile.projects = projects_dict
    profile.links = links_dict
    profile.resume_link = profile_data.resume_link
    
    db.commit()
    db.refresh(profile)
    
    return ProfileResponse(**profile.to_dict())

# Get projects filtered by skill
@app.get("/projects")
async def get_projects(skill: Optional[str] = None, db: Session = Depends(get_db)):
    profile = db.query(Profile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    projects = profile.projects or []
    
    if skill:
        # Filter projects that mention the skill in title or description
        filtered_projects = []
        skill_lower = skill.lower()
        
        for project in projects:
            # Check if skill is mentioned in project title, description, or profile skills
            title_match = skill_lower in project.get('title', '').lower()
            desc_match = skill_lower in project.get('description', '').lower()
            skill_match = skill_lower in [s.lower() for s in (profile.skills or [])]
            
            if title_match or desc_match or skill_match:
                filtered_projects.append(project)
        
        projects = filtered_projects
    
    return {"projects": projects, "total": len(projects)}

# Get top skills with counts
@app.get("/skills/top")
async def get_top_skills(db: Session = Depends(get_db)):
    profile = db.query(Profile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    skills = profile.skills or []
    
    # Count skills (in a real app, this would aggregate across multiple profiles)
    skill_counts = Counter(skills)
    
    # Convert to list of dicts sorted by count
    top_skills = [
        {"skill": skill, "count": count}
        for skill, count in skill_counts.most_common()
    ]
    
    return {"skills": top_skills}

# Search across name, projects, and skills
@app.get("/search")
async def search_profile(q: str, db: Session = Depends(get_db)):
    if not q:
        raise HTTPException(status_code=400, detail="Query parameter 'q' is required")
    
    profile = db.query(Profile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    query_lower = q.lower()
    results = {
        "query": q,
        "matches": {
            "name": False,
            "email": False,
            "education": False,
            "skills": [],
            "projects": []
        }
    }
    
    # Search in name
    if query_lower in profile.name.lower():
        results["matches"]["name"] = True
    
    # Search in email
    if query_lower in profile.email.lower():
        results["matches"]["email"] = True
    
    # Search in education
    if profile.education and query_lower in profile.education.lower():
        results["matches"]["education"] = True
    
    # Search in skills
    matching_skills = [
        skill for skill in (profile.skills or [])
        if query_lower in skill.lower()
    ]
    results["matches"]["skills"] = matching_skills
    
    # Search in projects
    matching_projects = []
    for project in (profile.projects or []):
        title_match = query_lower in project.get('title', '').lower()
        desc_match = query_lower in project.get('description', '').lower()
        
        if title_match or desc_match:
            matching_projects.append(project)
    
    results["matches"]["projects"] = matching_projects
    
    return results

if __name__ == "__main__":
    import os

    port = int(os.environ.get("PORT", 8000))  # Use Render's port or fallback to 8000 locally
    uvicorn.run(app, host="0.0.0.0", port=port)
