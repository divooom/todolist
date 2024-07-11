document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('todo-input');
    const addButton = document.getElementById('add-button');
    const todoList = document.getElementById('todo-list');
    const showDeletedButton = document.getElementById('show-deleted');
    const deletedTodos = document.getElementById('deleted-todos');
    const deletedList = document.getElementById('deleted-list');
    let deletedItems = [];

    console.log("JavaScript file loaded successfully");

    function addTodoItem() {
        const todoText = input.value.trim();
        if (todoText === '') return;

        const todoItem = document.createElement('li');
        todoItem.className = 'todo-item';

        const dragIcon = document.createElement('span');
        dragIcon.className = 'drag-icon';
        dragIcon.innerHTML = '&#9776;';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                todoItem.classList.add('checked');
            } else {
                todoItem.classList.remove('checked');
            }
        });

        const text = document.createElement('span');
        text.className = 'text';
        text.textContent = todoText;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.innerHTML = '&#128465;';
        deleteButton.addEventListener('click', () => {
            todoItem.remove();
            deletedItems.push(todoItem);
        });

        todoItem.appendChild(dragIcon);
        todoItem.appendChild(checkbox);
        todoItem.appendChild(text);
        todoItem.appendChild(deleteButton);

        todoList.appendChild(todoItem);
        input.value = '';
    }

    addButton.addEventListener('click', addTodoItem);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodoItem();
        }
    });

    showDeletedButton.addEventListener('click', () => {
        if (deletedTodos.style.display === 'none') {
            deletedTodos.style.display = 'block';
            deletedList.innerHTML = '';
            deletedItems.forEach(item => {
                const restoreButton = document.createElement('button');
                restoreButton.textContent = 'Restore';
                restoreButton.addEventListener('click', () => {
                    todoList.appendChild(item);
                    item.removeChild(item.lastChild);
                    deletedItems = deletedItems.filter(i => i !== item);
                });
                item.appendChild(restoreButton);
                deletedList.appendChild(item);
            });
        } else {
            deletedTodos.style.display = 'none';
        }
    });
});
