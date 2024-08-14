document.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.getElementById("todo-input");
    const addABtn = document.getElementById("add-a-btn");
    const addBBtn = document.getElementById("add-b-btn");
    const todoListA = document.getElementById("todo-list-a");
    const todoListB = document.getElementById("todo-list-b");
    const showDeletedBtn = document.getElementById("show-deleted-btn");
    const deletedList = document.getElementById("deleted-list");
    const clearButton = document.getElementById("clear-button");
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
                console.log('Restoring item:', JSON.stringify({
        text: text,
        originalListId: li.dataset.originalList,
        originalIndex: li.dataset.originalIndex
    }, null, 2));
                deletedList.removeChild(li);
                const originalListId = li.dataset.originalList;
                const originalIndex = parseInt(li.dataset.originalIndex); // CLAUDE 추가
                const originalList = document.getElementById(originalListId);
                const restoredItem = createTodoItem(text, originalList, false, checkbox.checked, elapsed);

                restoredItem.dataset.originalList = originalListId;
                restoredItem.dataset.originalIndex = originalIndex;
                
                const insertIndex = Math.min(originalIndex, originalList.children.length); // CLAUDE 추가
                originalList.insertBefore(restoredItem, originalList.children[insertIndex]); // CLAUDE 수정
                updateTodoNumbers(originalList);
                checkEmptyPlaceholder(originalList);
                saveToLocalStorage();
            });

            // 완전삭제 버튼 추가 시작
      
        const deletePermanentlyBtn = document.createElement("button");
        deletePermanentlyBtn.className = "delete-btn";
        deletePermanentlyBtn.innerHTML = "&#128465;";
        deletePermanentlyBtn.style.marginLeft = "10px";
        deletePermanentlyBtn.addEventListener("click", () => {
            const isConfirmed = confirm('해당 리스트를 완전히 삭제하시겠습니까?\nAre you sure you want to delete the list completely?');
            if (isConfirmed) {
                deletedList.removeChild(li);
                saveToLocalStorage();
            }
        });
            // 완전삭제 버튼 끝

            const spacer = document.createElement("span");
            spacer.style.flexGrow = "1";

            li.appendChild(dragHandle);
            li.appendChild(checkbox);
            li.appendChild(number);
            li.appendChild(span);
            li.appendChild(spacer);
            li.appendChild(restoreBtn);
            li.appendChild(deletePermanentlyBtn);
        } else {
            li.appendChild(dragHandle);
            li.appendChild(checkbox);
            li.appendChild(number);
            li.appendChild(span);
            li.appendChild(stopwatchContainer);
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
        }

         console.log('Created todo item:', JSON.stringify({
        text: text,
        isDeleted: isDeleted,
        isCompleted: isCompleted,
        elapsedTime: elapsedTime,
        isPlaceholder: isPlaceholder
    }, null, 2));
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

            placeholder.addEventListener("dragstart", handlePlaceholderDragStart); //●▷
            placeholder.addEventListener("dragover", handleDragOver);
            placeholder.addEventListener("drop", handleDrop);
            placeholder.addEventListener("dragend", handleDragEnd);
            list.insertBefore(placeholder, list.firstChild);
        }
        else if (list.querySelectorAll('.todo-item').length === 1 && placeholder) { //◇●
        list.appendChild(placeholder); //◇●
    }
    }

    function handlePlaceholderDragStart(e) { //●▷
        e.preventDefault(); //●▷
    } //●▷

    function handleDragStart(e) {
        draggedItem = this.closest(".todo-item");
        dragging = true;
        setTimeout(() => {
            draggedItem.style.display = 'none';
        }, 0);
    }

   
