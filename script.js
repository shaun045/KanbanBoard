
/* ------------------------------------> KANBAN ENTIRE MODAL <------------------------------------ */
const kanbanModal = document.querySelector(".modal");



/* ------------------------------------> THIS IS FOR TASKS ITEMS <------------------------------------*/
const addNewTask = document.querySelector(".new-task-btn");
const todoTaskList = document.querySelector(".todo-progress-list ul");
const taskItems = document.querySelectorAll(".task-container");






/* ------------------------------------> THIS IS FOR TASKS LIST <------------------------------------ */
const allProgressionLists = document.querySelectorAll(".progression-list ul");




/* ------------------------------------> THIS IS FOR TASKS STORAGE <------------------------------------ */
let tasks = [];




addNewTask.addEventListener('click', () => {
  const newTask = document.createElement('li');

  newTask.innerHTML = `
      <div class="task-container">
        <div class="task-title">
          <h3>task title</h3>
          <i class="fa-solid fa-trash"></i>
        </div>
        
        <div class="line">
        </div>

        <div class="task-description">
          <p>description</p>
        </div>


        <div class="task-details">
          <div class="task-comment-date">
            <div class="task-comment">
              <i class="fa-regular fa-comment"></i>
              <p>0</p>
            </div>
            <div class="task-date">
              <i class="fa-regular fa-calendar"></i>
              <span>date</span>
            </div>
          </div>
          <div class="task-status">
            <i class="fa-regular fa-flag"></i>
          </div>
        </div>
      </div>
  `;

  const taskContainer = newTask.querySelector('.task-container');
  const modalCloseBtn = document.querySelector('.exit-button-container i');

  taskContainer.addEventListener('click', () => {
    kanbanModal.classList.add("open");
  })

  modalCloseBtn.addEventListener('click', () => {
    kanbanModal.classList.remove("open");
  })


  todoTaskList.appendChild(newTask);
})


/* ------------------------------------> THIS IS FOR DELETING TASK ITEMS <------------------------------------*/
// const deleteTaskButton = document.querySelectorAll(".task-title i");

// deleteTaskButton.forEach(deleteButton => {
//   deleteTaskButton.addEventListener('click', () => {
//     todoTaskList.remove(newTask);
//   })
// })

