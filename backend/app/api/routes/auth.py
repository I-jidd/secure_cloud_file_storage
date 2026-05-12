from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.user import UserCreate, UserResponse, UserLogin, Token
from app.services.auth_service import create_user, authenticate_user

router = APIRouter(prefix="/auth", tags=['Auth'])

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)

def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    return create_user(db=db, user_data=user_data)

@router.post("/login", response_model=Token)
def login_user(
    login_data: UserLogin,
    db: Session = Depends(get_db)
):
    return authenticate_user(
        db=db,
        email=login_data.email,
        password=login_data.password
    )