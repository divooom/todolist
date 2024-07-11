document.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.getElementById("todo-input");
    const addBtn = document.getElementById("add-btn");
    const todoList = document.getElementById("todo-list");
    const showDeletedBtn = document.getElementById("show-deleted-btn");
    const deletedList = document.getElementById("deleted-list");

    addBtn.addEventListener("click", addTodo);
    todoInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            addTodo();
        }
    });

    function addTodo() {
        const text = todoInput.value.trim();
        if (text !== "") {
            const todoItem = createTodoItem(text);
            todoList.appendChild(todoItem);
            todoInput.value = "";
        }
    }

    function createTodoItem(text) {
        const li = document.createElement("li");
        li.className = "todo-item";

        const dragHandle = document.createElement("span");
        dragHandle.className = "drag-handle";
        dragHandle.textContent = "☰";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "checkbox";
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                li.classList.add("completed");
            } else {
                li.classList.remove("completed");
            }
        });

        const span = document.createElement("span");
        span.className = "text";
        span.textContent = text;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "🗑";
        deleteBtn.addEventListener("click", () => {
            todoList.removeChild(li);
            deletedList.appendChild(li);
        });

        li.appendChild(dragHandle);
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        return li;
    }

    showDeletedBtn.addEventListener("click", () => {
        if (deletedList.style.display === "none") {
            deletedList.style.display = "block";
        } else {
            deletedList.style.display = "none";
        }
    });
});
