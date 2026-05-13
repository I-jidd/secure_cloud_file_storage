from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

class FolderCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    parent_folder_id: UUID | None = None
    
class FolderUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    
class FolderResponse(BaseModel):
    id: UUID
    name: str
    owner_id: UUID
    parent_folder_id: UUID | None
    is_deleted: bool
    deleted_at: datetime | None
    created_at: datetime
    updated_at: datetime
    
    model_config ={
        "from_attributes": True
    }