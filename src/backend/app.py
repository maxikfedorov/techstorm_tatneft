# src/backend/app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import ai
import httpx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

http_client = None

@app.on_event("startup")
async def startup_event():
    global http_client
    http_client = httpx.AsyncClient(timeout=30.0)

@app.on_event("shutdown") 
async def shutdown_event():
    global http_client
    if http_client:
        await http_client.aclose()

app.include_router(ai.router, prefix="/api")

@app.get("/api/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
