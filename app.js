document.getElementById('new-todo').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const task = e.target.value;
        if (task) {
            const li = document.createElement('li');

            // 텍스트 노드 생성
            const taskText = document.createElement('span');
            taskText.textContent = task;
            taskText.style.flexGrow = '1';

           // 체크박스 생성
const checkbox = document.createElement('input');
checkbox.type = 'checkbox';
checkbox.classList.add('checkbox'); // 클래스 추가
checkbox.style.marginLeft = '10px'; // 기존 스타일 유지
checkbox.addEventListener('change', function () {
    if (checkbox.checked) {
        li.classList.add('completed');
    } else {
        li.classList.remove('completed');
    }
});


            // 삭제 버튼 생성
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '&#128465;'; // 쓰레기통 아이콘
            deleteBtn.className = 'delete-btn';
            deleteBtn.style.marginLeft = '10px';
            deleteBtn.addEventListener('click', function () {
                li.remove();
            });

            // li에 요소 추가
            li.appendChild(taskText); // 텍스트 추가
            li.appendChild(checkbox); // 체크박스 추가
            li.appendChild(deleteBtn); // 삭제 버튼 추가

            document.getElementById('todo-list').appendChild(li);
            e.target.value = ''; // 입력란 초기화
        }
    }
});
