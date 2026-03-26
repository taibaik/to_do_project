/* =========================
   ENTER KEY SUPPORT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("taskInput");

  if (input) {
    input.addEventListener("keypress", e => {
      if (e.key === "Enter") addTask();
    });
  }
});


/* =========================
   FRONTEND → BACKEND CALLS
========================= */

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (!text) return;

  window.webui.call("add_task", text);
  input.value = "";
}

function toggleTask(id) {
  const item = document.querySelector(`[data-id="${id}"]`);
  if (item) item.classList.add("flip");

  window.webui.call("toggle_task", id);
}

function deleteTask(id) {
  const item = document.querySelector(`[data-id="${id}"]`);
  if (item) item.classList.add("removing");

  setTimeout(() => {
    window.webui.call("delete_task", id);
  }, 250);
}

function toggleFlag(id) {
  window.webui.call("toggle_flag", id);
}


/* =========================
   RENDER FROM BACKEND
========================= */

function renderFromBackend(data) {
  const tasks = JSON.parse(data);

  const list = document.getElementById("taskList");
  const app = document.getElementById("appContainer");

  list.innerHTML = "";

  // sort flagged first
  tasks.sort((a, b) => b.flagged - a.flagged);

  if (tasks.length > 6) app.classList.add("wide");
  else app.classList.remove("wide");

  const active = tasks.filter(t => !t.done);
  const done = tasks.filter(t => t.done);

  // active tasks
  active.forEach(t => list.appendChild(createTask(t)));

  // completed section
  if (done.length) {
    const title = document.createElement("div");
    title.className = "section-title";
    title.innerText = "Completed";
    list.appendChild(title);

    done.forEach(t => list.appendChild(createTask(t)));
  }
}


/* =========================
   UI CREATION (KEEP THIS)
========================= */

function createTask(task) {
  const li = document.createElement("li");
  li.setAttribute("data-id", task.id);

  li.innerHTML = `
    <div class="card">

      <div class="face front">
        
        <div class="task-left">
          <input 
            type="checkbox" 
            ${task.done ? "checked" : ""} 
            onclick="toggleTask(${task.id})"
          >

          <span class="task-text ${task.flagged ? 'flagged' : ''} ${task.done ? 'completed' : ''}">
            ${task.text}
          </span>
        </div>

        <div class="task-actions ${task.done ? "completed" : ""}">
          ${!task.done ? `
            <button class="flag-btn" onclick="toggleFlag(${task.id})">
              ${task.flagged ? "⭐" : "☆"}
            </button>
          ` : ""}
          <button class="delete-btn" onclick="deleteTask(${task.id})">X</button>
        </div>

      </div>

      <div class="face back">
        ✔ Completed
      </div>

    </div>
  `;

  requestAnimationFrame(() => li.classList.add("show"));
  return li;
}


/* =========================
   INTRO ANIMATION (KEEP)
========================= */

function enterApp() {
  const intro = document.getElementById("introView");
  const main = document.getElementById("mainView");
  const app = document.getElementById("appContainer");

  intro.style.opacity = "0";
  intro.style.transform = "scale(0.96)";

  setTimeout(() => {
    intro.style.display = "none";

    app.classList.add("active");

    main.classList.remove("hidden");
    main.style.opacity = "0";
    main.style.transform = "scale(0.96)";

    requestAnimationFrame(() => {
      main.style.transition = "all 0.4s ease";
      main.style.opacity = "1";
      main.style.transform = "scale(1)";
    });

  }, 250);
}