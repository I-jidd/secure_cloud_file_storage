from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.activity_log import ActivityLogsResponse
from app.services.activity_log_service import list_activity_logs

router = APIRouter(prefix="/activity-logs", tags=["Activity Logs"])

@router.get("",response_model=list[ActivityLogsResponse])
def get_activity_logs(
    limit: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return list_activity_logs(
        db=db,
        current_user=current_user,
        limit=limit
    )