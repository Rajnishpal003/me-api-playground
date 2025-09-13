#!/usr/bin/env python3
"""
Development server runner for Me-API Playground
"""
import uvicorn
from main import app

if __name__ == "__main__":
    print("Starting Me-API Playground Backend...")
    print("API Documentation: http://localhost:8000/docs")
    print("Health Check: http://localhost:8000/health")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Enable auto-reload for development
        log_level="info"
    )
