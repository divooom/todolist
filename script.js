document.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.getElementById("todo-input");
    const addABtn = document.getElementById("add-a-btn");
    const addBBtn = document.getElementById("add-b-btn");
    const todoListA = document.getElementById("todo-list-a");
    const todoListB = document.getElementById("todo-list-b");
    const showDeletedBtn = document.getElementById("show-deleted-btn");
    const deletedList = document.getElementById("deleted-list");

    let currentList = todoListA;

    addABtn.addEventListener("click", () => {
        currentList = todoListA;
        addTodoToList(todoListA);
    });

    addBBtn.addEventListener("click", () => {
        currentList = todoListB;
        addTodoToList(todoListB);
    });

    todoInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            addTodoToList(currentList);
            e.preventDefault();
        }
    });

    function addTodoToList(list) {
        const text = todoInput.value.trim();
        if (text !== "") {
            const todoItem = createTodoItem(text);
            list.appendChild(todoItem);
            todoInput.value = "";
            updateTodoNumbers(list);
        }
    }

    function createTodoItem(text, isDeleted = false, isCompleted = false) {
        const li = document.createElement("li");
        li.className = "todo-item";
        if (isCompleted) {
            li.classList.add("completed");
        }

        const number = document.createElement("span");
        number.className = "todo-number";

        const dragHandle = document.createElement("span");
        dragHandle.className = "drag-handle";
        dragHandle.innerHTML = "&#9776;";
        if (!isDeleted) {
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

        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.innerHTML = "&#9998;";
        editBtn.addEventListener("click", () => {
            const newText = prompt("Edit your todo:", span.textContent);
            if (newText !== null && newText.trim() !== "") {
                span.textContent = newText.trim();
            }
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerHTML = "&#128465;";
        deleteBtn.addEventListener("click", () => {
            list.removeChild(li);
            const deletedItem = createTodoItem(text, true, checkbox.checked);
            deletedItem.dataset.originalList = list.id;
            deletedList.appendChild(deletedItem);
            updateTodoNumbers(list);
        });

        if (isDeleted) {
            const restoreBtn = document.createElement("button");
            restoreBtn.className = "restore-btn";
            restoreBtn.innerHTML = "&#8635;";
            restoreBtn.addEventListener("click", () => {
                deletedList.removeChild(li);
                const originalListId = li.dataset.originalList;
                const originalList = document.getElementById(originalListId);
                originalList.appendChild(createTodoItem(text, false, checkbox.checked));
                updateTodoNumbers(originalList);
            });

            const spacer = document.createElement("span");
            spacer.style.flexGrow = "1";

            li.appendChild(dragHandle);
            li.appendChild(checkbox);
            li.appendChild(number);
            li.appendChild(span);
            li.appendChild(spacer);
            li.appendChild(restoreBtn);
        } else {
            li.appendChild(dragHandle);
            li.appendChild(checkbox);
            li.appendChild(number);
            li.appendChild(span);
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
        }

        return li;
    }

    function updateTodoNumbers(list) {
        const items = list.querySelectorAll('.todo-item');
        items.forEach((item, index) => {
            const number = item.querySelector('.todo-number');
            number.textContent = `${index + 1}. `;
        });
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
        const targetList = targetItem ? targetItem.closest("ul") : e.target.closest(".todo-list-wrapper").querySelector("ul");

        if (targetList) {
            if (targetItem && targetItem !== draggedItem) {
                let allItems = Array.from(targetList.querySelectorAll('.todo-item'));
                let draggedIndex = allItems.indexOf(draggedItem);
                let droppedIndex = allItems.indexOf(targetItem);

                if (draggedIndex < droppedIndex) {
                    targetItem.after(draggedItem);
                } else {
                    targetItem.before(draggedItem);
                }
            } else {
                targetList.appendChild(draggedItem);
            }
            updateTodoNumbers(targetList);
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

    // 빈 영역 드래그 가능하도록 설정
    document.querySelectorAll('.todo-list-wrapper').forEach(wrapper => {
        wrapper.addEventListener('dragover', handleDragOver);
        wrapper.addEventListener('drop', handleDrop);
    });
});
