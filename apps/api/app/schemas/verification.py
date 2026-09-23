from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class DocumentRegistrationRequest(BaseModel):
    name: str = Field(..., description="Document filename")
    hash: str = Field(..., min_length=64, max_length=64, description="Hexadecimal SHA-256 hash")
    file_size_bytes: int = Field(..., gt=0, description="Binary size in bytes")
    mime_type: str = Field("application/pdf", description="MIME type of document")
    issuer: str = Field("trysomenew Integrity Ledger", description="Issuing authority")
    notes: Optional[str] = None


class VerificationRecordResponse(BaseModel):
    id: str
    name: str
    hash: str
    file_size_bytes: int
    mime_type: str
    version: int
    issued_at: datetime
    issuer: str
    verified: bool
    notes: Optional[str] = None


class HashVerifyRequest(BaseModel):
    expected_hash: str
    candidate_hash: str


class HashVerifyResponse(BaseModel):
    matches: bool
    status: str
    timestamp: datetime
