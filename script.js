let todoListA, todoListB, deletedList; // ★ 전역 변수 선언

document.addEventListener("DOMContentLoaded", () => {

    console.log("DOM fully loaded and parsed"); // 콘솔 로그 추가
    
    const todoInput = document.getElementById("todo-input");
    const addABtn = document.getElementById("add-a-btn");
    const addBBtn = document.getElementById("add-b-btn");
    todoListA = document.getElementById("todo-list-a"); // ★ 변수 초기화
    todoListB = document.getElementById("todo-list-b"); // ★ 변수 초기화
    const showDeletedBtn = document.getElementById("show-deleted-btn");
    deletedList = document.getElementById("deleted-list"); // ★ 변수 초기화
    const topButton = document.getElementById("top-button");
    const descriptionButton = document.getElementById("description-button");
    const cpalinkButton = document.getElementById("cpalink-button");
    const titleInput = document.getElementById("title-input"); // ★ 타이틀 입력 필드 추가

    console.log(todoInput, addABtn, addBBtn, todoListA, todoListB, showDeletedBtn, deletedList); // 콘솔 로그 추가

    let currentList = todoListA; // 기본적으로 A 목록에 추가되도록 설정
    let draggedItem = null;
    let dragging = false;

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
            saveTodos(); // 추가
        }
    }

     function createTodoItem(text, list, isDeleted = false, isCompleted = false, initialElapsedTime = 0) { // ★ 변수 이름 변경
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

        // 콘솔 로그 추가
console.log('number element:', number);

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
            saveTodos(); // 추가
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


 // 스탑워치 기능 추가 시작
    const stopwatchContainer = document.createElement("div"); // 스탑워치 컨테이너 생성
    stopwatchContainer.className = "stopwatch-container"; // 클래스 설정

    const playPauseButton = document.createElement("button"); // 재생/일시정지 버튼 생성
    playPauseButton.className = "stopwatch-btn play-pause-btn"; // 클래스 설정
    playPauseButton.innerHTML = "▶️"; // 버튼 텍스트 설정
    playPauseButton.addEventListener("click", toggleStopwatch); // 클릭 이벤트 설정

    const resetButton = document.createElement("button"); // 리셋 버튼 생성
    resetButton.className = "stopwatch-btn reset-btn"; // 클래스 설정
    resetButton.innerHTML = "&#x21bb;"; // 리셋 아이콘 (🔄)
    resetButton.addEventListener("click", resetStopwatch); // 클릭 이벤트 설정

    const timerDisplay = document.createElement("span"); // 시계 표시 요소 생성
    timerDisplay.className = "timer-display"; // 클래스 설정
    timerDisplay.textContent = formatTime(elapsedTime); // ★ 초기 시계 텍스트 설정
    timerDisplay.setAttribute("data-time", elapsedTime); // ★ 데이터 속성으로 경과 시간 설정

    stopwatchContainer.appendChild(playPauseButton); // 컨테이너에 재생/일시정지 버튼 추가
    stopwatchContainer.appendChild(timerDisplay); // 컨테이너에 시계 표시 추가
    stopwatchContainer.appendChild(resetButton); // 컨테이너에 리셋 버튼 추가

    let stopwatchInterval; // 스탑워치 인터벌 변수
    let running = false; // 스탑워치 실행 여부
    let startTime, elapsedTime = 0; // 시작 시간과 경과 시간 변수

    function toggleStopwatch() { // 스탑워치 재생/일시정지 함수
        if (running) {
            clearInterval(stopwatchInterval); // 실행 중이면 인터벌 해제
            running = false; // 실행 상태 false
            playPauseButton.innerHTML = "▶️"; // 버튼 텍스트 변경
            timerDisplay.style.backgroundColor = "#797979"; // 멈춤 상태 배경 색상 수정
            timerDisplay.style.border = "none"; // 테두리 제거
            timerDisplay.setAttribute("data-time", elapsedTime); // ★ 경과 시간 저장
            saveTodos(); // ★ 추가
        } else {
            startTime = Date.now() - elapsedTime; // 시작 시간 설정
            stopwatchInterval = setInterval(() => {
                elapsedTime = Date.now() - startTime; // 경과 시간 계산
                timerDisplay.textContent = formatTime(elapsedTime); // 시계 텍스트 업데이트
            }, 1000);
            running = true; // 실행 상태 true
            playPauseButton.innerHTML = "&#10074;&#10074;"; // 일시정지 아이콘 (⏸️)
            timerDisplay.style.backgroundColor = "white"; // 돌아가는 상태 배경 색상 유지
            timerDisplay.style.border = "5px solid #0074ff"; // 돌아가는 상태 테두리 설정
        }
    }

    function resetStopwatch() { // 스탑워치 리셋 함수
        clearInterval(stopwatchInterval); // 인터벌 해제
        running = false; // 실행 상태 false
        elapsedTime = 0; // 경과 시간 초기화
        timerDisplay.textContent = "00:00:00"; // 시계 텍스트 초기화
        timerDisplay.setAttribute("data-time", elapsedTime); // ★ 경과 시간 저장
        playPauseButton.innerHTML = "▶️"; // 버튼 텍스트 변경
        timerDisplay.style.backgroundColor = "#797979"; // 리셋 후 배경 색상 수정
        timerDisplay.style.border = "none"; // 테두리 제거
        saveTodos(); // ★ 추가
    }

    function formatTime(ms) { // 시간 포맷 함수
        const totalSeconds = Math.floor(ms / 1000); // 총 초 계산
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0'); // 시간 계산
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0'); // 분 계산
        const seconds = String(totalSeconds % 60).padStart(2, '0'); // 초 계산
        return `${hours}:${minutes}:${seconds}`; // 포맷된 시간 반환
    }
    // 스탑워치 기능 추가 끝
        

        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.innerHTML = "&#9998;"; // 파란색 라인 아이콘
        editBtn.addEventListener("click", () => {
            const newText = prompt("Edit your todo:", span.textContent);
            if (newText !== null && newText.trim() !== "") {
                span.textContent = newText.trim();
                saveTodos(); // 추가
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
            li.appendChild(stopwatchContainer); // 스탑워치 컨테이너 추가
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
        }

    // 콘솔 로그 추가
    console.log('Added number element:', li);
        
        return li;
    }

function updateTodoNumbers(list) {
    const items = list.querySelectorAll('.todo-item');
    let actualIndex = 1; // 실제 항목의 번호를 매기기 위한 변수
    items.forEach((item) => {
        const number = item.querySelector('.todo-number');
        if (number) {
            if (item.classList.contains('placeholder')) {
                number.textContent = '0. ';
            } else {
                number.textContent = `${actualIndex}. `;
                actualIndex++; // 실제 항목에 대해서만 증가
            }
        }
    });
}

function checkEmptyPlaceholder(list) {
    let placeholder = list.querySelector(".placeholder");
    if (!placeholder) {
        placeholder = document.createElement("li");
        placeholder.className = "todo-item placeholder";
        placeholder.setAttribute("draggable", "true");

        // A와 B 목록에 따라 텍스트 설정
        placeholder.textContent = list.id === "todo-list-a" ? "A - List" : "B - List";

        placeholder.addEventListener("dragstart", handleDragStart);
        placeholder.addEventListener("dragover", handleDragOver);
        placeholder.addEventListener("drop", handleDrop);
        placeholder.addEventListener("dragend", handleDragEnd);
        list.insertBefore(placeholder, list.firstChild); // 항상 첫 번째 자식으로 추가
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
        updateTodoNumbers(todoListA); // 추가된 부분
        updateTodoNumbers(todoListB); // 추가된 부분
        checkEmptyPlaceholder(todoListA);
        checkEmptyPlaceholder(todoListB);

        const deleteBtn = draggedItem.querySelector('.delete-btn');
        deleteBtn.removeEventListener("click", handleDelete);
        deleteBtn.addEventListener('click', handleDelete);
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
        saveTodos(); // 추가
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

    topButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    descriptionButton.addEventListener("click", () => {
        alert("ToDo-List 간단 사용법:\n\n- 그냥 엔터를 치면 A로 갑니다.\n- SHIFT+ENTER를 치면 B로 갑니다.");
    });

    cpalinkButton.addEventListener("click", () => {
        window.open("https://iryan.kr/t7rbs8lqau", "_blank");
    });

    // 초기 빈 항목(플레이스홀더) 추가
    checkEmptyPlaceholder(todoListA);
    checkEmptyPlaceholder(todoListB);

    // 여기에 loadTodos() 함수 호출을 추가합니다
    loadTodos();

    // 타이틀 불러오기 ★ 타이틀 불러오기
if (localStorage.getItem('title')) {
    titleInput.value = localStorage.getItem('title');
}

// 타이틀 변경 시 저장 ★ 타이틀 저장
titleInput.addEventListener('input', () => {
    localStorage.setItem('title', titleInput.value);
});

});

// 맨 아래에 추가
function saveTodos() {
    console.log("saveTodos 함수 호출됨");
    const todoA = Array.from(todoListA.querySelectorAll('.todo-item:not(.placeholder)')).map(item => ({
        text: item.querySelector('.text').textContent,
        completed: item.querySelector('.checkbox').checked,
        elapsedTime: item.querySelector('.timer-display')?.getAttribute('data-time') || 0 // ★ 타이머 값 저장
    }));
    const todoB = Array.from(todoListB.querySelectorAll('.todo-item:not(.placeholder)')).map(item => ({
        text: item.querySelector('.text').textContent,
        completed: item.querySelector('.checkbox').checked,
        elapsedTime: item.querySelector('.timer-display')?.getAttribute('data-time') || 0 // ★ 타이머 값 저장
    }));
    const deletedItems = Array.from(deletedList.querySelectorAll('.todo-item')).map(item => ({
        text: item.querySelector('.text').textContent,
        completed: item.querySelector('.checkbox').checked,
        originalList: item.dataset.originalList
        elapsedTime: item.querySelector('.timer-display')?.getAttribute('data-time') || 0 // ★ 타이머 값 저장
    }));
    localStorage.setItem('todos', JSON.stringify({ todoA, todoB, deletedItems }));
}

function loadTodos() {
    console.log("loadTodos 함수 호출됨");
    const savedTodos = localStorage.getItem('todos');
    console.log("불러온 데이터:", savedTodos);
    if (savedTodos) {
        const { todoA, todoB, deletedItems } = JSON.parse(savedTodos);
        todoA.forEach(item => {
            const todoItem = createTodoItem(item.text, todoListA, false, item.completed, item.elapsedTime); // ★ 타이머 값 추가
            todoListA.appendChild(todoItem);
        });
        todoB.forEach(item => {
            const todoItem = createTodoItem(item.text, todoListB, false, item.completed, item.elapsedTime); // ★ 타이머 값 추가
            todoListB.appendChild(todoItem);
        });
        deletedItems.forEach(item => {
            const todoItem = createTodoItem(item.text, deletedList, true, item.completed, item.elapsedTime); // ★ 타이머 값 추가
            todoItem.dataset.originalList = item.originalList;
            deletedList.appendChild(todoItem);
        });
        updateTodoNumbers(todoListA);
        updateTodoNumbers(todoListB);
        checkEmptyPlaceholder(todoListA);
        checkEmptyPlaceholder(todoListB);
    }
}
