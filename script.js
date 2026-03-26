let tasks = [];

/* add */
function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    done: false,
    flagged: false
  });

  input.value = "";
  renderTasks();
}

/* enter */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("taskInput")
    .addEventListener("keypress", e => {
      if (e.key === "Enter") addTask();
    });
});

/*  toggle coin flip */
function toggleTask(id) {
  const item = document.querySelector(`[data-id="${id}"]`);
  if (!item) return;

  item.classList.add("flip");

  setTimeout(() => {
    const task = tasks.find(t => t.id === id);
    task.done = !task.done;
    renderTasks();
  }, 550);
}

/* star / flag */
function toggleFlag(id) {
  const task = tasks.find(t => t.id === id);
  task.flagged = !task.flagged;
  renderTasks();
}

/* delete */
function deleteTask(id) {
  const item = document.querySelector(`[data-id="${id}"]`);
  if (!item) return;

  item.classList.add("removing");

  setTimeout(() => {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
  }, 250);
}

/* create task */
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

/* renderzzz */
function renderTasks() {
  const list = document.getElementById("taskList");
  const app = document.getElementById("appContainer");

  list.innerHTML = "";

  tasks.sort((a, b) => b.flagged - a.flagged);

  if (tasks.length > 6) app.classList.add("wide");
  else app.classList.remove("wide");

  const active = tasks.filter(t => !t.done);
  const done = tasks.filter(t => t.done);

  active.forEach(t => list.appendChild(createTask(t)));

  if (done.length) {
    const title = document.createElement("div");
    title.className = "section-title";
    title.innerText = "Completed";
    list.appendChild(title);

    done.forEach(t => list.appendChild(createTask(t)));
  }
}

/* introo */
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