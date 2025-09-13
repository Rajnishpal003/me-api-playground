# Me-API Playground

A full-stack personal profile API playground that stores candidate information in a database, exposes it via a REST API, and provides a minimal frontend to interact with the data.

## 🏗️ Architecture

- **Backend**: Python FastAPI with SQLAlchemy ORM
- **Database**: SQLite (development) / PostgreSQL (production)
- **Frontend**: React with vanilla CSS
- **API**: RESTful endpoints with JSON responses

## 📁 Project Structure

\`\`\`
me-api-playground/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # SQLAlchemy models
│   ├── requirements.txt     # Python dependencies
│   ├── schema.sql          # Database schema
│   ├── run.py              # Development server
│   └── Dockerfile          # Docker configuration
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # API utilities
│   │   ├── App.js          # Main app component
│   │   ├── index.js        # React entry point
│   │   └── index.css       # Styles
│   ├── package.json        # Node dependencies
│   └── .env.example        # Environment variables template
└── README.md               # This file
\`\`\`

## 🚀 Local Development Setup

### Prerequisites

- Python 3.11+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   \`\`\`bash
   cd backend
   \`\`\`

2. **Create virtual environment**
   \`\`\`bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   \`\`\`

3. **Install dependencies**
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   python run.py
   \`\`\`

   The API will be available at:
   - **API**: http://localhost:8000
   - **Interactive Docs**: http://localhost:8000/docs
   - **Health Check**: http://localhost:8000/health

### Frontend Setup

1. **Navigate to frontend directory**
   \`\`\`bash
   cd frontend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Create environment file**
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. **Start development server**
   \`\`\`bash
   npm start
   \`\`\`

   The frontend will be available at http://localhost:3000

## 📡 API Endpoints

### Health & Status
- `GET /health` - Health check endpoint

### Profile Management
- `GET /profile` - Fetch current profile
- `POST /profile` - Create/replace profile
- `PUT /profile` - Update existing profile

### Projects & Skills
- `GET /projects` - Get all projects
- `GET /projects?skill=python` - Filter projects by skill
- `GET /skills/top` - Get top skills with counts

### Search
- `GET /search?q=query` - Search across profile data

## 🧪 API Testing with cURL

### Health Check
\`\`\`bash
curl http://localhost:8000/health
\`\`\`

### Get Profile
\`\`\`bash
curl http://localhost:8000/profile
\`\`\`

### Create Profile
\`\`\`bash
curl -X POST http://localhost:8000/profile \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "education": "MS Computer Science",
    "skills": ["Python", "React", "Docker"],
    "projects": [
      {
        "title": "Portfolio Website",
        "description": "Personal portfolio built with React",
        "links": ["https://github.com/jane/portfolio"]
      }
    ],
    "links": {
      "github": "https://github.com/jane",
      "linkedin": "https://linkedin.com/in/jane"
    },
    "resume_link": "https://jane.dev/resume.pdf"
  }'
\`\`\`

### Search Profile
\`\`\`bash
curl "http://localhost:8000/search?q=Python"
\`\`\`

### Filter Projects by Skill
\`\`\`bash
curl "http://localhost:8000/projects?skill=React"
\`\`\`

### Get Top Skills
\`\`\`bash
curl http://localhost:8000/skills/top
\`\`\`

## 🐳 Docker Deployment

### Backend Docker Build
\`\`\`bash
cd backend
docker build -t me-api-backend .
docker run -p 8000:8000 me-api-backend
\`\`\`

### Production Environment Variables
\`\`\`bash
# For PostgreSQL in production
DATABASE_URL=postgresql://user:password@host:port/database
\`\`\`

## 🌐 Deployment Instructions

### Backend Deployment (Render/Heroku)

#### Render
1. Connect your GitHub repository
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables if using PostgreSQL

#### Heroku
\`\`\`bash
# Install Heroku CLI and login
heroku create your-api-name
heroku config:set DATABASE_URL=your_postgres_url  # if using PostgreSQL
git subtree push --prefix backend heroku main
\`\`\`

### Frontend Deployment (Vercel/Netlify)

#### Vercel
\`\`\`bash
# Install Vercel CLI
npm i -g vercel
cd frontend
vercel --prod
\`\`\`

#### Netlify
1. Connect GitHub repository
2. Set build directory: `frontend`
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Add environment variable: `REACT_APP_API_URL=https://your-api-domain.com`

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
\`\`\`bash
REACT_APP_API_URL=http://localhost:8000  # Development
# REACT_APP_API_URL=https://your-api-domain.com  # Production
\`\`\`

#### Backend
\`\`\`bash
DATABASE_URL=sqlite:///./me_api.db  # Development
# DATABASE_URL=postgresql://user:pass@host:port/db  # Production
\`\`\`

## 📊 Database Schema

The application uses a single `profiles` table with the following structure:

\`\`\`sql
CREATE TABLE profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    education TEXT,
    skills JSON,        -- Array of skill strings
    projects JSON,      -- Array of project objects
    links JSON,         -- Object with social links
    resume_link VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## ✨ Features

### Implemented
- ✅ Full CRUD operations for profile data
- ✅ Project filtering by skills
- ✅ Full-text search across profile data
- ✅ Responsive React frontend
- ✅ API health monitoring
- ✅ Error handling and loading states
- ✅ Docker containerization
- ✅ Comprehensive API documentation

### Frontend Views
- **Profile View**: Display complete profile information
- **Projects View**: Browse and filter projects by skills
- **Search View**: Search across all profile data

## 🚧 Known Limitations

- **Single Profile**: System supports only one profile at a time
- **Simple Search**: Basic text matching, no advanced search features
- **No Authentication**: All endpoints are publicly accessible
- **No Pagination**: All results returned at once
- **SQLite Limitations**: File-based database not suitable for high concurrency

## 🔮 Future Enhancements

- [ ] Multi-user support with authentication
- [ ] Advanced search with filters and sorting
- [ ] Pagination for large datasets
- [ ] Rate limiting and API security
- [ ] Unit and integration tests
- [ ] Logging and monitoring
- [ ] Profile image uploads
- [ ] Export functionality (PDF, JSON)

## 🧪 Testing

### Manual Testing Checklist
- [ ] Health endpoint returns 200 OK
- [ ] Profile data loads in frontend
- [ ] Search functionality works
- [ ] Project filtering works
- [ ] All API endpoints respond correctly

### Running Tests (Future)
\`\`\`bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

For questions or issues:
1. Check the API documentation at `/docs`
2. Review this README
3. Open an issue on GitHub

---

**Happy coding!** 🚀
