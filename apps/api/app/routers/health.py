from fastapi import APIRouter
from datetime import datetime

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check():
    return {
        "status": "online",
        "service": "trysomenew-api",
        "version": "1.0.0",
        "environment": "development",
        "timestamp": datetime.utcnow().isoformat(),
        "capabilities": [
            "sha256-cryptographic-ledger",
            "pdf-inspection",
            "ephemeral-signaling",
            "local-first-orchestration",
        ],
    }
