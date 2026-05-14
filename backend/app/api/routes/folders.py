from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.services.folder_service import (
    create_folder,
    list_folders,
    get_owned_folder,
    update_folder,
    delete_folder)
from app.schemas.folder import FolderCreate, FolderResponse, FolderUpdate


router = APIRouter(prefix="/folders", tags=["Folders"])

@router.post(
    "",
    response_model=FolderResponse,
    status_code=status.HTTP_201_CREATED
)
def create_new_folder(
    folder_data: FolderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    return create_folder(
        db=db,
        folder_data=folder_data,
        current_user=current_user
        )

@router.get("", response_model=list[FolderResponse])
def get_folders(
    parent_folder_id: UUID | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return list_folders(
        db=db,
        current_user=current_user,
        parent_folder_id=parent_folder_id
    )
    
@router.get("/{folder_id}", response_model=FolderResponse)
def get_folder(
    folder_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_owned_folder(
        db=db, 
        folder_id=folder_id,
        current_user=current_user
    )
    
@router.patch("/{folder}", response_model=FolderResponse)
def rename_folder(
    folder_id: UUID,
    folder_data: FolderUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return update_folder(
        db=db,
        current_user=current_user,
        folder_id=folder_id,
        folder_data=folder_data
    )

@router.delete("/{folder_id}", response_model=FolderResponse)
def remove_folder(
    folder_id: UUID | None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return delete_folder(
        db=db,
        current_user=current_user,
        folder_id=folder_id
    )