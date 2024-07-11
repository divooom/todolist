document.getElementById('new-todo').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const task = e.target.value;
        if (task) {
            const li = document.createElement('li');
            li.textContent = task;
            document.getElementById('todo-list').appendChild(li);
            e.target.value = '';
        }
    }
});