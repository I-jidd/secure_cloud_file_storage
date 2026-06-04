# Secure Cloud File Storage and Sharing Platform

A full-stack secure file storage and sharing platform built with **FastAPI**, **React**, **PostgreSQL**, **Tailwind CSS**, and **JWT authentication**.

This project is designed as a serious portfolio project that demonstrates backend API design, database modeling, authentication, secure file handling, activity logging, public share links, and frontend integration.

---

## Project Overview

The Secure Cloud File Storage and Sharing Platform is a mini Google Drive-style application where users can:

- Register and log in securely
- Upload files to local disk storage
- Store file metadata in PostgreSQL
- Create folders and nested folders
- Rename files and folders
- Soft-delete and restore files/folders
- View deleted items in Trash
- Download owned files securely through the backend
- Create public share links
- Add password protection to shared links
- Add expiration dates to shared links
- Disable shared links
- Access public shared files through token-based URLs
- View backend-recorded activity logs
- See dashboard summaries for storage, files, folders, and recent actions

The app uses **local disk storage first**, but the backend is designed so the storage layer can later be replaced with **S3** or **MinIO**.

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React icons

### Backend

- FastAPI
- SQLAlchemy
- Alembic
- Pydantic
- JWT authentication
- Passlib password hashing

### Database

- PostgreSQL

### Storage

- Local disk storage
- Designed for future S3/MinIO integration

### DevOps

- Docker
- Docker Compose
- Git/GitHub

---

## Core Features

### Authentication

- User registration
- User login
- JWT-based authentication
- Protected frontend routes
- Global authentication state using React Context
- Token storage in browser localStorage
- Automatic Authorization header attachment with Axios interceptors

### File Management

- Upload files
- Download files securely
- Rename files
- Soft-delete files
- Restore deleted files
- Store actual files on local disk
- Store file metadata in PostgreSQL
- Validate file type and file size
- Prevent direct access to storage paths

### Folder Management

- Create folders
- Rename folders
- Soft-delete folders
- Restore folders
- Nested folder support
- Basic folder navigation
- Parent-child folder relationships
- Recursive folder delete behavior

### Trash

- View deleted files
- View deleted folders
- Restore deleted files
- Restore deleted folders
- Preserve deleted items using `is_deleted` and `deleted_at`

### Activity Logs

- Backend automatically records user actions
- Activity logs are not created manually from the frontend
- Logs include actions such as:
  - upload
  - download
  - rename
  - delete
  - restore
  - share
  - disable share link

- Users can only view their own activity logs

### Share Links

- Create public share links for files
- Generate unique secure tokens
- Disable share links
- View all created share links
- Copy public share URLs
- Add optional password protection
- Add optional expiration date/time
- Public access through token-based URLs

### Public Shared Files

- Public share page using `/public/share/:token`
- Backend validates token
- Backend checks if link is active
- Backend checks if link is expired
- Backend checks if file still exists and is not deleted
- Supports public file download
- Supports password-protected public download

### Dashboard

- Shows storage usage
- Shows active files
- Shows deleted files
- Shows folder count
- Shows deleted folder count
- Shows recent uploads
- Shows recent activity
- Handles empty new-user accounts safely

---

## Project Structure

