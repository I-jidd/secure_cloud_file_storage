import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    
    id:Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )
    
    owner_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    action: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True
    )
    
    entity_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index = True
    )
    
    entity_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        nullable=True,
        index = True
    )
    
    details: Mapped [str | None] = mapped_column(
        Text,
        nullable=True
    )
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
        index=True
    )
    
    owner = relationship(
        "User",
        backref="activity_logs"
    )