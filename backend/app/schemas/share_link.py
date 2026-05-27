from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

class ShareLinkCreate(BaseModel):
    password: str | None = Field(default= None, min_length= 6, max_length=128)
    expires_at: datetime | None = None
    
class SharePasswordVerify(BaseModel):
    password: str = Field(min_length=1, max_length=128)
    
class ShareLinkResponse(BaseModel):
    id: UUID
    token: str
    file_id: UUID
    owner_id: UUID
    is_active: bool
    has_password: bool
    expires_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }
    
class PublicShareFileResponse(BaseModel):
    file_id: UUID
    original_name: str
    mime_type: str | None
    size_bytes: int
    requires_password: bool
    expires_at: datetime | None