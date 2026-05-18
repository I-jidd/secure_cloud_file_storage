from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, UploadFile, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.file import FileResponse
from app.services.file_service import create_file_metadata


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