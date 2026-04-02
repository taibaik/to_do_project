/* w8 for backend */
function waitForPywebview() {
  return new Promise(resolve => {
    if (window.pywebview) return resolve();

    const interval = setInterval(() => {
      if (window.pywebview) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });
}


/* init */
document.addEventListener("DOMContentLoaded", async () => {
  const input = document.getElementById("taskInput");

  input.addEventListener("keypress", e => {
    if (e.key === "Enter") addTask();
  });

  await waitForPywebview();

  const data = await window.pywebview.api.init_ui();
  renderTasks(data);
});


/* add */
async function addTask() {
  await waitForPywebview();

  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (!text) return;

  const data = await window.pywebview.api.add_task(text);
  input.value = "";
  renderTasks(data);
}


/* toggle done */
async function toggleTask(id) {
  const item = document.querySelector(`[data-id="${id}"]`);
  if (item) item.classList.add("flip");

  setTimeout(async () => {
    const data = await window.pywebview.api.toggle_task(id);
    renderTasks(data);
  }, 600);
}


/* delete */
async function deleteTask(id) {
  const item = document.querySelector(`[data-id="${id}"]`);
  if (item) item.classList.add("removing");

  setTimeout(async () => {
    const data = await window.pywebview.api.delete_task(id);
    renderTasks(data);
  }, 250);
}


/* flag */
async function toggleFlag(id) {
  const data = await window.pywebview.api.toggle_flag(id);
  renderTasks(data);
}


/* render*/
function renderTasks(tasks) {
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


/* ui */
function createTask(task) {
  const li = document.createElement("li");
  li.setAttribute("data-id", task.id);

  li.innerHTML = `
    <div class="card">

      <div class="face front">
        
        <div class="task-left">
          ${
            !task.done
              ? `<input type="checkbox" onclick="toggleTask(${task.id})">`
              : ""
          }

          <span class="task-text ${task.flagged ? 'flagged' : ''} ${task.done ? 'completed' : ''}">
            ${task.text}
          </span>
        </div>

        <div class="task-actions ${task.done ? "completed" : ""}">
          ${
            !task.done
              ? `
            <button class="flag-btn" onclick="toggleFlag(${task.id})">
              ${task.flagged ? "⭐" : "☆"}
            </button>
          `
              : ""
          }
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


/* intro */
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