document.addEventListener("DOMContentLoaded", () => {
    // 새로운 Title 입력란 생성 및 설정
    const titleInput = document.createElement("textarea");
    titleInput.id = "title-input";
    titleInput.placeholder = "Title";
    titleInput.classList.add("title-area");

    const titleDivider = document.createElement("hr");
    titleDivider.classList.add("title-divider");

    const container = document.querySelector(".container");
    container.insertBefore(titleInput, container.firstChild);
    container.insertBefore(titleDivider, titleInput.nextSibling);

    // 기존 코드...
    const todoInput = document.getElementById("todo-input");
    const addABtn = document.getElementById("add-a-btn");
    const addBBtn = document.getElementById("add-b-btn");
    const todoListA = document.getElementById("todo-list-a");
    const todoListB = document.getElementById("todo-list-b");
    const showDeletedBtn = document.getElementById("show-deleted-btn");
    const deletedList = document.getElementById("deleted-list");

    let currentList = todoListA; // 기본적으로 A 목록에 추가되도록 설정

    // 초기 상태를 "Hide Deleted"로 설정
    deletedList.style.display = "block"; // 삭제된 목록을 보이도록 설정
    showDeletedBtn.textContent = "Hide Deleted"; // 버튼 텍스트 변경

    addABtn.addEventListener("click", () => {
        currentList = todoListA;
        addTodoToList(todoListA);
    });

    addBBtn.addEventListener("click", () => {
        currentList = todoListB;
        addTodoToList(todoListB);
    });

    todoInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            addTodoToList(todoListA);
            e.preventDefault(); // 기본 Enter 동작 방지
        } else if (e.key === "Enter" && e.shiftKey) {
            addTodoToList(todoListB);
            e.preventDefault(); // 기본 Enter 동작 방지
        }
    });

    function addTodoToList(list) {
        const text = todoInput.value.trim();
        if (text !== "") {
            const todoItem = createTodoItem(text, list);
            list.appendChild(todoItem);
            todoInput.value = "";
            updateTodoNumbers(list);
            checkEmptyPlaceholder(list); // 빈 항목(플레이스홀더) 확인
        }
    }

    function createTodoItem(text, list, isDeleted = false, isCompleted = false) {
        const li = document.createElement("li");
        li.className = "todo-item";
        li.style.display = "flex";
        li.style.alignItems = "center";
        li.style.justifyContent = "space-between";
        if (isCompleted) {
            li.classList.add("completed");
        }

        const number = document.createElement("span");
        number.className = "todo-number";
        number.style.marginRight = "10px"; // 텍스트와 번호 사이에 간격 추가

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
        deleteBtn.innerHTML = "&#128465;"; // 🗑 아이콘
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.addEventListener("click", handleDelete);

        if (isDeleted) {
            const restoreBtn = document.createElement("button");
            restoreBtn.className = "restore-btn";
            restoreBtn.innerHTML = "&#8635;"; // ↺ 아이콘
            restoreBtn.style.marginLeft = "10px";
            restoreBtn.addEventListener("click", () => {
                deletedList.removeChild(li);
                const originalListId = li.dataset.originalList;
                const originalList = document.getElementById(originalListId);
                originalList.appendChild(createTodoItem(text, originalList, false, checkbox.checked));
                updateTodoNumbers(originalList);
                checkEmptyPlaceholder(originalList); // 빈 항목(플레이스홀더) 확인
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

    function checkEmptyPlaceholder(list) {
        const placeholder = list.querySelector(".placeholder");
        if (!placeholder) {
            const newPlaceholder = document.createElement("li");
            newPlaceholder.className = "todo-item placeholder";
            newPlaceholder.setAttribute("draggable", "true");

            // A와 B 목록에 따라 텍스트 설정
            if (list.id === "todo-list-a") {
                newPlaceholder.textContent = "A - List";
            } else if (list.id === "todo-list-b") {
                newPlaceholder.textContent = "B - List";
            }

            newPlaceholder.addEventListener("dragstart", handleDragStart);
            newPlaceholder.addEventListener("dragover", handleDragOver);
            newPlaceholder.addEventListener("drop", handleDrop);
            newPlaceholder.addEventListener("dragend", handleDragEnd);
            list.appendChild(newPlaceholder);
        }
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
        const targetList = targetItem.closest("ul");

        if (targetItem !== draggedItem) {
            let allItems = Array.from(targetList.querySelectorAll('.todo-item'));
            let draggedIndex = allItems.indexOf(draggedItem);
            let droppedIndex = allItems.indexOf(targetItem);

            if (draggedIndex < droppedIndex) {
                targetItem.after(draggedItem);
            } else {
                targetItem.before(draggedItem);
            }
            
            updateTodoNumbers(targetList);
            checkEmptyPlaceholder(todoListA);
            checkEmptyPlaceholder(todoListB);
            
            // Re-attach delete button event listener
            const deleteBtn = draggedItem.querySelector('.delete-btn');
            deleteBtn.removeEventListener("click", handleDelete);
            deleteBtn.addEventListener('click', handleDelete);
        }
    }

    function handleDelete() {
        const list = this.closest("ul");
        const li = this.closest(".todo-item");
        list.removeChild(li);
        const deletedItem = createTodoItem(li.querySelector('.text').textContent, list, true, li.querySelector('.checkbox').checked);
        deletedItem.dataset.originalList = list.id;
        deletedList.appendChild(deletedItem);
        updateTodoNumbers(list);
        checkEmptyPlaceholder(list); // 빈 항목(플레이스홀더) 확인
    }

    function handleDragEnd() {
        setTimeout(() => {
            draggedItem.style.display = 'flex';
            dragging = false;
            draggedItem = null;
            checkEmptyPlaceholder(todoListA); // 빈 항목(플레이스홀더) 확인
            checkEmptyPlaceholder(todoListB); // 빈 항목(플레이스홀더) 확인
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

    // 초기 빈 항목(플레이스홀더) 추가
    checkEmptyPlaceholder(todoListA);
    checkEmptyPlaceholder(todoListB);
});
