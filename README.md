# Secure Cloud File Storage and Sharing Platform

A full-stack portfolio project inspired by a mini Google Drive. The goal is to build a secure file storage system where users can upload, organize, share, download, search, and manage files while practicing real backend engineering, clean architecture, authentication, file handling, PostgreSQL, Docker, and production-style development.

---

## Project Status

Current backend progress:

- Phase 1: Project foundation
- Phase 2: Database foundation
- Phase 3: Authentication foundation
- Phase 4: Folder management
- Phase 5: File management
- Phase 6: Search, sorting, filtering, activity logs, and dashboard summary
- Phase 7: File sharing, currently in progress

Latest completed feature:

- Generate public share link endpoint

---

## Tech Stack

### Frontend

- React
- Tailwind CSS

### Backend

- FastAPI
- SQLAlchemy
- Pydantic
- Alembic
- JWT authentication

### Database

- PostgreSQL
- Docker Compose for local database setup

### File Storage

- Local storage first
- Designed to support external drive, NAS, MinIO, or S3 later

### Deployment Target

- Docker
- Docker Compose

---

## Core Features

### Authentication

- User registration
- User login
- Password hashing with bcrypt
- JWT access token
- Protected routes
- Current user dependency

### Folder Management

- Create folders
- Create nested folders
- List folders
- Get folder by ID
- Rename folders
- Soft delete folders
- Restore folders from Trash
- List deleted folders
- Recursive folder delete and restore behavior
- Ownership protection

### File Management

- Upload files
- Store actual files on disk
- Store file metadata in PostgreSQL
- List files
- Download files securely through the backend
- Rename file display name
- Soft delete files
- Restore files from Trash
- List deleted files
- Validate file size
- Validate file type
- Prevent path traversal by generating safe stored filenames

### Search, Sorting, and Filtering

- Search files by name
- Filter files by MIME type
- Sort files by newest, oldest, name, and size
- Search folders by name
- Sort folders by newest, oldest, and name

### Activity Logs

The backend automatically logs actions such as:

- File upload
- File download
- File rename
- File delete
- File restore
- Folder create
- Folder rename
- Folder delete
- Folder restore
- File sharing

### Dashboard Summary

The dashboard summary endpoint returns:

- Storage used
- Total files
- Active files
- Deleted files
- Total folders
- Deleted folders
- Recent uploads
- Recent activity

### File Sharing

Currently implemented:

- Share link database model
- Share link migration
- Share link schemas
- Share link service
- Share link router
- Generate public share link endpoint
- Optional password field support in schema and service
- Optional expiration date support in schema and service
- Share activity logging

Planned next:

- Disable share link endpoint
- Public shared file metadata endpoint
- Public shared file download endpoint
- Expiration validation
- Password-protected public access flow

---

## Backend Folder Structure

```txt
secure-cloud-storage/
├── backend/
│   ├── alembic/
│   │   ├── versions/
│   │   └── env.py
│   │
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py
│   │   │   └── routes/
│   │   │       ├── activity_logs.py
│   │   │       ├── auth.py
│   │   │       ├── dashboard.py
│   │   │       ├── files.py
│   │   │       ├── folders.py
│   │   │       ├── health.py
│   │   │       └── share_links.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   │
│   │   ├── db/
│   │   │   └── database.py
│   │   │
│   │   ├── models/
│   │   │   ├── activity_log.py
│   │   │   ├── file.py
│   │   │   ├── folder.py
│   │   │   ├── share_link.py
│   │   │   └── user.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── activity_log.py
│   │   │   ├── dashboard.py
│   │   │   ├── file.py
│   │   │   ├── folder.py
│   │   │   ├── share_link.py
│   │   │   └── user.py
│   │   │
│   │   ├── services/
│   │   │   ├── activity_log_service.py
│   │   │   ├── auth_service.py
│   │   │   ├── dashboard_service.py
│   │   │   ├── file_service.py
│   │   │   ├── folder_service.py
│   │   │   └── share_link_service.py
│   │   │
│   │   ├── storage/
│   │   │   └── local_storage.py
│   │   │
│   │   └── main.py
│   │
│   ├── storage/
│   │   └── uploads/
│   │       └── .gitkeep
│   │
│   ├── .env
│   ├── .env.example
│   ├── alembic.ini
│   └── requirements.txt
│
├── frontend/
├── docker-compose.yml
└── .gitignore
```

---

## Important Architecture Rule

PostgreSQL stores metadata.

```txt
users
folders
files
share_links
activity_logs
```

The storage folder stores actual uploaded files.

```txt
backend/storage/uploads/
```

This separation makes the system easier to migrate later to:

- External hard drive
- NAS
- MinIO
- Amazon S3

---

## Database Tables

### users

Stores user accounts and authentication-related information.

Important fields:

- id
- email
- username
- hashed_password
- is_active
- created_at
- updated_at

