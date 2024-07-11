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

    todoList.addEventListener("click", (e) => {
        if (e.target.classList.contains("drag-handle")) {
            return; // 햄버거 아이콘이 클릭된 경우에는 아무 동작도 하지 않음
        }

        const listItem = e.target.closest(".todo-item");
        if (listItem) {
            const detailInput = listItem.querySelector(".detail-input");
            if (!detailInput && !dragging) {
                const input = document.createElement("input");
                input.type = "text";
                input.className = "detail-input";
                input.placeholder = "Enter details";

                input.addEventListener("keypress", (e) => {
                    if (e.key === "Enter") {
                        const detailText = document.createElement("p");
                        detailText.className = "detail-text";
                        detailText.textContent = input.value;
                        listItem.appendChild(detailText);
                        input.remove();
                    }
                });

                listItem.appendChild(input);
                input.focus();
            }
        }
    });

showDeletedBtn.addEventListener("click", () => {
    console.log("Button clicked"); // 디버깅용 로그
    if (deletedList.style.display === "none") {
        deletedList.style.display = "block";
        console.log("Showing deleted items"); // 디버깅용 로그
        showDeletedBtn.textContent = "Hide Deleted";  
    } else {
        deletedList.style.display = "none";
        console.log("Hiding deleted items"); // 디버깅용 로그
        showDeletedBtn.textContent = "Show Deleted";
    }
});

deleteBtn.addEventListener("click", () => {
    todoList.removeChild(li);
    deletedList.appendChild(createTodoItem(text, true, checkbox.checked));
    console.log("Item deleted and added to deleted list"); // 디버깅용 로그
});
});
