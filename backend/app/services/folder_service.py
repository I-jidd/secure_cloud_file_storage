from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.folder import Folder
from app.schemas.folder import FolderCreate
from app.models.user import User

def get_folder_by_id(db:Session, folder_id:UUID) -> Folder | None:
    return (
        db.query(Folder)
        .filter(Folder.id == folder_id)
        .first()
    )

def get_owned_folder(
    db: Session,
    folder_id: UUID,
    current_user: User
) -> Folder:
    folder = get_folder_by_id(db=db, folder_id=folder_id)
    
    if folder is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Folder not found"
        )
    
    if folder.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this folder"
        )
    
    return folder

def validate_parent_folder(
    db:Session,
    parent_folder_id: UUID | None,
    current_user: User
) -> Folder | None:
    if parent_folder_id is None:
        return None
    
    parent_folder = get_owned_folder(
        db = db,
        folder_id=parent_folder_id,
        current_user=current_user
    )
    
    if parent_folder.is_deleted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create a folder inside a deleted folder"
        )
    
    return parent_folder

def create_folder(
    db: Session,
    folder_data: FolderCreate,
    current_user: User
) -> Folder:
    validate_parent_folder(
        db = db,
        parent_folder_id = folder_data.parent_folder_id,
        current_user = current_user
    )
    
    new_folder = Folder(
        name= folder_data.name,
        owner_id = current_user.id,
        parent_folder_id = folder_data.parent_folder_id
    )
    
    db.add(new_folder)
    db.commit()
    db.refresh(new_folder)
    
    return new_folder

def list_folders(
    db: Session,
    current_user: User,
    parent_folder_id: UUID | None
) -> list[Folder]:
    if parent_folder_id is None:
        validate_parent_folder(
            db=db,
            parent_folder_id=parent_folder_id,
            current_user=current_user
        )
    return(
        db.query(Folder)
        .filter(
            Folder.owner_id == current_user.id,
            Folder.parent_folder ==parent_folder_id,
            Folder.is_deleted == False
        )
        .order_by(Folder.created_at.desc())
        .all()
    )