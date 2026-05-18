from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class FileUpdate(BaseModel):
    original_name: str = Field(min_length=1, max_length=255)


class FileResponse(BaseModel):
    id: UUID
    original_name: str
    stored_name: str
    storage_path: str
    mime_type: str | None
    size_bytes: int
    owner_id: UUID
    folder_id: UUID | None
    is_deleted: bool
    deleted_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }