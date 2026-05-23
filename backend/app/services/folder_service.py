from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import asc, desc
from sqlalchemy.orm import Session

from app.models.folder import Folder, utc_now
from app.schemas.folder import FolderCreate, FolderUpdate
from app.services.activity_log_service import create_activity_log
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
    db.flush()
    
    create_activity_log(
        db=db,
        current_user=current_user,
        action="create",
        entity_type="folder",
        entity_id=new_folder.id,
        details=f"Created folder: {new_folder.name}"
    )
    
    db.commit()
    db.refresh(new_folder)
    
    return new_folder

def list_folders(
    db: Session,
    current_user: User,
    parent_folder_id: UUID | None = None,
    search: str | None = None,
    sort_by: str = "newest"
) -> list[Folder]:
    # if parent_folder_id is None:
    #     validate_parent_folder(
    #         db=db,
    #         parent_folder_id=parent_folder_id,
    #         current_user=current_user
    #     )
    
    
    query = db.query(Folder).filter(
        Folder.owner_id == current_user.id,
        Folder.parent_folder_id == parent_folder_id,
        Folder.is_deleted == False
    )
    
    if search:
        query = query.filter(Folder.name.ilike(f"%{search}%"))
        
    if sort_by == "oldest":
        query = query.order_by(Folder.created_at.asc())
    elif sort_by == "name":
        query = query.order_by(Folder.name.asc())
    else:
        query = query.order_by(Folder.created_at.desc())

    return query.all()

def list_deleted_folders(
    db: Session,
    current_user: User
) -> list[Folder]:
    return(
        db.query(Folder)
        .filter(
            Folder.owner_id == current_user.id,
            Folder.is_deleted == True
        )
        .order_by(Folder.deleted_at.desc())
        .all()
    )

def update_folder(
    db: Session,
    current_user: User,
    folder_id: UUID | None,
    folder_data: FolderUpdate
) -> Folder:
    folder = get_owned_folder(
        db=db,
        folder_id=folder_id,
        current_user=current_user
    )
    
    if folder.is_deleted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot rename a deleted folder"
        )
    
    old_name = folder.name
    folder.name = folder_data.name
    
    create_activity_log(
        db=db,
        current_user=current_user,
        action="rename",
        entity_type="folder",
        entity_id=folder.id,
        details=f"Renamed folder from {old_name} to {folder.name}"
    )
    
    db.commit()
    db.refresh(folder)
    
    return folder

def soft_delete_folder_tree(
    db:Session,
    folder:Folder
) -> None:
    folder.is_deleted = True
    folder.deleted_at = utc_now()
    
    child_folders = (
        db.query(Folder)
        .filter(
            Folder.parent_folder_id == folder.id,
            Folder.owner_id == folder.owner_id
        )
        .all()
    )
    for child_folder in child_folders:
        soft_delete_folder_tree(db=db, folder=child_folder)

def restore_folder_tree(
    db:Session,
    folder: Folder
) -> None: 
    folder.is_deleted = False
    folder.deleted_at = None
    
    child_folders = (
        db.query(Folder)
        .filter(
            Folder.parent_folder_id == folder.id,
            Folder.owner_id == folder.owner_id
        )
        .all()
    )
    for child_folder in child_folders:
        restore_folder_tree(db=db, folder=child_folder)
    
def delete_folder(
    db: Session,
    current_user: User,
    folder_id: UUID,
) -> Folder:
    folder = get_owned_folder(
        db=db,
        current_user=current_user,
        folder_id=folder_id
    )
    
    if folder.is_deleted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Folder is already deleted"
        )
    
    soft_delete_folder_tree(db=db, folder=folder)

    create_activity_log(
        db=db,
        current_user=current_user,
        action="delete",
        entity_type="folder",
        entity_id=folder.id,
        details=f"Deleted folder: {folder.name}"
    )
    
    db.commit()
    db.refresh(folder)
    
    return folder

def restore_folder(
    db: Session,
    folder_id: UUID,
    current_user: User
) -> Folder:
    folder = get_owned_folder(
        db=db,
        folder_id=folder_id,
        current_user=current_user
    )

    if not folder.is_deleted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Folder is not deleted"
        )

    if folder.parent_folder_id is not None:
        parent_folder = get_owned_folder(
            db=db,
            folder_id=folder.parent_folder_id,
            current_user=current_user
        )

        if parent_folder.is_deleted:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot restore this folder while its parent folder is still deleted"
            )

    restore_folder_tree(db=db, folder=folder)

    create_activity_log(
        db=db,
        current_user=current_user,
        action="restore",
        entity_type="folder",
        entity_id=folder.id,
        details=f"Restore folder: {folder.name}"
    )

    db.commit()
    db.refresh(folder)

    return folder