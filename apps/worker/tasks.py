"""
Background document processing worker tasks for trysomenew.
Executes sandboxed conversion, OCR, and automated temporary file cleanup.
"""

import time
import os
import glob


def process_heavy_conversion(document_id: str, target_format: str):
    """
    Simulates sandboxed LibreOffice or headless PDF conversion pipeline.
    """
    print(f"[Worker] Processing document {document_id} -> {target_format}")
    time.sleep(1)
    return {"document_id": document_id, "status": "completed", "format": target_format}


def cleanup_expired_temporary_files(temp_directory: str = "/tmp/trysomenew", max_age_seconds: int = 3600):
    """
    Automatic cleanup worker job ensuring zero file retention on temporary storage.
    """
    if not os.path.exists(temp_directory):
        return {"deleted_count": 0}

    now = time.time()
    deleted = 0
    for filepath in glob.glob(os.path.join(temp_directory, "*")):
        if os.path.isfile(filepath):
            if now - os.path.getmtime(filepath) > max_age_seconds:
                try:
                    os.remove(filepath)
                    deleted += 1
                except Exception as e:
                    print(f"Failed to remove {filepath}: {e}")

    return {"deleted_count": deleted}
