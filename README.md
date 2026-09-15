# Task-engagement-management# Task & Engagement Management Tool

A full-stack task and engagement management application
for professional services teams.

## Tech Stack

### Frontend
- React
- Vite
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT

## Roles

### Admin
- Manage users
- Manage clients
- Manage service types
- Manage task templates
- View all work

### Manager
- Create engagements
- Assign/reassign tasks
- Manage deadlines
- Review submitted work

### Team Member
- View assigned tasks
- Update task status
- Wait for client information
- Submit work for review

## Installation

### Backend

cd backend
npm install

Create `.env`:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task_engagement
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173

Run:

npm run dev

### Frontend

cd frontend
npm install
npm run dev

## Seed Data

cd backend

npm run seed

## Tests

npm test

## Demo Credentials

Admin:
admin@example.com
Password@123

Manager:
manager1@example.com
Password@123

Team Member:
member1@example.com
Password@123

## Task Workflow

NOT_STARTED
→ IN_PROGRESS
→ READY_FOR_REVIEW
→ COMPLETED

IN_PROGRESS
→ WAITING_FOR_CLIENT
→ IN_PROGRESS

READY_FOR_REVIEW
→ CHANGES_REQUESTED
→ IN_PROGRESS

Workflow transitions are enforced server-side.

## Duplicate Prevention

Recurring engagements use:

client + service + period

as a unique database constraint.

## Architecture

React
↓
REST API
↓
Express Controllers
↓
Services
↓
Mongoose
↓
MongoDB
