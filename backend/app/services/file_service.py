from uuid import UUID
from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.models.file import File, utc_now
from app.models.folder import Folder
from app.models.user import User
from app.core.config import settings
from app.services.folder_service import get_owned_folder
from app.services.activity_log_service import create_activity_log
from app.storage.local_storage import save_upload_file
from app.schemas.file import FileUpdate

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
        db.flush()
        
        create_activity_log(
            db=db,
            current_user=current_user,
            action="upload",
            entity_id=new_file.id,
            entity_type="file",
            details=f"Uploaded file: {new_file.original_name}"
        )
        
        db.commit()
        db.refresh(new_file)

        return new_file

    except Exception:
        db.rollback()
        raise
    
def list_files(
    db: Session,
    current_user: User,
    folder_id: UUID | None = None,
    search: str | None = None,
    mime_type: str | None = None,
    sort_by: str = "newest"
) -> list[File]:
    if folder_id is not None:
        validate_target_folder(
            db=db,
            current_user=current_user,
            folder_id=folder_id
        )
    
    query = db.query(File).filter(
        File.owner_id == current_user.id,
        File.folder_id == folder_id,
        File.is_deleted == False
    )
    
    if search:
        query = query.filter(File.original_name.ilike(f"%{search}%"))
            
    if mime_type:
        query = query.filter(File.mime_type == mime_type)
    
    if sort_by == "oldest":
        query = query.order_by(File.created_at.asc())
    elif sort_by == "name":
        query = query.order_by(File.original_name.asc())
    elif sort_by == "size":
        query = query.order_by(File.size_bytes.desc())
    else:
        query = query.order_by(File.created_at.desc())
        
    return query.all()

def list_deleted_files(
    db:Session,
    current_user: User
) -> list[File]:
    return (
        db.query(File)
        .filter(
            File.owner_id == current_user.id,
            File.is_deleted == True
        )
        .order_by(File.deleted_at.desc())
        .all()
    )

def get_owned_file(
    db: Session,
    current_user: User,
    file_id: UUID,
) -> File:
    file_record = (
        db.query(File)
        .filter(File.id == file_id)
        .first()
    )

    if file_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    if file_record.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail = "You do not have permission to access this file"
        )
    
    return file_record

def get_file_for_download(
    db: Session,
    current_user: User,
    file_id: UUID
) -> File:
    file_record = get_owned_file(
        db=db,
        current_user=current_user,
        file_id=file_id
    )

    if file_record.is_deleted:
        raise HTTPException(
            status_code= status.HTTP_400_BAD_REQUEST,
            detail="Cannot download a deleted file"
        )
    
    storage_path = Path(file_record.storage_path)
    
    if not storage_path.exists() or not storage_path.is_file():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stored file not found on disk"
        )
    
    create_activity_log(
        db=db,
        current_user=current_user,
        action = "download",
        entity_type="file",
        entity_id= file_record.id,
        details=f"Downloaded file: {file_record.original_name}"
    )
    db.commit()
    
    return file_record

def update_file(
    db:Session,
    current_user: User,
    file_id: UUID,
    file_data: FileUpdate
) -> File:
    file_record = get_owned_file(
        db=db,
        current_user=current_user,
        file_id=file_id
    )
    
    if file_record.is_deleted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot rename a deleted file"
        )
    
    old_name = file_record.original_name
    file_record.original_name = file_data.original_name
    
    create_activity_log(
        db=db,
        current_user=current_user,
        action="rename",
        entity_type="file",
        entity_id=file_record.id,
        details=f"Renamed file from {old_name} to {file_record.original_name}"
    )
    
    db.commit()
    db.refresh(file_record)
    
    return file_record

def delete_file(
    db:Session,
    current_user: User,
    file_id: UUID
) -> File:
    file_record = get_owned_file(
        db=db,
        current_user=current_user,
        file_id=file_id
    )
    
    if file_record.is_deleted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File is already deleted"
        )
    
    file_record.is_deleted = True
    file_record.deleted_at = utc_now()
    
    create_activity_log(
        db=db,
        current_user=current_user,
        action="delete",
        entity_type="file",
        entity_id=file_record.id,
        details=f"Deleted file: {file_record.original_name}"
    )
    
    db.commit()
    db.refresh(file_record)
    
    return file_record

def restore_file(
    db:Session,
    current_user: User,
    file_id: UUID
) -> File:
    
    file_record = get_owned_file(
        db=db,
        current_user=current_user,
        file_id=file_id
    )
    
    if not file_record.is_deleted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File is not deleted"
        )
    
    if file_record.folder_id is not None:
        folder = get_owned_folder(
            db=db,
            folder_id=folder,
            current_user=current_user
        )
        
        if folder.is_deleted:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot restore file while its folder is deleted"
            )
        
    file_record.is_deleted = False
    file_record.deleted_at = None
    
    create_activity_log(
        db=db,
        current_user=current_user,
        action="restore",
        entity_type="file",
        entity_id=file_record.id,
        details=f"Restored file: {file_record.original_name}"
    )
    
    db.commit()
    db.refresh(file_record)
    
    return file_record
    