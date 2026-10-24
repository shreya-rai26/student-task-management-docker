const form = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const countBadge = document.getElementById("countBadge");
const alertBox = document.getElementById("alertBox");

function showAlert(message, type = "success") {
  alertBox.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadTasks() {
  const response = await fetch("/api/tasks");
  const tasks = await response.json();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  countBadge.textContent = `${tasks.length} task${tasks.length === 1 ? "" : "s"}`;

  if (!tasks.length) {
    taskList.innerHTML = `
      <div class="col-12">
        <div class="card panel text-center p-5">
          <i class="bi bi-inbox fs-1 text-secondary"></i>
          <h5 class="mt-3">No tasks yet</h5>
          <p class="text-secondary mb-0">Add your first task above.</p>
        </div>
      </div>`;
    return;
  }

  taskList.innerHTML = tasks.map(task => `
    <div class="col-md-6 col-lg-4">
      <div class="card task-card priority-${task.priority.toLowerCase()} ${task.completed ? "completed" : ""}">
        <div class="card-body">
          <div class="d-flex justify-content-between gap-2">
            <h5>${escapeHtml(task.title)}</h5>
            <span class="badge text-bg-light">${escapeHtml(task.priority)}</span>
          </div>
          <p class="text-secondary small">${escapeHtml(task.description || "No description")}</p>
          <p class="small mb-3">
            <i class="bi bi-calendar3 me-1"></i>
            ${task.dueDate ? escapeHtml(task.dueDate) : "No due date"}
          </p>
          <div class="d-flex gap-2">
            <button class="btn btn-sm ${task.completed ? "btn-outline-secondary" : "btn-success"}" onclick="toggleTask('${task.id}', ${!task.completed})">
              <i class="bi ${task.completed ? "bi-arrow-counterclockwise" : "bi-check-lg"}"></i>
              ${task.completed ? "Undo" : "Complete"}
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteTask('${task.id}')">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>`).join("");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const task = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    priority: document.getElementById("priority").value,
    dueDate: document.getElementById("dueDate").value
  };

  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task)
  });

  const result = await response.json();

  if (!response.ok) {
    showAlert(result.message, "danger");
    return;
  }

  form.reset();
  showAlert("Task added successfully.");
  loadTasks();
});

async function toggleTask(id, completed) {
  const response = await fetch(`/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed })
  });

  if (!response.ok) {
    showAlert("Could not update the task.", "danger");
    return;
  }

  loadTasks();
}

async function deleteTask(id) {
  if (!confirm("Delete this task?")) return;

  const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });

  if (!response.ok) {
    showAlert("Could not delete the task.", "danger");
    return;
  }

  showAlert("Task deleted.");
  loadTasks();
}

loadTasks();