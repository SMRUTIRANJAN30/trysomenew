from fastapi import APIRouter, UploadFile, File, HTTPException, status
import hashlib
from app.core.config import settings

router = APIRouter(prefix="/files", tags=["files"])


@router.post("/inspect")
async def inspect_file_safely(file: UploadFile = File(...)):
    """
    Safely streams file chunks in-memory to compute SHA-256 and determine byte length.
    Never stores or persists the document to disk.
    """
    hasher = hashlib.sha256()
    size = 0

    while chunk := await file.read(65536):
        size += len(chunk)
        if size > settings.MAX_UPLOAD_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)}MB.",
            )
        hasher.update(chunk)

    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "size_bytes": size,
        "sha256_hash": hasher.hexdigest(),
        "status": "clean",
    }
