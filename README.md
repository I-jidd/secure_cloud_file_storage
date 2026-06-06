# SecureCloud — Secure Cloud File Storage and Sharing Platform

SecureCloud is a full-stack file storage and sharing platform built to demonstrate secure backend engineering, clean frontend integration, and practical cloud-storage workflows.

The project is designed as a simplified Google Drive-style application where users can upload, organize, recover, and share files through a secure web interface.

---

## Overview

SecureCloud provides a private file management system with authenticated access, folder organization, soft deletion, activity tracking, and controlled public sharing.

The application focuses on real-world engineering concerns such as authentication, ownership-based authorization, file upload safety, database-backed metadata, local storage abstraction, and containerized deployment.

---

## Key Features

### User Authentication

- User registration and login
- JWT-based authentication
- Protected application routes
- Secure password hashing
- Session persistence through browser storage

### File Management

- Upload files
- Download files through protected backend routes
- Open supported files in the browser
- Rename files
- Move files to Trash
- Restore deleted files
- Store file metadata separately from file objects

### Folder Management

- Create folders
- Create nested folder structures
- Rename folders
- Move folders to Trash
- Restore deleted folders
- Breadcrumb-based folder navigation

### Trash and Recovery

- Soft-delete support for files and folders
- Trash page for deleted items
- Restore workflow for recoverable data

### Secure Sharing

- Generate public share links
- Disable shared links
- Optional password protection
- Optional expiration date
- Public share page for external access
- Secure download flow for shared files

### Activity Logs

- Backend-recorded user actions
- Recent activity shown in the dashboard
- Dedicated activity log page

### Dashboard

- Storage summary
- File and folder counts
- Recent uploads
- Recent actions
- User-specific overview

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React

### Backend

- FastAPI
- SQLAlchemy
- Pydantic
- Alembic
- JWT authentication
- Passlib password hashing

### Database

- PostgreSQL

### Storage

- Local disk storage
- Designed so the storage layer can later be replaced with S3, MinIO, or another object storage service

### DevOps

- Docker
- Docker Compose
- Nginx for serving the production frontend

---

## Architecture

SecureCloud follows a layered architecture.

```txt
React Frontend
    |
    | HTTP requests
    v
FastAPI Backend
    |
    | business logic and authorization
    v
PostgreSQL Database
    |
    | metadata
    v
Local File Storage
```

The system separates file metadata from file content.

- PostgreSQL stores user, folder, file, sharing, and activity metadata.
- Local storage stores the actual uploaded file objects.
- The backend controls all access to private and public files.
- The frontend never accesses raw storage paths directly.

---

## Project Structure

```txt
secure-cloud-storage/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── storage/
│   │   └── main.py
│   ├── alembic/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .dockerignore
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── utils/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── .dockerignore
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## Running the Project with Docker

The recommended way to run the full application is with Docker Compose.

### 1. Build and start the services

From the project root:

```bash
docker compose up --build
```

This starts:

- PostgreSQL database
- FastAPI backend
- React frontend served through Nginx

### 2. Apply database migrations

In a second terminal:

```bash
docker compose exec backend alembic upgrade head
```

This prepares the database schema for the application.

### 3. Open the application

Frontend:

```txt
http://localhost:5173
```

Backend API documentation:

```txt
http://localhost:8000/docs
```

### 4. Stop the application

```bash
docker compose down
```

---

## Running the Project Locally

Docker is recommended, but the application can also be run manually during development.

### Start PostgreSQL

```bash
docker compose up -d postgres
```

### Start Backend

```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

Backend runs at:

```txt
http://localhost:8000
```

### Start Frontend

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

## Environment Configuration

The project uses environment variables for configuration.

Backend configuration includes:

```txt
DATABASE_URL
JWT_SECRET_KEY
JWT_ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES
LOCAL_STORAGE_PATH
MAX_FILE_SIZE_MB
ALLOWED_FILE_TYPES
```

Frontend configuration includes:

```txt
VITE_API_BASE_URL
```

For Docker-based local development, the frontend is built using:

```txt
http://localhost:8000/api
```

as the backend API base URL.

---

## Security Considerations

SecureCloud was built with several security principles in mind:

- Passwords are hashed before storage.
- Private routes require authenticated access.
- Users can only access files and folders they own.
- Public links use generated tokens instead of direct file paths.
- Password-protected share links store only password hashes.
- Expired and disabled links are blocked by the backend.
- File downloads go through backend validation.
- Uploaded file paths are not exposed to users.
- File uploads are validated by size and type.
- Deleted files and folders are soft-deleted for recovery.

---

## Docker Notes

The backend connects to PostgreSQL through the Docker Compose service name:

```txt
postgres
```

The browser-based frontend calls the backend through:

```txt
http://localhost:8000/api
```

Uploaded files are stored in a Docker volume so they can persist across container rebuilds.

PostgreSQL data is also stored in a Docker volume.

---

## Troubleshooting

### React routes return Nginx 404 on refresh

The frontend uses React Router, so Nginx must fall back to `index.html`.

The project includes a custom Nginx configuration to support browser refreshes on frontend routes.

### Upload returns 422 Unprocessable Entity

Check that uploads are sent as `FormData` and that the request uses the field name expected by the backend.

Also avoid setting a global JSON `Content-Type` header for all Axios requests, because file uploads require multipart form data.

### Database tables do not exist

If the backend is running but database tables are missing, run:

```bash
docker compose exec backend alembic upgrade head
```

### Frontend calls the wrong API URL

If frontend requests go to the frontend server instead of the backend server, rebuild the frontend image with the correct Vite API base URL.

```bash
docker compose down
docker compose up --build
```

---

## Current Status

Completed:

- Backend foundation
- Database setup and migrations
- Authentication system
- Folder management
- File management
- Activity logging
- Share links
- Public sharing
- Frontend integration
- UI polish
- Landing page
- Dockerized backend
- Dockerized frontend
- Docker Compose setup

---

## Roadmap

Planned improvements:

- Search, sorting, and filtering improvements
- Better upload progress feedback
- Drag-and-drop upload
- File preview improvements
- Pagination for large file lists
- Permanent delete option
- User profile and account settings
- Storage adapter for S3 or MinIO
- Automated backend tests
- Frontend testing
- CI/CD pipeline
- Production deployment

---

## Portfolio Highlights

This project demonstrates:

- Full-stack application development
- REST API design
- Authentication and authorization
- Secure file upload and download workflows
- PostgreSQL relational modeling
- Service-layer backend architecture
- Database migrations
- React frontend architecture
- Protected frontend routing
- Public token-based sharing
- Docker-based development workflow
- Real-world debugging and deployment preparation

---

## License

This project is intended for portfolio and educational use.
