# My Full‑Stack Demo

This is a simple demonstration of a full stack application DB, API and React Frontend.

# Features

- NestJS + Prisma backend with PostgreSQL  
- React + MUI + React Router frontend  
- Light/dark theme switch based on OS preference  
- CRUD on Accounts & Payments  
- “One‑command” launch via Docker Compose  

# Prerequisites

- Docker & Docker Compose  (or Node 22+ & PostgreSQL locally)  
- (Optional) Git for cloning  

# Quickstart

```bash
git clone https://github.com/your‑username/your‑repo-name.git
cd your‑repo-name

# Copy env examples
cp backend/.env.example backend/.env

# Launch everything
docker-compose up --build

You'll then be listening on 
Frontend http://localhost:5173
API http://localhost:3000


# Without Docker

1. Install Node.js v22+ and PostreSQL on your machine
2. in backend/ adjust .env to match your own db password
3. Run migrations & start backend
    cd backend
    npm install
    npx prisma migrate dev
    npm run start:dev
4. Open another shell and start the frontend
    cd frontend
    npm install
    npm run dev

# Project Structure
├── backend/           # NestJS + Prisma source
├── frontend/          # Vite + React + MUI source
├── docker-compose.yml # Services for db, api, and ui
└── README.md          # <-- you are here

# Usage
 - Navigate to Accounts in the sidebar
 - Add, edit or delete accounts using the built-in forms

Contributing
As a demo project it naturally has to be all my own work but any insights or issues please do reach out!