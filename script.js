document.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.getElementById("todo-input");
    const addABtn = document.getElementById("add-a-btn");
    const addBBtn = document.getElementById("add-b-btn");
    const todoListA = document.getElementById("todo-list-a");
    const todoListB = document.getElementById("todo-list-b");
    const showDeletedBtn = document.getElementById("show-deleted-btn");
    const deletedList = document.getElementById("deleted-list");
    const topButton = document.getElementById("top-button");
    const descriptionButton = document.getElementById("description-button");
    const cpalinkButton = document.getElementById("cpalink-button");
    const titleInput = document.getElementById("title-input");

    let currentList = todoListA;
    let draggedItem = null;
    let dragging = false;

    deletedList.style.display = "block";
    showDeletedBtn.textContent = "Hide Deleted";

    loadFromLocalStorage();

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
            e.preventDefault();
        } else if (e.key === "Enter" && e.shiftKey) {
            addTodoToList(todoListB);
            e.preventDefault();
        }
    });

    function addTodoToList(list) {
        const text = todoInput.value.trim();
        if (text !== "") {
            const todoItem = createTodoItem(text, list);
            list.appendChild(todoItem);
            todoInput.value = "";
            updateTodoNumbers(list);
            checkEmptyPlaceholder(list);
            saveToLocalStorage();
        }
    }

    function createTodoItem(text, list, isDeleted = false, isCompleted = false, elapsedTime = 0, isPlaceholder = false) { //♠
    const li = document.createElement("li");
    li.className = isPlaceholder ? "todo-item placeholder" : "todo-item"; //♠
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.justifyContent = "space-between";
    if (isCompleted) {
        li.classList.add("completed");
    }
  
        const number = document.createElement("span");
        number.className = "todo-number";
        number.style.marginRight = "10px";
        if (isDeleted) {
        number.style.display = "none"; //◐△
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
        if (isDeleted) {
        checkbox.style.display = "none"; //◐△
    }
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                li.classList.add("completed");
            } else {
                li.classList.remove("completed");
            }
            saveToLocalStorage();
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
                        saveToLocalStorage();
                    }
                });

                li.appendChild(input);
                input.focus();
            }
        });

        const stopwatchContainer = document.createElement("div");
        stopwatchContainer.className = "stopwatch-container";
        if (isDeleted) {
    stopwatchContainer.style.display = "none"; //◆◇◆
}

        const playPauseButton = document.createElement("button");
        playPauseButton.className = "stopwatch-btn play-pause-btn";
        playPauseButton.innerHTML = "▶️";
        if (isDeleted) {
        playPauseButton.style.display = "none"; //◐△
    }
        playPauseButton.addEventListener("click", toggleStopwatch);

        const resetButton = document.createElement("button");
        resetButton.className = "stopwatch-btn reset-btn";
        resetButton.innerHTML = "&#x21bb;";
        if (isDeleted) {
        resetButton.style.display = "none"; //◐△
    }
        resetButton.addEventListener("click", resetStopwatch);

        const timerDisplay = document.createElement("span");
        timerDisplay.className = "timer-display";
        timerDisplay.textContent = formatTime(elapsedTime);
        if (isDeleted) {
        timerDisplay.style.display = "none"; //◐△
    }

        stopwatchContainer.appendChild(playPauseButton);
        stopwatchContainer.appendChild(timerDisplay);
        stopwatchContainer.appendChild(resetButton);

        let stopwatchInterval;
        let running = false;
        let startTime, elapsed = elapsedTime;

        function toggleStopwatch() {
            if (running) {
                clearInterval(stopwatchInterval);
                running = false;
                playPauseButton.innerHTML = "▶️";
                timerDisplay.style.backgroundColor = "#797979";
                timerDisplay.style.border = "none";
            } else {
                startTime = Date.now() - elapsed;
                stopwatchInterval = setInterval(() => {
                    elapsed = Date.now() - startTime;
                    timerDisplay.textContent = formatTime(elapsed);
                }, 1000);
                running = true;
                playPauseButton.innerHTML = "&#10074;&#10074;";
                timerDisplay.style.backgroundColor = "white";
                timerDisplay.style.border = "5px solid #0074ff";
            }
            saveToLocalStorage();
        }

        function resetStopwatch() {
            clearInterval(stopwatchInterval);
            running = false;
            elapsed = 0;
            timerDisplay.textContent = "00:00:00";
            playPauseButton.innerHTML = "▶️";
            timerDisplay.style.backgroundColor = "#797979";
            timerDisplay.style.border = "none";
            saveToLocalStorage();
        }

        function formatTime(ms) {
            const totalSeconds = Math.floor(ms / 1000);
            const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
            const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
            const seconds = String(totalSeconds % 60).padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        }

        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.innerHTML = "&#9998;";
        if (isDeleted) {
        editBtn.style.display = "none"; //◐
    }
        editBtn.addEventListener("click", () => {
            const newText = prompt("Edit your todo:", span.textContent);
            if (newText !== null && newText.trim() !== "") {
                span.textContent = newText.trim();
                saveToLocalStorage();
            }
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerHTML = "&#128465;";
        deleteBtn.style.marginLeft = "10px";
        if (isDeleted) {
        deleteBtn.style.display = "none"; //◐
    }
        deleteBtn.addEventListener("click", handleDelete);

        if (isDeleted) {
            const restoreBtn = document.createElement("button");
            restoreBtn.className = "restore-btn";
            restoreBtn.innerHTML = "&#8635;";
            restoreBtn.style.marginLeft = "10px";
            restoreBtn.addEventListener("click", () => {
                deletedList.removeChild(li);
                const originalListId = li.dataset.originalList;
                const originalList = document.getElementById(originalListId);
                originalList.appendChild(createTodoItem(text, originalList, false, checkbox.checked, elapsed));
                updateTodoNumbers(originalList);
                checkEmptyPlaceholder(originalList);
                saveToLocalStorage();
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
            li.appendChild(stopwatchContainer);
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
        }

        return li;
    }

    function updateTodoNumbers(list) {
        const items = list.querySelectorAll('.todo-item');
        let actualIndex = 1;
        items.forEach((item) => {
            const number = item.querySelector('.todo-number');
            if (number) {
                if (!item.classList.contains('placeholder')) { //♠
            number.textContent = `${actualIndex}. `;
            actualIndex++;
        } else {
            number.textContent = '0. ';
        }
            }
        });
    }

    function checkEmptyPlaceholder(list) {
        let placeholder = list.querySelector(".placeholder");
        if (!placeholder && list.querySelectorAll('.todo-item:not(.placeholder)').length === 0) { //▷
            placeholder = document.createElement("li");
            placeholder.className = "todo-item placeholder";
            placeholder.setAttribute("draggable", "true");

            placeholder.textContent = list.id === "todo-list-a" ? "A - List" : "B - List";

            placeholder.addEventListener("dragstart", handleDragStart);
            placeholder.addEventListener("dragover", handleDragOver);
            placeholder.addEventListener("drop", handleDrop);
            placeholder.addEventListener("dragend", handleDragEnd);
            list.insertBefore(placeholder, list.firstChild);
        }
        else if (list.querySelectorAll('.todo-item').length === 1 && placeholder) { //◇●
        list.appendChild(placeholder); //◇●
    }
    }

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

        if (targetItem !== draggedItem && !targetItem.classList.contains('placeholder')) {
            let allItems = Array.from(targetList.querySelectorAll('.todo-item'));
            let draggedIndex = allItems.indexOf(draggedItem);
            let droppedIndex = allItems.indexOf(targetItem);

            if (draggedIndex < droppedIndex) {
                targetItem.after(draggedItem);
            } else {
                targetItem.before(draggedItem);
            }
        } else if (targetItem.classList.contains('placeholder')) {
            targetList.insertBefore(draggedItem, targetItem.nextSibling);
        }
        
        updateTodoNumbers(targetList);
        updateTodoNumbers(todoListA);
        updateTodoNumbers(todoListB);
        checkEmptyPlaceholder(todoListA);
        checkEmptyPlaceholder(todoListB);

        const deleteBtn = draggedItem.querySelector('.delete-btn');
        deleteBtn.removeEventListener("click", handleDelete);
        deleteBtn.addEventListener('click', handleDelete);
        saveToLocalStorage();
    }

    function handleDelete() {
        const list = this.closest("ul");
        const li = this.closest(".todo-item");
        const elapsed = parseTime(li.querySelector('.timer-display').textContent);
        list.removeChild(li);
        const deletedItem = createTodoItem(li.querySelector('.text').textContent, list, true, li.querySelector('.checkbox').checked, elapsed);
        deletedItem.dataset.originalList = list.id;
        deletedList.appendChild(deletedItem);
        updateTodoNumbers(list);
        checkEmptyPlaceholder(list);
        saveToLocalStorage();
    }

    function handleDragEnd() {
        setTimeout(() => {
            draggedItem.style.display = 'flex';
            dragging = false;
            draggedItem = null;
            checkEmptyPlaceholder(todoListA);
            checkEmptyPlaceholder(todoListB);
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

    topButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    descriptionButton.addEventListener("click", () => {
        alert("ToDo-List 간단 사용법:\n\n- 그냥 엔터를 치면 A로 갑니다.\n- SHIFT+ENTER를 치면 B로 갑니다.");
    });

    cpalinkButton.addEventListener("click", () => {
        window.open("https://iryan.kr/t7rbs8lqau", "_blank");
    });

    checkEmptyPlaceholder(todoListA);
    checkEmptyPlaceholder(todoListB);

    function saveToLocalStorage() {
        const data = {
            title: titleInput.value,
            listA: serializeList(todoListA),
            listB: serializeList(todoListB),
            deleted: serializeList(deletedList),
            placeholderTextA: todoListA.querySelector('.placeholder') ? todoListA.querySelector('.placeholder').textContent : '',
            placeholderTextB: todoListB.querySelector('.placeholder') ? todoListB.querySelector('.placeholder').textContent : ''
        };
        console.log('Saving to localStorage:', data); // 디버깅용 로그
        localStorage.setItem('todoData', JSON.stringify(data));
    }

    function loadFromLocalStorage() {
        const data = JSON.parse(localStorage.getItem('todoData'));
        if (data) {
            console.log('Loading from localStorage:', data); // 디버깅용 로그
            titleInput.value = data.title;
            deserializeList(todoListA, data.listA, data.placeholderTextA);
            deserializeList(todoListB, data.listB, data.placeholderTextB);
            deserializeList(deletedList, data.deleted);
        }
    }

    function serializeList(list) {
        return Array.from(list.querySelectorAll('.todo-item')).filter(item => !item.classList.contains('placeholder')).map(item => ({ //◆
            text: item.querySelector('.text') ? item.querySelector('.text').textContent : '',
            completed: item.querySelector('.checkbox') ? item.querySelector('.checkbox').checked : false,
            elapsedTime: item.querySelector('.timer-display') ? parseTime(item.querySelector('.timer-display').textContent) : 0
        }));
    }

function deserializeList(list, items, placeholderText) {
    list.innerHTML = '';
    const placeholder = document.createElement("li");
    placeholder.className = "todo-item placeholder";
    placeholder.textContent = placeholderText;
    placeholder.setAttribute("draggable", "true");
    placeholder.addEventListener("dragstart", handleDragStart);
    placeholder.addEventListener("dragover", handleDragOver);
    placeholder.addEventListener("drop", handleDrop);
    placeholder.addEventListener("dragend", handleDragEnd);
    list.appendChild(placeholder);
    items.forEach(({ text, completed, elapsedTime, isDeleted }) => {
        const item = createTodoItem(text, list, isDeleted, completed, elapsedTime);
        list.appendChild(item);
    });
    updateTodoNumbers(list);
    checkEmptyPlaceholder(list); //▷
    
}

    function parseTime(timeString) {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        return (hours * 3600 + minutes * 60 + seconds) * 1000;
    }
});
