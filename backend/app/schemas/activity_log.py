from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

class ActivityLogsResponse(BaseModel):
    id: UUID
    owner_id: UUID
    action: str
    entity_type: str
    entity_id: UUID | None
    details: str | None
    created_at: datetime
    
    model_config = {
        "from_attributes": True
    }