from fastapi import HTTPException,status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user import User
from app.schemas.user import UserCreate

def get_user_by_email(db:Session, email:str) -> User | None:
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db:Session, username:str) -> User | None:
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user_data: UserCreate) -> User:
    existing_user = (
        db.query(User)
        .filter(
            or_(
                User.email == user_data.email,
                User.username == user_data.username
            )
        )
        .first()
    )
    
    if existing_user:
        if existing_user.email == user_data.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registerd"
            )
        raise HTTPException(
            status_code= status.HTTP_400_BAD_REQUEST,
            detail="Username is already taken"
        )
        
    new_user = User(
        email = user_data.email,
        username = user_data.username,
        hashed_password = hash_password(user_data.password)
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user