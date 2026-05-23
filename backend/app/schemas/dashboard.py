from pydantic import BaseModel

from app.schemas.activity_log import ActivityLogsResponse
from app.schemas.file import FileResponse

class DashboardSummaryResponse(BaseModel):
    storage_used_bytes: int
    total_files: int
    active_files: int
    deleted_files: int
    total_folders: int
    deleted_folders: int
    recent_uploads: list[FileResponse]
    recent_activity: list[ActivityLogsResponse]