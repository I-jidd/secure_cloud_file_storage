from uuid import UUID

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.models.file import File
from app.models.folder import Folder
from app.models.user import User
from app.core.config import settings
from app.services.folder_service import get_owned_folder
from app.storage.local_storage import save_upload_file

def validate_file_type(upload_file: UploadFile) -> None:
    if upload_file.content_type not in settings.allowed_file_types_list:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File type is not allowed"
        )

def validate_file_size(upload_file: UploadFile) -> int: 
    upload_file.file.seek(0,2)
    file_size = upload_file.file.tell()
    upload_file.file.seek(0)
    
    if file_size> settings.max_file_size_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds {settings.MAX_FILE_SIZE_MB} MB limit"
        )
    return file_size

def validate_target_folder(
    db: Session,
    current_user: User,
    folder_id: UUID | None
) -> Folder | None:
    if folder_id is None:
        return None
    
    folder = get_owned_folder(
        db=db, 
        folder_id=folder_id,
        current_user=current_user
    )
    
    if folder.is_deleted:
        raise HTTPException(
            status_code= status.HTTP_400_BAD_REQUEST,
            detail= "Cannot upload file into a deleted folder"
        )
    
    return folder

def create_file_metadata(
    db: Session,
    upload_file: UploadFile,
    current_user: User,
    folder_id: UUID | None = None
) -> File:
    validate_file_type(upload_file)
    file_size = validate_file_size(upload_file)

    validate_target_folder(
        db=db,
        folder_id=folder_id,
        current_user=current_user
    )

    stored_name, storage_path = save_upload_file(upload_file)

    try:
        new_file = File(
            original_name=upload_file.filename or stored_name,
            stored_name=stored_name,
            storage_path=storage_path,
            mime_type=upload_file.content_type,
            size_bytes=file_size,
            owner_id=current_user.id,
            folder_id=folder_id
        )

        db.add(new_file)
        db.commit()
        db.refresh(new_file)

        return new_file

    except Exception:
        db.rollback()
        raise