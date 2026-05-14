from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.services.folder_service import create_folder, list_folders
from app.schemas.folder import FolderCreate, FolderResponse


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