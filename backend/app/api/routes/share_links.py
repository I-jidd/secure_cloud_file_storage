from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.deps import get_current_user
from app.schemas.share_link import ShareLinkResponse, ShareLinkCreate
from app.services.share_link_service import create_share_link
from app.models.user import User


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