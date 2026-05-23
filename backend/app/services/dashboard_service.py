from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.activity_log import ActivityLog
from app.models.file import File
from app.models.folder import Folder
from app.models.user import User

def get_dashboard_summary(
    db: Session,
    current_user: User
)-> dict:
    storage_used_bytes = (
        db.query(func.coalesce(func.sum(File.size_bytes)), 0)
        .filter(
            File.owner_id == current_user.id,
            File.is_deleted == False
        )
        .scalar()
    )
    
    total_files = (
        db.query(File)
        .filter(File.owner_id == current_user.id)
        .count()
    )
    
    active_files = (
        db.query(File)
        .filter(
            File.owner_id == current_user.id,
            File.is_deleted == False
        )
        .count()
    )
    
    deleted_files = (
        db.query(File)
        .filter(
            File.owner_id == current_user.id,
            File.is_deleted == True
        )
        .count()
    )
    
    total_folders = (
        db.query(Folder)
        .filter(Folder.owner_id == current_user.id)
        .count()
    )
    
    deleted_folders = (
        db.query(Folder)
        .filter(
            Folder.owner_id == current_user.id,
            Folder.is_deleted == True
        )
        .count()
    )
    
    recent_uploads = (
        db.query(File)
        .filter(
            File.owner_id == current_user.id,
            File.is_deleted == False
        )
        .order_by(File.created_at.desc())
        .limit(5)
        .all()
    )
    
    recent_activity = (
        db.query(ActivityLog)
        .filter(ActivityLog.owner_id == current_user.id)
        .order_by(ActivityLog.created_at.desc())
        .limit(10)
        .all()
    )
    
    return {
        "storage_used_bytes": storage_used_bytes,
        "total_files": total_files,
        "active_files": active_files,
        "deleted_files": deleted_files,
        "total_folders": total_folders,
        "deleted_folders": deleted_folders,
        "recent_uploads": recent_uploads,
        "recent_activity": recent_activity
    }