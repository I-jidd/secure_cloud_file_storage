from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str
    APP_ENV: str
    
    DATABASE_URL: str
    
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    
    STORAGE_BACKEND: str = "local"
    LOCAL_STORAGE_PATH: str = "app/storage/uploads"
    MAX_FILE_SIZE_MB: int = 10
    ALLOWED_FILE_TYPES: str = (
        "application/pdf,image/png,image/jpeg,text/plain,"
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
    class Config:
        env_file = ".env"
        
    @property
    def max_file_size_bytes(self) -> int:
        return self.MAX_FILE_SIZE_MB * 1024 * 1024
    
    @property
    def allowed_file_types_list(self) -> list[str]:
        return[
            file_type.strip()
            for file_type in self.ALLOWED_FILE_TYPES.split(",")
            if file_type.strip()
        ]

settings = Settings()