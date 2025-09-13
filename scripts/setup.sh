#!/bin/bash

# Me-API Playground Setup Script

echo "🚀 Setting up Me-API Playground..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Setup backend
echo "📦 Setting up backend..."
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

echo "✅ Backend setup complete"

# Setup frontend
echo "📦 Setting up frontend..."
cd ../frontend

# Install dependencies
npm install

# Create environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file"
fi

echo "✅ Frontend setup complete"

echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Backend: cd backend && python run.py"
echo "2. Frontend: cd frontend && npm start"
echo ""
echo "URLs:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:8000"
echo "- API Docs: http://localhost:8000/docs"
