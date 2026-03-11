
/* ------------------------------------> KANBAN ENTIRE MODAL <------------------------------------ */
const kanbanModal = document.querySelector(".modal");



/* ------------------------------------> THIS IS FOR TASKS ITEMS <------------------------------------*/
const addNewTask = document.querySelector(".new-task-btn");
const todoTaskList = document.querySelector(".todo-progress-list ul");
const progressionTaskLists = document.querySelectorAll(".progression-list");






/* ------------------------------------> THIS IS FOR TASKS LIST <------------------------------------ */
const allProgressionLists = document.querySelectorAll(".progression-list ul");




/* ------------------------------------> THIS IS FOR TASKS STORAGE <------------------------------------ */
let tasks = {
  todo: [],
  doing: [],
  done: []
};
let currentTaskId = null;





/* ------------------------------------> THIS IS FOR GETTING TASK INFORMATION <------------------------------------ */
const taskTitle = document.querySelector(".modal-title-input input");
const taskDescription = document.querySelector(".modal-description-container textarea");
const taskComment = document.querySelector(".modal-comment-display");
const taskDate = document.querySelector(".modal-date-display");
const taskStatus = document.querySelector(".modal-flag-review");




function getTaskInformation() {
  return {
    title: taskTitle.value.trim(),
    description: taskDescription.value.trim(),
    comment: 0,
    date: "No Date",
    status: "none",
    id: Date.now()
  };

}


function renderTask(taskData) {
  const newTask = document.createElement('li');

  newTask.innerHTML = `
      <div class="task-container" data-id="${taskData.id}">
        <div class="task-title">
          <h3>${taskData.title}</h3>
          <i class="fa-solid fa-trash"></i>
        </div>
        
        <div class="line">
        </div>

        <div class="task-description">
          <p>${taskData.description}</p>
        </div>


        <div class="task-details">
          <div class="task-comment-date">
            <div class="task-comment">
              <i class="fa-regular fa-comment"></i>
              <p>${taskData.comment}</p>
            </div>
            <div class="task-date">
              <i class="fa-regular fa-calendar"></i>
              <span>${taskData.date}</span>
            </div>
          </div>
          <div class="task-status">
            <i class="fa-regular fa-flag"></i>
          </div>
        </div>
      </div>
  `;

  todoTaskList.appendChild(newTask);
}

progressionTaskLists.forEach(list => {
  list.addEventListener('click', (e) => {
    const clickedTask = e.target.closest(".task-container");
      if (clickedTask) {
        currentTaskId = Number(clickedTask.dataset.id);

        const allTasks = [...tasks.todo, ...tasks.doing, ...tasks.done];
        const existingTask = allTasks.find(task => task.id === currentTaskId);

        taskTitle.value = existingTask.title;
        taskDescription.value = existingTask.description;

        kanbanModal.classList.add("open");
      };
    });
});


/* ------------------------------------>THIS IS FOR ADDING NEW TASK<------------------------------------ */
addNewTask.addEventListener('click', () => {
  const taskData = getTaskInformation();
  tasks.todo.push(taskData);
  renderTask(taskData);

})






/* ------------------------------------>THIS IS FOR CLOSING MODAL AND SAVING TASK<------------------------------------ */
const closeModalBtn = document.querySelector(".exit-button-container i");
closeModalBtn.addEventListener('click', () => {
  const taskData = getTaskInformation();

  const allTasks = [...tasks.todo, ...tasks.doing, ...tasks.done];
  const existingTask = allTasks.find(task => task.id === currentTaskId);
  const taskCard = document.querySelector(`[data-id="${currentTaskId}"]`);

  if (existingTask) {
    existingTask.title = taskData.title;
    existingTask.description = taskData.description;

    taskCard.querySelector('h3').textContent = taskData.title;
    taskCard.querySelector('.task-description p').textContent = taskData.description;
  }

  console.log(tasks);
  kanbanModal.classList.remove("open");
})








/* ------------------------------------> THIS IS FOR DELETING TASK ITEMS <------------------------------------*/
// const deleteTaskButton = document.querySelectorAll(".task-title i");


// allProgressionLists.addEventListener("click", (e) => {
//   const deleteTaskButton = e.target.closest(".task-title i");

//   if (!deleteTaskButton) return;

//   if (deleteTaskButton) {
//     const selectedTask = e.target.closest("li");

//     // const taskId = selectedTask.dataset.id;
//   }
// })