function handlePlaceholderDragStart(e) {
    if (this.classList.contains('placeholder')) {
        e.preventDefault();
        console.log('Drag prevented for placeholder'); // 로그 추가
    }
} //A 수정

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
        targetList.insertBefore(targetList.querySelector(".placeholder"), targetList.firstChild); //●▷

    if (draggedItem.classList.contains('placeholder')) { // claude 추가
        return; // claude 추가
    } // claude 추가
        
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
        const originalIndex = Array.from(list.children).indexOf(li); // CLAUDE 추가
        list.removeChild(li);
        const deletedItem = createTodoItem(li.querySelector('.text').textContent, list, true, li.querySelector('.checkbox').checked, elapsed);
        deletedItem.dataset.originalList = list.id;
        deletedItem.dataset.originalIndex = originalIndex; // CLAUDE 추가
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
        alert("《Simple ToDo-List 간단 사용법》\n\n- 리스트 작성 후 ENTER를 치면 'A'로 갑니다.\n- SHIFT+ENTER를 치면 'B'로 갑니다.\n- Title에 들어가는 내용은 작성 후 액션(ex. 체크리스트 on, off) 1개 이상을 취해야 저장(local storage)됩니다.\n\n- 페이지 초기화를 원하시는 경우 화면 우측 상단의 🔄을 눌러 주세요.\n\n♥ ToDo-List 페이지가 유용하다고 생각되시면\n    친구ㆍ지인들에게 많이 공유해 주세요. ~ ^_^");
    });

    cpalinkButton.addEventListener("click", () => {
        window.open("https://iryan.kr/t7rbs8lqau", "_blank");
    });

    clearButton.addEventListener("click", () => {
    const isConfirmed = confirm('해당 페이지에 작성한 내용을 모두 "초기화" 하시겠습니까?\nDo you want to "Reset" everything you write on that page?');
    if (isConfirmed) {
        localStorage.clear();
        location.reload();
    }
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
        console.log('Saving to localStorage:', JSON.stringify(data, null, 2));
        localStorage.setItem('todoData', JSON.stringify(data));
    }

    function loadFromLocalStorage() {
        const data = JSON.parse(localStorage.getItem('todoData'));
        if (data) {
            // 클로드-추가: 로드된 데이터 로깅
        console.log('Loading from localStorage:', JSON.stringify(data, null, 2));
            console.log('Loading from localStorage:', data); // 디버깅용 로그
            titleInput.value = data.title;
            deserializeList(todoListA, data.listA, data.placeholderTextA);
            deserializeList(todoListB, data.listB, data.placeholderTextB);
            deserializeList(deletedList, data.deleted);
        }
    }

    function serializeList(list) {
        return Array.from(list.querySelectorAll('.todo-item')).filter(item => !item.classList.contains('placeholder')).map((item, index) => ({ // 클로드 수정
            text: item.querySelector('.text') ? item.querySelector('.text').textContent : '',
            completed: item.querySelector('.checkbox') ? item.querySelector('.checkbox').checked : false,
            elapsedTime: item.querySelector('.timer-display') ? parseTime(item.querySelector('.timer-display').textContent) : 0,
            isDeleted: item.closest('#deleted-list') ? true : false,
            originalIndex: item.dataset.originalIndex ? parseInt(item.dataset.originalIndex) : index,
            originalList: item.dataset.originalList || list.id  // 클로드-수정: 원래 리스트 ID 유지
        }));
    }

function deserializeList(list, items, placeholderText) {
    list.innerHTML = '';
    let placeholder;  // CLAUDE 추가: placeholder 변수를 여기서 선언
    
    if (list.id !== 'deleted-list') { // CLAUDE 추가
    placeholder = document.createElement("li");  // CLAUDE 수정: const를 let으로 변경
    placeholder.className = "todo-item placeholder";
    placeholder.textContent = placeholderText;
    placeholder.setAttribute("draggable", "true");
    placeholder.addEventListener("dragstart", (e) => {
        e.preventDefault();
        console.log('Drag prevented for placeholder');
    }); // claude 수정
    placeholder.addEventListener("dragover", handleDragOver);
    placeholder.addEventListener("drop", handleDrop);
    placeholder.addEventListener("dragend", handleDragEnd);        
    placeholder.addEventListener("dragstart", (e) => e.preventDefault()); //B 수정
    list.appendChild(placeholder);

        // CLAUDE 추가: 항목이 없을 때만 플레이스홀더 추가
        if (items.length === 0) {
            list.appendChild(placeholder);
        }
    } // CLAUDE 추가

    const sortedItems = items.sort((a, b) => a.originalIndex - b.originalIndex); // 클로드 추가
    
    sortedItems.forEach(({ text, completed, elapsedTime, isDeleted, originalList, originalIndex }) => { // 클로드 추가
        console.log('Deserializing item:', { text, completed, elapsedTime, isDeleted, originalList, originalIndex }); // 클로드 추가
        const targetList = document.getElementById(originalList); // 클로드 추가
        const item = createTodoItem(text, targetList, isDeleted, completed, elapsedTime);
        if (isDeleted) {
            item.dataset.originalList = originalList; // CLAUDE 추가
            item.dataset.originalIndex = originalIndex; // CLAUDE 추가
            deletedList.appendChild(item);
        } else {
            const insertIndex = Math.min(originalIndex, targetList.children.length); // CLAUDE 추가
            targetList.insertBefore(item, targetList.children[insertIndex]); // CLAUDE 수정
        }
    });
    updateTodoNumbers(list);
if (list.id !== 'deleted-list' && placeholder && items.length > 0) {
    list.insertBefore(placeholder, list.firstChild);
}
// CLAUDE 추가: 삭제된 리스트에 대해서는 checkEmptyPlaceholder를 호출하지 않음
    if (list.id !== 'deleted-list') {
        checkEmptyPlaceholder(list);
    }

    
}

    function parseTime(timeString) {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        return (hours * 3600 + minutes * 60 + seconds) * 1000;
    }
});



