# Security & Privacy Policy

At **trysomenew**, document privacy and cryptographic integrity are our foundational engineering principles.

## Core Security Tenets

1. **Local-First Processing**: All Phase 1 document tools (Merge, Split, Rotate, Compress, PDF to Image, and SHA-256 Hashing) execute strictly inside the client's web browser using WebAssembly and HTML5 Canvas. No file contents are transmitted across network boundaries for these operations.
2. **Zero Permanent Storage**: Ephemeral clipboard rooms and P2P WebRTC QuickSend transfers use temporary in-memory signaling. We do not maintain persistent backups of transferred documents.
3. **Authentic Cryptographic Verification**: Document verification uses standard NIST SHA-256 algorithms. We never display misleading "verified" graphics without authenticating underlying cryptographic digests.
4. **Sandboxed Worker Environments**: Server-assisted fallback processing operates in isolated container runtimes with strict execution timeouts and automatic file shredding after job completion.

## Reporting a Vulnerability

If you discover a potential security vulnerability within **trysomenew**, please report it immediately:

- **Email**: security@trysomenew.com
- Please include steps to reproduce the issue and any relevant proof-of-concept payloads.
- We will acknowledge receipt of your vulnerability report within 24 hours.
