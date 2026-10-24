# Student Task Management Web Application

TPDS-III Module 4 Practical 2 — Dockerization and Cloud Deployment of a Node.js Web Application.

## Features

- Responsive task management interface
- Create, view, update, complete, and delete tasks
- REST API using Node.js and Express.js
- Persistent JSON-file storage
- Dockerfile for containerization
- Local Docker port mapping
- Ready for Docker-compatible cloud deployment

## Tech Stack

- Node.js
- Express.js
- HTML5
- CSS3
- Bootstrap 5
- JavaScript
- Docker

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## REST API

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `GET /api/health`

## Run with Docker

Build:

```bash
docker build -t student-task-manager .
```

Run with persistent storage:

```bash
docker run -d --name task-manager -p 3000:3000 -v task_data:/app/data student-task-manager
```

Open `http://localhost:3000`.

## Cloud deployment

Use the repository with a Docker-compatible cloud platform such as Render, Azure, AWS, or another supported platform. Set the service to use the included `Dockerfile` and expose port `3000` (or the platform-provided PORT).

Note: the local JSON storage is persistent across container restarts when a Docker volume is mounted. A cloud platform's filesystem persistence depends on its storage configuration.