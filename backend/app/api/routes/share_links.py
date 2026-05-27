from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.deps import get_current_user
from app.schemas.share_link import ShareLinkResponse, ShareLinkCreate, PublicShareFileResponse
from app.models.user import User
from app.services.share_link_service import create_share_link, disable_share_link, get_public_shared_file_metadata


router = APIRouter(prefix="/share-links", tags=["Share Links"])

@router.post("/files/{file_id}", 
             response_model=ShareLinkResponse,
             status_code=status.HTTP_201_CREATED)
def generate_share_link(
    file_id: UUID,
    share_data: ShareLinkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
): 
    return create_share_link(
        db=db,
        file_id=file_id,
        share_data=share_data,
        current_user=current_user
    )
    
@router.patch("/{share_link_id}/disable", response_model=ShareLinkResponse)
def disable_existing_share_link(
    share_link_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return disable_share_link(
        share_link_id=share_link_id,
        db=db,
        current_user=current_user
    )

@router.get("share/{token}", response_model=PublicShareFileResponse)
def get_public_shared_file(
    token: str,
    db:Session = Depends(get_db)
):
    return get_public_shared_file_metadata(
        db = db,
        token=token
    )