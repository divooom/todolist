document.getElementById('new-todo').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const task = e.target.value;
        if (task) {
            const li = document.createElement('li');

            // 체크박스 생성
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.style.marginRight = '10px'; // 체크박스와 텍스트 사이의 간격 조정
            checkbox.addEventListener('change', function () {
                if (checkbox.checked) {
                    li.classList.add('completed');
                } else {
                    li.classList.remove('completed');
                }
            });

            // 텍스트 노드 생성
            const taskText = document.createElement('span');
            taskText.textContent = task;

            // 삭제 버튼 생성
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '&#10060;';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', function () {
                li.remove();
            });

            // li에 요소 추가
            li.appendChild(checkbox); // 체크박스를 맨 앞에 추가
            li.appendChild(taskText);
            li.appendChild(deleteBtn);

            document.getElementById('todo-list').appendChild(li);
            e.target.value = '';
        }
    }
});
