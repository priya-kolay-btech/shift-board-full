# Employee Shift Board - Full Project (Backend + Frontend)

This repository contains a minimal full-stack app that satisfies the assignment:
- JWT authentication (seeded admin + normal user)
- Employee list
- Shift creation (admin) with business rules:
  - No overlapping shifts for same employee/date
  - Minimum 4 hours per shift
  - Normal users see only their shifts

Folders:
- backend/  -> Node/Express + Mongoose
- frontend/ -> React app (Create React App style)

Demo credentials (seeded by backend/seed.js):
- Admin: hire-me@anshumat.org / HireMe@2025!
- User: user@company.com / User@2025!

Follow backend/README.md and frontend/README.md to run locally.


## Docker / docker-compose

Quick start using Docker Compose (will run MongoDB, backend, and frontend):

1. Build and start:
   ```
   docker compose up --build
   ```
2. Backend: http://localhost:5000
3. Frontend: http://localhost:3000 (served by nginx)

Notes:
- The backend uses the env file at backend/.env.example; docker-compose overrides MONGO_URI to point to the mongo service.
- Use seeded admin credentials to login and create shifts.
