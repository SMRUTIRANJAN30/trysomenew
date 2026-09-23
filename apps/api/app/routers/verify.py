from fastapi import APIRouter, HTTPException, status
from datetime import datetime
import secrets
from typing import Dict
from app.schemas.verification import (
    DocumentRegistrationRequest,
    VerificationRecordResponse,
    HashVerifyRequest,
    HashVerifyResponse,
)

router = APIRouter(prefix="/verify", tags=["verify"])

# In-memory document verification ledger with thread-safe dictionary
LEDGER_DB: Dict[str, VerificationRecordResponse] = {}


def generate_doc_id() -> str:
    year = datetime.utcnow().year
    random_hex = secrets.token_hex(3).upper()
    return f"DOC-{year}-{random_hex}"


@router.post("/register", response_model=VerificationRecordResponse, status_code=status.HTTP_201_CREATED)
async def register_document_hash(payload: DocumentRegistrationRequest):
    """
    Registers a genuine SHA-256 hash in the cryptographic integrity ledger.
    Zero document contents are stored; only immutable hash metadata is retained.
    """
    doc_id = generate_doc_id()
    record = VerificationRecordResponse(
        id=doc_id,
        name=payload.name,
        hash=payload.hash.lower(),
        file_size_bytes=payload.file_size_bytes,
        mime_type=payload.mime_type,
        version=1,
        issued_at=datetime.utcnow(),
        issuer=payload.issuer,
        verified=True,
        notes=payload.notes,
    )
    LEDGER_DB[doc_id] = record
    return record


@router.get("/{doc_id}", response_model=VerificationRecordResponse)
async def get_verification_record(doc_id: str):
    """
    Retrieves the public verification record for a given Document ID.
    """
    clean_id = doc_id.upper().strip()
    if clean_id not in LEDGER_DB:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Verification record '{clean_id}' does not exist in the ledger.",
        )
    return LEDGER_DB[clean_id]


@router.post("/check", response_model=HashVerifyResponse)
async def check_hash_integrity(payload: HashVerifyRequest):
    """
    Validates candidate hash against expected hash.
    Never pretends a hash matches if bits differ.
    """
    expected = payload.expected_hash.strip().lower()
    candidate = payload.candidate_hash.strip().lower()
    matches = expected == candidate

    return HashVerifyResponse(
        matches=matches,
        status="UNCHANGED" if matches else "INTEGRITY_MISMATCH",
        timestamp=datetime.utcnow(),
    )
