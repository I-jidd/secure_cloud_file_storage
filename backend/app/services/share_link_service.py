import secrets
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.file import File
from app.models.share_link import ShareLink
from app.models.user import User
from app.schemas.share_link import ShareLinkCreate
from app.services.activity_log_service import create_activity_log
from app.services.file_service import get_owned_file

def generate_share_token() -> str:
    return secrets.token_urlsafe(32)

def format_share_link_response(share_link: ShareLink) -> dict:
    return {
        "id": share_link.id,
        "token": share_link.token,
        "file_id": share_link.file_id,
        "owner_id": share_link.owner_id,
        "is_active": share_link.is_active,
        "has_password": share_link.password_hash is not None,
        "expires_at": share_link.expires_at,
        "created_at": share_link.created_at,
        "updated_at": share_link.updated_at
    }

def create_share_link(
    db: Session,
    file_id: UUID,
    share_data: ShareLinkCreate,
    current_user: User
) -> dict:
    file_record = get_owned_file(
        db = db,
        current_user= current_user,
        file_id=file_id
    )
    
    if file_record.is_deleted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot share a deleted file"
        )
    
    token = generate_share_token()
    
    password_hash = None
    if share_data.password:
        password_hash = hash_password(share_data.password)
        
        share_link = ShareLink(
            token = token,
            file_id = file_id,
            owner_id = current_user.id,
            password_hash = password_hash,
            exipres_at = share_data.expires_at
        )
    
    db.add(share_link)
    db.flush()
    
    create_activity_log(
        db = db,
        current_user=current_user,
        action = "share",
        entity_type="file",
        entity_id=file_record.id,
        details=f"Created share link for file: {file_record.original_name}"
    )
    
    db.commit()
    db.refresh(share_link)
    
    return format_share_link_response(share_link)