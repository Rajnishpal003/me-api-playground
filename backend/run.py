import os
import uvicorn
from main import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))  # use Render's PORT, fallback 8000 locally
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=os.environ.get("RENDER") is None,  # disable reload in production
        log_level="info"
    )
