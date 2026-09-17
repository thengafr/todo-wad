const STORAGE_KEY = "todos";

const form = document.getElementById("addForm");
const input = document.getElementById("todoInput");
const list = document.getElementById("list");
const empty = document.getElementById("empty");
const count = document.getElementById("count");

let todos = loadTodos();

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load todos:", e);
    return [];
  }
}

function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (e) {
    console.error("Failed to save todos:", e);
  }
}

function render() {
  list.innerHTML = "";

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "item" + (todo.done ? " done" : "");
    li.dataset.id = todo.id;

    const check = document.createElement("button");
    check.className = "item__check";
    check.setAttribute("aria-label", "Toggle complete");
    check.addEventListener("click", () => toggleTodo(todo.id));

    const text = document.createElement("span");
    text.className = "item__text";
    text.textContent = todo.text;

    const remove = document.createElement("button");
    remove.className = "item__remove";
    remove.setAttribute("aria-label", "Remove task");
    remove.textContent = "✕";
    remove.addEventListener("click", () => removeTodo(todo.id));

    li.append(check, text, remove);
    list.appendChild(li);
  });

  const left = todos.filter((t) => !t.done).length;
  count.textContent = `${left} left`;
  empty.classList.toggle("show", todos.length === 0);
}

function addTodo(text) {
  todos.unshift({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    text,
    done: false,
  });
  saveTodos();
  render();
}

function toggleTodo(id) {
  todos = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  saveTodos();
  render();
}

function removeTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  render();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  addTodo(value);
  input.value = "";
  input.focus();
});

render();
