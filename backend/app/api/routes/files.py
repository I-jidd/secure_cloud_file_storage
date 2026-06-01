from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, Query, UploadFile, status
from fastapi.responses import FileResponse as FastAPIFileResponse
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.file import FileResponse, FileUpdate
from app.services.file_service import (
     create_file_metadata,
     list_files,
     get_file_for_download,
     update_file,
     delete_file,
     restore_file,
     list_deleted_files)


router = APIRouter(prefix="/files", tags=["Files"])


@router.post(
    "/upload",
    response_model=FileResponse,
    status_code=status.HTTP_201_CREATED
)
def upload_file(
    upload_file: UploadFile = File(...),
    folder_id: UUID | None = Form(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_file_metadata(
        db=db,
        upload_file=upload_file,
        current_user=current_user,
        folder_id=folder_id
    )

@router.get("", response_model=list[FileResponse])
def get_files(
    folder_id: UUID | None = None,
    search: str | None = Query(default=None, max_length=255),
    mime_type: str | None = Query(default= None, max_length=100),
    sort_by: str = Query(default="newest", pattern ="^(newest|oldest|name|size)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return list_files(
        db=db,
        current_user=current_user,
        folder_id=folder_id,
        search=search,
        mime_type=mime_type,
        sort_by=sort_by
    )
  
@router.get("/trash",response_model=list[FileResponse])
def get_deleted_files(
    db:Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return list_deleted_files(
        db=db,
        current_user=current_user
    )  

@router.get("/{file_id}/download")
def download_file(
    file_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    file_record = get_file_for_download(
        db=db,
        current_user=current_user,
        file_id=file_id
    )
    
    return FastAPIFileResponse(
        path = file_record.storage_path,
        filename= file_record.original_name,
        media_type=file_record.mime_type or "application/octet-stream"
    )

@router.patch("/{file_id}", response_model=FileResponse)
def rename_file(
    file_id: UUID,
    file_data: FileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_file(
        db=db,
        file_id=file_id,
        file_data=file_data,
        current_user=current_user
    )

@router.delete("/{file_id}", response_model=FileResponse)
def remove_file(
    db:Session = Depends(get_db),
    current_user : User = Depends(get_current_user),
    file_id = UUID
):
    return delete_file(
        db=db,
        current_user=current_user,
        file_id=file_id
    )

@router.patch("/{file_id}/restore", response_model=FileResponse)
def restore_deleted_file(
    db:Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    file_id = UUID
):
    return restore_file(
        db=db,
        current_user=current_user,
        file_id=file_id
    )