#!/usr/bin/env python3
"""
Development/Production server runner for Me-API Playground
"""
import os
import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))  # default to 8000 locally
    print(f"Starting Me-API Playground Backend on port {port}...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=os.environ.get("RENDER", None) is None,  # disable reload on Render
        log_level="info"
    )
