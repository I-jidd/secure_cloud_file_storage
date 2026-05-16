import shutil
import uuid
from pathlib import Path

from fastapi import UploadFile

from app.core.config import settings

def get_storage_directory() -> Path:
    storage_dir = Path(settings.LOCAL_STORAGE_PATH)
    storage_dir.mkdir(parents=True, exist_ok=True)
    
    return storage_dir

def get_file_extension(filename:str) -> str:
    return Path(filename).suffix.lower()

def generate_stored_filename(original_filename: str) -> str:
    file_extension = get_file_extension(original_filename)
    return f"{uuid.uuid4()}{file_extension}"

def save_upload_file(upload_file: UploadFile) -> tuple[str, str]:
    storage_dir = get_storage_directory()
    stored_name = generate_stored_filename(upload_file.filename or "upload_file")
    destination_path = storage_dir / stored_name
    
    with destination_path.open("wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    
    return stored_name, str(destination_path)

def delete_stored_file(storage_path: str) -> None:
    path = Path(storage_path)
    
    if path.exists() and path.is_file():
        path.unlink()