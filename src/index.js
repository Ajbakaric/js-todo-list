
// src/index.js
import './style.css';


import { format } from 'date-fns';

class ToDoItem {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
  }
}

class Project {
  constructor(name) {
    this.name = name;
    this.todos = [];
  }

  addTodo(todo) {
    this.todos.push(todo);
    this.updateLocalStorage();
  }

  removeTodo(index) {
    this.todos.splice(index, 1);
    this.updateLocalStorage();
  }

  updateLocalStorage() {
    localStorage.setItem('projects', JSON.stringify(projects));
  }

  static loadFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem('projects')) || [];
    return data.map(projectData => {
      const project = new Project(projectData.name);
      project.todos = projectData.todos.map(todoData => new ToDoItem(todoData.title, todoData.description, todoData.dueDate, todoData.priority));
      return project;
    });
  }
}

let projects = Project.loadFromLocalStorage();
if (projects.length === 0) {
  projects.push(new Project('Default Project'));
}

function renderProjects() {
  const projectList = document.getElementById('project-list');
  projectList.innerHTML = '';
  projects.forEach((project, index) => {
    const projectDiv = document.createElement('div');
    projectDiv.textContent = project.name;
    projectDiv.addEventListener('click', () => renderToDos(index));
    projectList.appendChild(projectDiv);
  });
}

function renderToDos(projectIndex) {
  const todoList = document.getElementById('todo-list');
  todoList.innerHTML = '';
  const project = projects[projectIndex];
  project.todos.forEach((todo, index) => {
    const todoDiv = document.createElement('div');
    todoDiv.className = `${todo.priority}-priority`;
    todoDiv.innerHTML = `
      <span>${todo.title} - Due: ${format(new Date(todo.dueDate), 'MMM dd, yyyy')}</span>
      <button class="delete-btn">Delete</button>
      <button class="edit-btn">Edit</button>
    `;
    todoDiv.querySelector('.delete-btn').addEventListener('click', () => {
      project.removeTodo(index);
      renderToDos(projectIndex);
    });
    todoDiv.querySelector('.edit-btn').addEventListener('click', () => openEditModal(todo, project, projectIndex, index));
    todoList.appendChild(todoDiv);
  });
}

function openEditModal(todo, project, projectIndex, todoIndex) {
  const modal = document.getElementById('todo-details-modal');
  modal.classList.remove('hidden');
  document.getElementById('edit-title').value = todo.title;
  document.getElementById('edit-description').value = todo.description;
  document.getElementById('edit-due-date').value = todo.dueDate;
  document.getElementById('edit-priority').value = todo.priority;

  document.getElementById('save-edit-btn').onclick = () => {
    todo.title = document.getElementById('edit-title').value;
    todo.description = document.getElementById('edit-description').value;
    todo.dueDate = document.getElementById('edit-due-date').value;
    todo.priority = document.getElementById('edit-priority').value;
    project.updateLocalStorage();
    renderToDos(projectIndex);
    closeModal();
  };
}

function closeModal() {
  const modal = document.getElementById('todo-details-modal');
  modal.classList.add('hidden');
}

document.querySelector('.close-btn').addEventListener('click', closeModal);

document.getElementById('todo-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('todo-title').value;
  const description = document.getElementById('todo-description').value;
  const dueDate = document.getElementById('todo-due-date').value;
  const priority = document.getElementById('todo-priority').value;
  const todo = new ToDoItem(title, description, dueDate, priority);
  projects[0].addTodo(todo);
  renderToDos(0);
  document.getElementById('todo-form').reset();
});

renderProjects();
renderToDos(0);