// 방문자 카운트 -- 시작
// IP 주소 가져오기
console.log("Fetching IP...");
fetch('https://ipapi.co/json/')
    .then(response => response.json())
    .then(data => {
        console.log("IP Fetched: ", data.ip);
        const myIP = data.ip; // 현재 IP 주소 가져오기

        // 오늘 날짜 가져오기 (YYYY-MM-DD 형식)
        const today = new Date().toISOString().split('T')[0];
        console.log("Today: ", today);

        // 로컬 스토리지에서 방문 기록 가져오기
        let visitData = JSON.parse(localStorage.getItem('visitData')) || {};
        console.log("Visit Data: ", visitData);

        // 총 누적 방문자 수 가져오기
        let totalVisitCount = localStorage.getItem('totalVisitCount') || 0;
        console.log("Total Visit Count: ", totalVisitCount);

        // 오늘 날짜에 해당하는 방문자 수 가져오기
        let todayVisitCount = visitData[today] || 0;
        console.log("Today's Visit Count: ", todayVisitCount);

        // IP 주소 가져오기 (다시 방문 IP 확인)
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                console.log("Visitor IP Fetched: ", data.ip);
                const visitorIP = data.ip;

                // 자신의 IP와 방문자의 IP가 다를 경우에만 카운트 증가
                if (visitorIP !== myIP) {
                    console.log("Visitor IP is different from My IP.");
                    // 방문자 수 증가
                    todayVisitCount++;
                    totalVisitCount++;

                    // 방문 기록 업데이트
                    visitData[today] = todayVisitCount;

                    // 9일보다 오래된 데이터 삭제
                    const dates = Object.keys(visitData);
                    if (dates.length > 10) { // 10일간의 데이터 유지 (오늘 포함)
                        delete visitData[dates[0]];
                    }

                    // 로컬 스토리지에 업데이트된 방문 기록 저장
                    localStorage.setItem('visitData', JSON.stringify(visitData));
                    localStorage.setItem('totalVisitCount', totalVisitCount);

                    // 지난 9일간의 방문자 수 계산
                    let last9DaysCount = 0;
                    for (let i = dates.length - 1; i >= 0 && i >= dates.length - 9; i--) {
                        last9DaysCount += visitData[dates[i]];
                    }

                    // 콘솔에 결과 출력
                    console.log(`오늘의 방문자 수: ${todayVisitCount}`);
                    console.log(`지난 9일간의 방문자 수: ${last9DaysCount}`);
                    console.log(`총 누적 방문자 수: ${totalVisitCount}`);
                } else {
                    console.log("자신의 IP 방문은 카운트하지 않습니다.");
                }
            })
            .catch(error => {
                console.error('Error fetching visitor IP:', error);
            });
    })
    .catch(error => {
        console.error('Error fetching my IP:', error);
    });

// 방문자 카운트 -- 끝
