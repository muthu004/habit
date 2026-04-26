# Daily Mood Tracker

A full-stack web application for logging your daily mood, adding optional notes, and viewing mood insights over time.

---

## Features

- Log a mood entry (happy, sad, angry, neutral, or excited) for any given day
- Attach an optional note to each entry
- One entry per day — logging a mood for the same date replaces the previous entry
- View all past mood entries sorted by date
- View mood statistics: most frequent mood and per-mood counts
- Delete individual mood entries

---

## Tech Stack

| Layer     | Technology                         |
|-----------|------------------------------------|
| Frontend  | React 18, Vite                     |
| Backend   | Node.js, Express                   |
| Database  | MySQL                              |
| Other     | mysql2, dotenv, cors, concurrently |

---

## Project Structure

```
habit/
├── backend/
│   ├── routes/
│   │   └── moods.js       # Mood API routes
│   ├── db.js              # MySQL connection pool
│   ├── schema.sql         # Database schema
│   ├── server.js          # Express app entry point
│   └── .env.example       # Backend environment variable template
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── styles/        # CSS styles
│   │   ├── App.jsx        # Root component
│   │   └── main.jsx       # Application entry point
│   └── .env.example       # Frontend environment variable template
└── package.json           # Root workspace config
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A running MySQL instance

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/muthu004/habit.git
cd habit
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

Connect to your MySQL instance and run the schema:

```bash
mysql -u root -p < backend/schema.sql
```

### 4. Configure environment variables

**Backend** — copy `backend/.env.example` to `backend/.env` and fill in your values:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mood_tracker
PORT=5000
```

**Frontend** — copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 5. Start the development servers

```bash
npm run dev
```

This starts both the backend (default: `http://localhost:5000`) and the frontend (default: `http://localhost:5173`) concurrently.

---

## API Reference

All endpoints are prefixed with `/moods`.

| Method | Endpoint       | Description                                      |
|--------|----------------|--------------------------------------------------|
| GET    | `/moods`       | Retrieve all mood entries (newest first)         |
| POST   | `/moods`       | Create or replace a mood entry for a given date  |
| GET    | `/moods/stats` | Get most frequent mood and per-mood counts       |
| DELETE | `/moods/:id`   | Delete a mood entry by ID                        |

### POST `/moods` — Request body

```json
{
  "mood": "happy",
  "note": "Had a great day!",
  "created_at": "2026-04-26"
}
```

`mood` must be one of: `happy`, `sad`, `angry`, `neutral`, `excited`. `created_at` must be a valid date string (`YYYY-MM-DD`). Both fields are required; `note` is optional.

---

## Database Schema

```sql
CREATE TABLE moods (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    mood       ENUM('happy', 'sad', 'angry', 'neutral', 'excited') NOT NULL,
    note       TEXT,
    created_at DATE NOT NULL
);
```

---

## Available Scripts

| Command            | Description                                  |
|--------------------|----------------------------------------------|
| `npm run dev`      | Start backend and frontend in parallel       |
| `npm run install:all` | Install dependencies for all workspaces   |
