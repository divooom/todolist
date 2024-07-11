document.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.getElementById("todo-input");
    const addBtn = document.getElementById("add-btn");
    const todoList = document.getElementById("todo-list");
    const showDeletedBtn = document.getElementById("show-deleted-btn");
    const deletedList = document.getElementById("deleted-list");

    deletedList.style.display = "none"; // 초기 display 설정

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

    function createTodoItem(text, isDeleted = false, isCompleted = false) {
        const li = document.createElement("li");
        li.className = "todo-item";
        li.style.display = "flex";
        li.style.alignItems = "center";
        li.style.justifyContent = "space-between";
        if (isCompleted) {
            li.classList.add("completed");
        }

        const dragHandle = document.createElement("span");
        dragHandle.className = "drag-handle";
        dragHandle.innerHTML = "&#9776;";
        if (isDeleted) {
            dragHandle.style.display = "none";
        } else {
            dragHandle.setAttribute("draggable", "true");
            dragHandle.addEventListener("dragstart", handleDragStart);
            dragHandle.addEventListener("dragover", handleDragOver);
            dragHandle.addEventListener("drop", handleDrop);
            dragHandle.addEventListener("dragend", handleDragEnd);
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "checkbox";
        checkbox.checked = isCompleted;
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

        span.addEventListener("click", (e) => {
            if (!li.querySelector(".detail-input") && !dragging) {
                const input = document.createElement("input");
                input.type = "text";
                input.className = "detail-input";
                input.placeholder = "Enter details";

                input.addEventListener("keypress", (e) => {
                    if (e.key === "Enter") {
                        const detailText = document.createElement("p");
                        detailText.className = "detail-text";
                        detailText.textContent = input.value;
                        li.appendChild(detailText);
                        input.remove();
                    }
                });

                li.appendChild(input);
                input.focus();
            }
        });

        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.innerHTML = "&#9998;"; // 파란색 라인 아이콘
        editBtn.addEventListener("click", () => {
            const newText = prompt("Edit your todo:", span.textContent);
            if (newText !== null && newText.trim() !== "") {
                span.textContent = newText.trim();
            }
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "🗑";
        deleteBtn.style.marginLeft = "auto";
        deleteBtn.addEventListener("click", () => {
            todoList.removeChild(li);
            const deletedItem = createTodoItem(text, true, checkbox.checked);
            deletedList.appendChild(deletedItem);
        });

        if (isDeleted) {
            const restoreBtn = document.createElement("button");
            restoreBtn.className = "restore-btn";
            restoreBtn.textContent = "↺";
            restoreBtn.style.marginLeft = "auto";
            restoreBtn.style.fontSize = "1.9em"; // 크기를 190%로 설정
            restoreBtn.addEventListener("click", () => {
                deletedList.removeChild(li);
                todoList.appendChild(createTodoItem(text, false, checkbox.checked));
            });

            const spacer = document.createElement("span");
            spacer.style.flexGrow = "1";

            li.appendChild(dragHandle);
            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(spacer);
            li.appendChild(restoreBtn);
        } else {
            li.appendChild(dragHandle);
            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
        }

        return li;
    }

    let draggedItem = null;
    let dragging = false;

    function handleDragStart(e) {
        draggedItem = this.closest(".todo-item");
        dragging = true;
        setTimeout(() => {
            draggedItem.style.display = 'none';
        }, 0);
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        const targetItem = this.closest(".todo-item");
        if (targetItem !== draggedItem) {
            let allItems = Array.from(todoList.querySelectorAll('.todo-item'));
            let draggedIndex = allItems.indexOf(draggedItem);
            let droppedIndex = allItems.indexOf(targetItem);

            if (draggedIndex < droppedIndex) {
                targetItem.after(draggedItem);
            } else {
                targetItem.before(draggedItem);
            }
        }
    }

    function handleDragEnd() {
        setTimeout(() => {
            draggedItem.style.display = 'flex';
            dragging = false;
            draggedItem = null;
        }, 0);
    }

    showDeletedBtn.addEventListener("click", () => {
        if (deletedList.style.display === "none") {
            deletedList.style.display = "block";
            showDeletedBtn.textContent = "Hide Deleted";
        } else {
            deletedList.style.display = "none";
            showDeletedBtn.textContent = "Show Deleted";
        }
    });
});
