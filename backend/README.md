# Backend - Shift Board

## Setup
1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies:
   ```
   cd backend
   npm install
   ```
3. Seed users and employees:
   ```
   npm run seed
   ```
4. Start:
   ```
   npm run dev
   ```

## API (prefix: /api)
- POST /auth/login  { email, password } -> { token }
- GET /employees  (auth required)
- POST /shifts  (admin only) { employeeCode, date(YYYY-MM-DD), startTime(HH:MM), endTime(HH:MM) }
- GET /shifts?employee=CODE&date=YYYY-MM-DD  (auth required)
- DELETE /shifts/:id  (admin only)

Business rules implemented:
- No overlapping shifts for same employee on same date
- Shift minimum 4 hours
- Normal users can only view their shifts


Docker:
- Build backend image: `docker build -t shift-backend .` inside backend/
