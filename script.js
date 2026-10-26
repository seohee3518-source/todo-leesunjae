// 할 일 목록을 JSON 글자로 바꿔서 이 브라우저(localStorage)에 저장한다.
const KEY = "todos";

const form = document.getElementById("add-form");
const input = document.getElementById("new-todo");
const list = document.getElementById("todo-list");
const empty = document.getElementById("empty");
const count = document.getElementById("count");
const clearDone = document.getElementById("clear-done");

function load() {
  try {
    const todos = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(todos) ? todos : [];
  } catch (e) {
    return [];
  }
}

let todos = load();

function save() {
  localStorage.setItem(KEY, JSON.stringify(todos));
}

function render() {
  list.innerHTML = "";
  todos.forEach((todo) => {
    const li = document.createElement("li");
    if (todo.done) li.className = "done";

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = todo.done;
    check.addEventListener("change", () => {
      todo.done = check.checked;
      save();
      render();
    });

    const text = document.createElement("span");
    text.className = "text";
    text.textContent = todo.text;

    const del = document.createElement("button");
    del.type = "button";
    del.className = "delete";
    del.textContent = "삭제";
    del.addEventListener("click", () => {
      todos = todos.filter((t) => t.id !== todo.id);
      save();
      render();
    });

    li.append(check, text, del);
    list.append(li);
  });

  const left = todos.filter((t) => !t.done).length;
  count.textContent = todos.length ? `남은 일 ${left}개 / 전체 ${todos.length}개` : "";
  empty.hidden = todos.length > 0;
  clearDone.hidden = !todos.some((t) => t.done);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  todos.push({ id: Date.now(), text: text, done: false });
  input.value = "";
  save();
  render();
});

clearDone.addEventListener("click", () => {
  todos = todos.filter((t) => !t.done);
  save();
  render();
});

render();
