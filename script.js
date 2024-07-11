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

    function createTodoItem(text, isDeleted = false, isCompleted = false) {
        const li = document.createElement("li");
        li.className = isDeleted ? "" : "todo-item"; // 삭제된 항목에 클래스 제거
        li.style.display = "flex";
        li.style.alignItems = "center";
        li.style.justifyContent = "space-between";
        if (isCompleted) {
            li.classList.add("completed");
        }
        if (!isDeleted) {
            li.setAttribute("draggable", "true");
        }

        const dragHandle = document.createElement("span");
        dragHandle.className = "drag-handle";
        dragHandle.innerHTML = "&#9776;";
        if (isDeleted) {
            dragHandle.style.display = "none";
        } else {
            dragHandle.addEventListener("mousedown", (e) => {
                e.stopPropagation();
            });
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
                const detailInput = document.createElement("input");
                detailInput.type = "text";
                detailInput.className = "detail-input";
                detailInput.placeholder = "Enter details";

                detailInput.addEventListener("keypress", (e) => {
                    if (e.key === "Enter") {
                        const detailText = document.createElement("p");
                        detailText.className = "detail-text";
                        detailText.textContent = detailInput.value;
                        li.appendChild(detailText);
                        detailInput.remove();
                    }
                });

                li.appendChild(detailInput);
                detailInput.focus();
            }
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "🗑";
        deleteBtn.style.marginLeft = "auto";
        deleteBtn.addEventListener("click", () => {
            todoList.removeChild(li);
            deletedList.appendChild(createTodoItem(text, true, checkbox.checked));
        });

        if (isDeleted) {
            const restoreBtn = document.createElement("button");
            restoreBtn.className = "restore-btn";
            restoreBtn.textContent = "↺";
            restoreBtn.style.marginLeft = "auto";
            restoreBtn.style.fontSize = "1.4em"; // 크기 140%로 설정
            restoreBtn.addEventListener("click", () => {
                deletedList.removeChild(li);
                todoList.appendChild(createTodoItem(text, false, checkbox.checked));
            });
            li.appendChild(restoreBtn);
        }

        li.appendChild(dragHandle);
        li.appendChild(checkbox);
        li.appendChild(span);
        if (!isDeleted) {
            li.appendChild(deleteBtn);
        } else {
            li.appendChild(restoreBtn); // restoreBtn을 맨 마지막에 추가합니다
        }

        if (!isDeleted) {
            li.addEventListener("dragstart", handleDragStart);
            li.addEventListener("dragover", handleDragOver);
            li.addEventListener("drop", handleDrop);
            li.addEventListener("dragend", handleDragEnd);
        }

        return li;
    }

    let draggedItem = null;
    let dragging = false;

    function handleDragStart(e) {
        draggedItem = this;
        dragging = true;
        setTimeout(() => {
            this.style.display = 'none';
        }, 0);
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        if (this !== draggedItem) {
            let allItems = Array.from(todoList.querySelectorAll('.todo-item'));
            let draggedIndex = allItems.indexOf(draggedItem);
            let droppedIndex = allItems.indexOf(this);

            if (draggedIndex < droppedIndex) {
                this.after(draggedItem);
            } else {
                this.before(draggedItem);
            }
        }
    }

    function handleDragEnd() {
        setTimeout(() => {
            this.style.display = 'flex';
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
