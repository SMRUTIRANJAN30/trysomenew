from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
from app.core.config import settings
from app.routers import health, verify, files, signaling

app = FastAPI(
    title=f"{settings.PROJECT_NAME} API",
    description="Scalable, fast, privacy-first document productivity backend for trysomenew.com",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time-Sec"] = f"{process_time:.4f}"
    response.headers["X-Platform"] = "trysomenew"
    return response


# Include modular routers under API_V1_STR
app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(verify.router, prefix=settings.API_V1_STR)
app.include_router(files.router, prefix=settings.API_V1_STR)
app.include_router(signaling.router)


@app.get("/")
async def root():
    return {
        "platform": settings.PROJECT_NAME,
        "message": "One fast workspace for documents, files and devices.",
        "documentation": "/docs",
        "health": f"{settings.API_V1_STR}/health",
    }