### folders

Stores folder metadata and nested folder structure.

Important fields:

- id
- name
- owner_id
- parent_folder_id
- is_deleted
- deleted_at
- created_at
- updated_at

### files

Stores file metadata only. Actual files are stored on disk.

Important fields:

- id
- original_name
- stored_name
- storage_path
- mime_type
- size_bytes
- owner_id
- folder_id
- is_deleted
- deleted_at
- created_at
- updated_at

### activity_logs

Stores user actions for dashboard and audit history.

Important fields:

- id
- owner_id
- action
- entity_type
- entity_id
- details
- created_at

### share_links

Stores public sharing information for files.

Important fields:

- id
- token
- file_id
- owner_id
- is_active
- password_hash
- expires_at
- created_at
- updated_at

---

## Current API Endpoints

### Health

```txt
GET /api/health/
GET /api/health/db
```

### Auth

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Folders

```txt
POST   /api/folders
GET    /api/folders
GET    /api/folders/trash
GET    /api/folders/{folder_id}
PATCH  /api/folders/{folder_id}
DELETE /api/folders/{folder_id}
PATCH  /api/folders/{folder_id}/restore
```

### Files

```txt
POST   /api/files/upload
GET    /api/files
GET    /api/files/trash
GET    /api/files/{file_id}/download
PATCH  /api/files/{file_id}
DELETE /api/files/{file_id}
PATCH  /api/files/{file_id}/restore
```

### Activity Logs

```txt
GET /api/activity-logs
```

### Dashboard

```txt
GET /api/dashboard/summary
```

### Share Links

```txt
POST /api/share-links/files/{file_id}
```

Planned:

```txt
PATCH /api/share-links/{share_link_id}/disable
GET   /api/public/share/{token}
GET   /api/public/share/{token}/download
```

---

## Security Rules

- Never store plain passwords.
- Never return password hashes in API responses.
- Never trust owner_id from the frontend.
- Use current_user.id from JWT for ownership.
- Every private file and folder query must check ownership.
- Public share links should use random secure tokens, not file IDs.
- Uploaded files should not be publicly served directly from the storage folder.
- Downloads must go through backend endpoints to enforce permissions.
- Use backend-generated stored filenames to prevent naming conflicts and path traversal attacks.
- Store actual uploaded files outside source code folders.
- Ignore uploaded files in Git.

---

## Environment Variables

Example `.env.example`:

```env
APP_NAME=Secure Cloud Storage API
APP_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/secure_cloud_storage
JWT_SECRET_KEY=change-this-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

STORAGE_BACKEND=local
LOCAL_STORAGE_PATH=storage/uploads
MAX_FILE_SIZE_MB=10
ALLOWED_FILE_TYPES=application/pdf,image/png,image/jpeg,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document
```

Do not commit the real `.env` file.

---

## Local Development Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd secure-cloud-storage
```

### 2. Start PostgreSQL

```bash
docker compose up -d postgres
```

### 3. Create and activate virtual environment

```bash
cd backend
python -m venv venv
source venv/Scripts/activate
```

For PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Create `.env`

Copy the example file:

```bash
cp .env.example .env
```

Then update values if needed.

### 6. Apply database migrations

```bash
alembic upgrade head
```

### 7. Run the backend server

```bash
uvicorn app.main:app --reload
```

Open:

```txt
http://127.0.0.1:8000/docs
```

---

## Common Commands

### Check Git status

```bash
git status
```

### Create a migration

```bash
alembic revision --autogenerate -m "message"
```

### Apply migrations

```bash
alembic upgrade head
```

### Open PostgreSQL shell

```bash
docker exec -it secure_cloud_postgres psql -U postgres
```

Inside PostgreSQL:

```sql
\c secure_cloud_storage
\dt
\q
```

### Run backend

```bash
uvicorn app.main:app --reload
```

---

## Git Commit Convention Used

Examples:

```bash
git commit -m "feat: add File database model"
git commit -m "chore: import ShareLink model into Alembic"
git commit -m "fix: correct folder restore behavior"
git commit -m "docs: add phase study guide"
```

Suggested prefixes:

- `feat:` for new features
- `fix:` for bug fixes
- `chore:` for setup or maintenance
- `docs:` for documentation
- `refactor:` for internal code cleanup

---

## Learning Goals

This project is designed to teach:

- FastAPI backend development
- Clean architecture
- JWT authentication
- Password hashing
- PostgreSQL database design
- SQLAlchemy ORM
- Alembic migrations
- Secure file uploads
- File metadata vs object storage separation
- Folder nesting
- Soft delete and restore
- Activity logs
- Dashboard aggregation
- Public share links
- Docker-based development
- Production-style project organization

---

## Current Next Step

Continue with:

```txt
Phase 7 — Step 8: Disable Share Link Endpoint
```

This will allow users to turn off an existing public share link without deleting the row from the database.
