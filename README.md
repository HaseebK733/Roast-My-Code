[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://roast-my-code-taupe.vercel.app/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://roast-my-code-python-server.onrender.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)

# Roast-My-Code
Upload your trash, get the truth. A full-stack AI platform that critiques code quality with a savage personality.

## 🚀 Features
- **AI Code Critique:** Real-time roasts powered by Openai API v1 (via Groq).
- **Side-by-Side Comparison:** View your "trash" vs. the "fix" with syntax highlighting.
- **Hall of Shame:** A persistent leaderboard of the worst code submissions.
- **Interactive UI:** Custom toast notifications, collapsible evidence blocks, and responsive grid layouts.

## 💻 Tech Stack
- **Frontend:** React, Vite, Lucide Icons, React Syntax Highlighter
- **Backend:** FastAPI, Python, SQLModel
- **AI:** Groq API (LLM-driven JSON responses)
- **Deployment:** Vercel (Frontend), Render (Backend)

## 🔧 Installation
1. Clone the repo.
2. Install frontend deps: `cd frontend && npm install`.
3. Install backend deps: `cd backend && pip install -r requirements.txt`.
4. Create a `.env` with your `GROQ_API_KEY`.

## 🛠️ Technical Challenges & Solutions

### 1. The "UI Cooking" Problem (Assembly Code Stress Test)
**Challenge:** Pasting 1000+ lines of low-level Assembly code caused the UI to overflow, breaking the grid layout and making the "Roast" button inaccessible.
**Solution:** Implemented **Scroll Containment** using CSS `max-height` and `overflow-y: auto` combined with `min-width: 0` on grid children to force internal scrolling without breaking the page wrapper.

### 2. Client-Side Routing 404s
**Challenge:** Refreshing the browser while on the `/leaderboard` route caused a Vercel 404 error because the server looked for a physical file that didn't exist.
**Solution:** Configured a `vercel.json` with a **Global Rewrite** rule to redirect all server requests back to `index.html`, allowing `react-router-dom` to handle navigation internally.

### 3. Database Schema Evolution
**Challenge:** Adding new features like "View Evidence" required adding a `code_snippet` column to an existing SQLite database, which caused crashes on startup.
**Solution:** Developed a schema migration strategy by ensuring the backend uses `SQLModel.metadata.create_all(engine)` and handled local database refreshes during development.