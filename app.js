// script.js
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

addBtn.addEventListener('click', () => {
    const todoText = todoInput.value.trim();
    if (todoText !== '') {
        const listItem = document.createElement('li');
        listItem.textContent = todoText;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '삭제';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => {
            listItem.remove();
        });

        listItem.appendChild(deleteBtn);
        todoList.appendChild(listItem);
        
        todoInput.value = '';
    }
});
