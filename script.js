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
        li.className = "todo-item";
        li.style.display = "flex"; // 추가
        li.style.alignItems = "center"; // 추가
        li.style.justifyContent = "space-between"; // 추가
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
            dragHandle.style.display = "none"; // 삭제된 목록에서는 드래그 핸들 숨김
        } else {
            dragHandle.addEventListener("mousedown", (e) => {
                e.stopPropagation(); // Prevent drag handle click from triggering detail input
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

        // 클릭 시 디테일 입력칸을 추가하는 이벤트
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
        }

        // 드래그 이벤트 리스너 추가
        if (!isDeleted) {
            li.addEventListener("dragstart", handleDragStart);
            li.addEventListener("dragover", handleDragOver);
            li.addEventListener("drop", handleDrop);
            li.addEventListener("dragend", handleDragEnd);
        }

        return li;
    }

    let draggedItem = null;
    let dragging = false; // 드래그 상태를 추적하기 위한 변수

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
        } else {
            deletedList.style.display = "none";
        }
    });
});
