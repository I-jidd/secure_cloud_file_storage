from uuid import UUID

from fastapi import APIRouter, Depends, status
from fastapi.responses import FileResponse as FastAPIFileResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.deps import get_current_user
from app.schemas.share_link import ShareLinkResponse, ShareLinkCreate, PublicShareFileResponse, SharePasswordVerify
from app.models.user import User
from app.services.share_link_service import (
    create_share_link,
    disable_share_link,
    get_public_shared_file_for_download_with_password,
    get_public_shared_file_metadata,
    get_public_shared_file_for_download,
    verify_public_share_password,
    )

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

@router.get("/share/{token}", response_model=PublicShareFileResponse)
def get_public_shared_file(
    token: str,
    db:Session = Depends(get_db)
):
    return get_public_shared_file_metadata(
        db = db,
        token=token
    )

@router.get("/public/{token}/download")
def download_public_shared_file(
    token: str,
    db: Session = Depends(get_db)
):
    file_record = get_public_shared_file_for_download(
        db = db,
        token=token
    )
    
    return FastAPIFileResponse(
        path=file_record.storage_path,
        filename= file_record.original_name,
        media_type= file_record.mime_type or "application/octet-stream"
    )

@router.post(
    "/public/{token}/verify-password",
    response_model=PublicShareFileResponse
)

def verify_shared_file_password(
    token: str,
    password_data: SharePasswordVerify,
    db: Session = Depends(get_db)
):
    return verify_public_share_password(
        db=db,
        token=token,
        password=password_data.password
    )

@router.post("/public/{token}/download-with-password")
def download_public_shared_file_with_password(
    token: str,
    password_data: SharePasswordVerify,
    db: Session = Depends(get_db)
):
    file_record =  get_public_shared_file_for_download_with_password(
        db=db,
        token=token,
        password=password_data.password
    )
    
    return FastAPIFileResponse(
        path=file_record.storage_path,
        filename=file_record.original_name,
        media_type=file_record.mime_type or "application/octet-stream"
    )