document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const taskIdInput = document.getElementById('taskId');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const dueDateInput = document.getElementById('dueDate');
  
    const apiUrl = 'http://localhost:5000/tasks';
  
    // Fetch all tasks
    const fetchTasks = async () => {
      const response = await fetch(apiUrl);
      const tasks = await response.json();
      taskList.innerHTML = tasks.map(task => `
        <li>
          <strong>${task.title}</strong> (Due: ${new Date(task.dueDate).toLocaleDateString()})
          <p>${task.description}</p>
          <button onclick="editTask('${task._id}')">Edit</button>
          <span onclick="deleteTask('${task._id}')">Delete</span>
        </li>
      `).join('');
    };
  
    // Create or update task
    taskForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const task = {
        title: titleInput.value,
        description: descriptionInput.value,
        dueDate: dueDateInput.value,
      };
  
      let method = 'POST';
      let url = apiUrl;
      if (taskIdInput.value) {
        method = 'PUT';
        url = `${apiUrl}/${taskIdInput.value}`;
      }
  
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
  
      taskIdInput.value = '';
      taskForm.reset();
      fetchTasks();
    });
  
    // Edit task
    window.editTask = async (id) => {
      const response = await fetch(`${apiUrl}/${id}`);
      const task = await response.json();
      taskIdInput.value = task._id;
      titleInput.value = task.title;
      descriptionInput.value = task.description;
      dueDateInput.value = task.dueDate.split('T')[0];
    };
  
    // Delete task
    window.deleteTask = async (id) => {
      await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      fetchTasks();
    };
  
    fetchTasks();
  });
  