```txt
secure-cloud-storage/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py
│   │   │   └── routes/
│   │   │       ├── auth.py
│   │   │       ├── dashboard.py
│   │   │       ├── files.py
│   │   │       ├── folders.py
│   │   │       ├── activity_logs.py
│   │   │       ├── share_links.py
│   │   │       └── health.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── db/
│   │   │   └── database.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── folder.py
│   │   │   ├── file.py
│   │   │   ├── activity_log.py
│   │   │   └── share_link.py
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   ├── folder.py
│   │   │   ├── file.py
│   │   │   ├── activity_log.py
│   │   │   ├── share_link.py
│   │   │   └── dashboard.py
│   │   ├── services/
│   │   │   ├── folder_service.py
│   │   │   ├── file_service.py
│   │   │   ├── activity_log_service.py
│   │   │   ├── share_link_service.py
│   │   │   └── dashboard_service.py
│   │   ├── storage/
│   │   │   └── uploads/
│   │   └── main.py
│   ├── alembic/
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── apiClient.js
│   │   │   ├── authApi.js
│   │   │   ├── fileApi.js
│   │   │   ├── folderApi.js
│   │   │   ├── dashboardApi.js
│   │   │   ├── activityLogApi.js
│   │   │   └── shareLinkApi.js
│   │   ├── components/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── layouts/
│   │   │   └── AppLayout.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── MyFilesPage.jsx
│   │   │   ├── TrashPage.jsx
│   │   │   ├── ActivityLogsPage.jsx
│   │   │   ├── SharedLinksPage.jsx
│   │   │   └── PublicSharePage.jsx
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── utils/
│   │   │   ├── tokenStorage.js
│   │   │   └── formatBytes.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Database Models

### Users

Stores registered users and authentication-related data.

Important fields:

- `id`
- `email`
- `username`
- `hashed_password`
- `is_active`
- `is_deleted`
- `created_at`
- `updated_at`

### Folders

Stores folder metadata and hierarchy.

Important fields:

- `id`
- `name`
- `owner_id`
- `parent_folder_id`
- `is_deleted`
- `deleted_at`
- `created_at`
- `updated_at`

### Files

Stores file metadata. The actual file is stored on local disk.

Important fields:

- `id`
- `original_name`
- `stored_name`
- `storage_path`
- `mime_type`
- `size_bytes`
- `owner_id`
- `folder_id`
- `is_deleted`
- `deleted_at`
- `created_at`
- `updated_at`

### Activity Logs

Stores backend-recorded user actions.

Important fields:

- `id`
- `user_id`
- `action`
- `entity_type`
- `entity_id`
- `details`
- `created_at`

### Share Links

Stores token-based public file access.

Important fields:

- `id`
- `token`
- `file_id`
- `owner_id`
- `is_active`
- `password_hash`
- `expires_at`
- `created_at`
- `updated_at`

---

## Security Design

### File Storage Security

The app does not expose direct storage paths to users.

Instead of downloading files from:

```txt
storage/uploads/example.pdf
```

users download through protected backend endpoints:

```txt
GET /api/files/{file_id}/download
```

This allows the backend to check:

- Is the user authenticated?
- Does the file belong to the user?
- Is the file active?
- Does the physical file exist?

### Original Name vs Stored Name

The app separates user-facing names from backend storage names.

```txt
original_name = name shown to the user
stored_name   = safe unique filename on disk
storage_path  = internal path used by the backend
```

This avoids:

- path traversal attacks
- filename conflicts
- unsafe user-controlled file paths
- accidental physical file renaming issues

### Soft Delete

Files and folders are soft-deleted.

Instead of immediately removing records or files, the app sets:

```txt
is_deleted = true
deleted_at = timestamp
```

This allows users to restore deleted items from Trash.

### Share Link Security

Public share links use random secure tokens.

The public URL uses:

```txt
/public/share/{token}
```

not the storage path.

The backend validates:

- token exists
- share link is active
- share link is not expired
- file still exists
- file is not deleted
- password is correct when required

### Password-Protected Sharing

For password-protected share links:

- The frontend sends the plain password only during creation or verification.
- The backend stores only the password hash.
- The public download endpoint requires password verification.
- The backend enforces password protection, not only the frontend.

---

## Backend API Overview

### Auth

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Dashboard

```txt
GET /api/dashboard/summary
```

### Folders

```txt
GET    /api/folders
POST   /api/folders
GET    /api/folders/trash
GET    /api/folders/{folder_id}
PATCH  /api/folders/{folder_id}
DELETE /api/folders/{folder_id}
PATCH  /api/folders/{folder_id}/restore
```

### Files

```txt
GET    /api/files
POST   /api/files/upload
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

### Share Links

```txt
POST  /api/share-links/files/{file_id}
GET   /api/share-links
PATCH /api/share-links/{share_link_id}/disable
```

### Public Share Links

```txt
GET  /api/share-links/public/{token}
GET  /api/share-links/public/{token}/download
POST /api/share-links/public/{token}/verify-password
POST /api/share-links/public/{token}/download-with-password
```

---

## Frontend Pages

### Login Page

Route:

```txt
/login
```

Features:

- Email input
- Password input
- OAuth2 form login request
- JWT token storage
- Redirect to dashboard

### Register Page

Route:

```txt
/register
```

Features:

- Email input
- Username input
- Password confirmation
- JSON register request
- Redirect to login

### Dashboard Page

Route:

```txt
/dashboard
```

Features:

- Storage usage summary
- Active file count
- Deleted file count
- Folder count
- Recent uploads
- Recent activity

### My Files Page

Route:

```txt
/files
```

Features:

