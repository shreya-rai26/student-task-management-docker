const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const dataDir = process.env.DATA_DIR || path.join(__dirname, "data");
const dataFile = path.join(dataDir, "tasks.json");

fs.mkdirSync(dataDir, { recursive: true });

function readTasks() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, "[]");
  }
  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

function writeTasks(tasks) {
  fs.writeFileSync(dataFile, JSON.stringify(tasks, null, 2));
}

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/tasks", (req, res) => {
  res.json(readTasks());
});

app.post("/api/tasks", (req, res) => {
  const { title, description = "", priority = "Medium", dueDate = "" } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Task title is required." });
  }

  const tasks = readTasks();
  const task = {
    id: Date.now().toString(),
    title: title.trim(),
    description: description.trim(),
    priority,
    dueDate,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(task);
  writeTasks(tasks);
  res.status(201).json(task);
});

app.put("/api/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const index = tasks.findIndex(t => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Task not found." });
  }

  const current = tasks[index];
  tasks[index] = {
    ...current,
    title: req.body.title?.trim() || current.title,
    description: req.body.description?.trim() ?? current.description,
    priority: req.body.priority || current.priority,
    dueDate: req.body.dueDate ?? current.dueDate,
    completed: typeof req.body.completed === "boolean" ? req.body.completed : current.completed
  };

  writeTasks(tasks);
  res.json(tasks[index]);
});

app.delete("/api/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const filtered = tasks.filter(t => t.id !== req.params.id);

  if (filtered.length === tasks.length) {
    return res.status(404).json({ message: "Task not found." });
  }

  writeTasks(filtered);
  res.json({ message: "Task deleted successfully." });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Task Management App running on port ${PORT}`);
});