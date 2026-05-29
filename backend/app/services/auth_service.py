from fastapi import HTTPException,status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User
from app.schemas.user import UserCreate, Token

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
                detail="Email is already registered"
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

def authenticate_user(db:Session, email:str, password:str) -> Token:
    user = get_user_by_email(db=db, email=email)

    if not user:
        raise HTTPException(
            status_code= status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled"
        )
    
    access_token = create_access_token(subject=str(user.id))
    
    return{
        "access_token": access_token,
        "token_type": "bearer"
    }