- View folders
- View files
- Create folders
- Rename folders
- Delete folders
- Navigate folders
- Upload files
- Rename files
- Download files
- Delete files
- Create share links
- Add password to share links
- Add expiration to share links

### Trash Page

Route:

```txt
/trash
```

Features:

- View deleted files
- View deleted folders
- Restore files
- Restore folders

### Activity Logs Page

Route:

```txt
/activity
```

Features:

- View backend-recorded logs
- See file/folder/share actions
- Shows only current user's logs

### Shared Links Page

Route:

```txt
/shared
```

Features:

- View created share links
- Copy public URLs
- See active/disabled state
- See password-protected state
- See expiration state
- Disable share links

### Public Share Page

Route:

```txt
/public/share/:token
```

Features:

- Public file metadata view
- Public download
- Disabled link handling
- Expired link handling
- Password verification
- Password-protected download

---

## Environment Variables

### Backend `.env`

Create:

```txt
backend/.env
```

Example:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/secure_cloud_storage

SECRET_KEY=change-this-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

LOCAL_STORAGE_PATH=storage/uploads
MAX_FILE_SIZE_MB=10
ALLOWED_FILE_TYPES=application/pdf,image/png,image/jpeg,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document
```

### Frontend `.env`

Create:

```txt
frontend/.env
```

Example:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

---

## How to Run the Project

### 1. Start PostgreSQL

From the project root:

```bash
docker compose up -d
```

### 2. Run Backend

```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

Backend runs at:

```txt
http://127.0.0.1:8000
```

Swagger docs:

```txt
http://127.0.0.1:8000/docs
```

### 3. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```txt
http://localhost:5173
```

---

## Alembic Migrations

Create a migration:

```bash
cd backend
alembic revision --autogenerate -m "migration message"
```

Apply migrations:

```bash
alembic upgrade head
```

---

## Git Ignore Notes

The project should not commit:

```txt
.env
backend/.env
frontend/.env
backend/app/storage/uploads/*
node_modules/
frontend/node_modules/
frontend/dist/
__pycache__/
```

Uploaded files should stay local and should not be tracked by Git.

---

## Testing Checklist

### Authentication

- Register a user
- Login successfully
- Invalid login shows error
- Protected pages redirect when logged out
- Token persists after refresh

### File Management

- Upload file
- Download file
- Rename file
- Delete file
- Restore file
- File metadata updates correctly
- Physical file remains safely stored

### Folder Management

- Create folder
- Rename folder
- Delete folder
- Restore folder
- Create subfolder
- Navigate into folder
- Upload file inside folder

### Trash

- Deleted files appear in Trash
- Deleted folders appear in Trash
- Restore works
- `deleted_at` becomes null after restore

### Activity Logs

- Upload creates log
- Download creates log
- Rename creates log
- Delete creates log
- Restore creates log
- Share creates log
- Disable share creates log

### Share Links

- Create normal share link
- Create password-protected share link
- Create expiring share link
- Copy share URL
- Disable share link
- Disabled link is blocked publicly
- Expired link is blocked publicly

### Public Sharing

- Public token page loads active link
- Public download works
- Password-protected link requires password
- Wrong password fails
- Correct password allows download

---

## Current Project Status

Completed:

```txt
Phase 1 — Project Foundation
Phase 2 — Database and Alembic
Phase 3 — Authentication and Users
Phase 4 — Folders
Phase 5 — Files
Phase 6 — Activity Logs
Phase 7 — Share Links
Phase 8 — Frontend Integration
```

Next planned phase:

```txt
Phase 9 — UI Polish, Modals, and Portfolio Cleanup
```

---

## Future Improvements

Planned improvements include:

- Replace `window.prompt()` and `window.confirm()` with custom modals
- Add upload progress bar
- Add drag-and-drop upload
- Add better breadcrumb navigation
- Add file preview
- Add search and filter from backend
- Add pagination
- Add permanent delete option
- Add user profile/settings page
- Add role-based access if needed
- Add S3 or MinIO storage adapter
- Add Dockerized frontend
- Add production deployment
- Add automated tests
- Add CI/CD pipeline

---

## Portfolio Value

This project demonstrates:

- Full-stack application development
- REST API design
- Authentication and authorization
- Secure file upload and download
- PostgreSQL relational modeling
- SQLAlchemy service-layer architecture
- Alembic migrations
- React frontend integration
- JWT-protected frontend routes
- Token-based public sharing
- Password-protected public access
- Soft-delete and restore workflows
- Activity logging and audit trails
- Clean project structure
- Portfolio-ready engineering practices
