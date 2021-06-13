// Task class: Represents a task or to-do
class Task {
    constructor (task, time, date) {
    this.task = task;
    this.time = time;
    this.date = date;
    }
}

// UI 
class UI {
    static displayTodo() {
        const toDo = Mem.getTasks();

        toDo.forEach((tasks) => UI.addTasktoList(tasks));
    }

    static addTasktoList(tasks) {
        const list = document.querySelector("#task-list");

        const buildRow = document.createElement('tr');
        buildRow.innerHTML = `
            <td>${tasks.task}</td>
            <td>${tasks.time}</td>
            <td>${tasks.date}</td>
            <td><a href='#' class='btn btn-danger btn-sm delete'>X</a></td> 
            `;

            list.appendChild(buildRow);
    }

    static deleteTask(element) {
        if(element.classList.contains('delet')) {
            element.parentElements.parentElement.remove();
        }
    }

    static displayAlert(msg, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(msg));
        const container = document.querySelector('.container');
        const form = document.querySelector('#task-form');
        container.insertBefore(div,form);

        //vanish in 3 secs
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
    static clearFields() {
        document.querySelector('#task').value = '';
        document.querySelector('#time').value = '';
        document.querySelector('#date').value = '';
    }
}

// Mem Class: Handles Storage

class Mem {
    static getTasks() {
        let toDo;
        if(localStorage.getItem('toDo') === null){
            toDo = [];
        }
        else {
            toDo = JSON.parse(localStorage.getItem('toDo')); // this will store task into a string and 
        }
        return toDo;
    }
    static addTask(tasks) {
        const toDo = Mem.getTasks();
        toDo.push(tasks); // add on to tasks
        localStorage.setItem('toDo', JSON.stringify(toDo)); // this is an array of objects that we wrap in json.stringify
    }

    static removeTask(date){
        const toDo = Mem.getTasks();

        toDo.forEach((tasks, index) => {
            if(tasks.date === date){
                toDo.splice(index, 1);
            }
        });
        
        localStorage.setItem('toDo', JSON.stringify(toDo));
    }
}

// Event: Display Tasks
document.addEventListener('DOMContentLoaded', UI.displayTodo);

// Event: Add Task
document.querySelector('#task-form').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const task = document.querySelector('#task').value;
    const time = document.querySelector('#time').value;
    const date = document.querySelector('#date').value;

    // Validate
    if(task === '' || time === '' || date === '') {
        UI.displayAlert('Please fill in all fields', 'danger');
    }
    else {
        // Instantiate tasks
        const tasks = new Task(task, time, date);

        // Add task to UI
        UI.addTasktoList(tasks);

        // Add tasks to memory
        Mem.addTask(tasks);

        UI.displayAlert('Task Added', 'success');

        // Clear user input fields
        UI.clearFields();
    }
});

// Event: Remove a task
document.querySelector('#task-list').addEventListener('click',  (e) => {

    // remove task from UI
    UI.deleteTask(e.target);

    // remove task from memory
    Mem.removeTask(e.target.parentElement.previousElementSibling.textContent);

    UI.displayAlert('Task Removed', 'success')
});

