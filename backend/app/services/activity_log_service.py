from uuid import UUID

from sqlalchemy.orm import Session

from app.models.activity_log import ActivityLog
from app.models.user import User

def create_activity_log(
    db:Session,
    current_user: User,
    action: str,
    entity_type: str,
    entity_id: UUID | None = None,
    details: str| None = None
) -> ActivityLog:
    activity_log = ActivityLog(
        owner_id = current_user.id,
        action= action,
        entity_type = entity_type,
        entity_id = entity_id,
        details =details
    )
    
    db.add(activity_log)
    
    return activity_log

def list_activity_logs(
    db: Session,
    current_user: User,
    limit: int = 50
) -> list[ActivityLog]:
    return(
        db.query(ActivityLog)
        .filter(ActivityLog.owner_id == current_user.id)
        .order_by(ActivityLog.created_at.desc())
        .limit(limit)
        .all()
    )