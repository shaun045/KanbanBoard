
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
let draggedTaskId = null;






/* ------------------------------------> THIS IS FOR GETTING TASK INFORMATION <------------------------------------ */
const taskTitle = document.querySelector(".modal-title-input input");
const taskDescription = document.querySelector(".modal-description-container textarea");
const taskComment = document.querySelector(".modal-comment-display");
const taskDateModal = document.querySelector(".modal-date-display");
const taskStatus = document.querySelector(".modal-flag-review");




function getTaskInformation() {
  return {
    title: taskTitle.value.trim(),
    description: taskDescription.value.trim(),
    comment: 0,
    date: selectedDate,
    status: "none",
    id: Date.now()
  };
}


function renderTask(taskData) {
  const newTask = document.createElement('li');

  newTask.innerHTML = `
    <div class="task-wrapper">
        <div class="urgent-banner"></div>
          <div class="task-container" data-id="${taskData.id}" draggable="true">
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

    </div>
  `;

  todoTaskList.appendChild(newTask);

  const taskContainer = newTask.querySelector('.task-container');
  taskContainer.classList.add('open');

  setTimeout(() => {
    taskContainer.classList.remove('open');
  }, 300);
}




/* ------------------------------------>THIS IS FOR ADDING NEW TASK<------------------------------------ */
addNewTask.addEventListener('click', () => {
  taskTitle.value = "Task Title";
  taskDescription.value = "Task Description";
  selectedDate = "No Date";
  const taskData = getTaskInformation();
  tasks.todo.push(taskData);
  renderTask(taskData);
  updateCounts();
  console.log(tasks);
})


/* ------------------------------------>THIS IS FOR OPENING MODAL<------------------------------------ */
const editIcon = document.querySelector(".modal-edit-title-input i");

progressionTaskLists.forEach(list => {
  list.addEventListener('click', (e) => {
    const clickedTask = e.target.closest(".task-container");
    const isDeleteBtn = e.target.closest(".task-title i");
    const urgencyBannerFlag = e.target.closest(".task-status i");

      if (clickedTask && !isDeleteBtn && !urgencyBannerFlag) {
        currentTaskId = Number(clickedTask.dataset.id);

        const allTasks = [...tasks.todo, ...tasks.doing, ...tasks.done];
        const existingTask = allTasks.find(task => task.id === currentTaskId);

        taskTitle.value = existingTask.title;
        taskDescription.value = existingTask.description;
        document.getElementById('date-text').textContent = existingTask.date;
        selectedDate = existingTask.date;

        kanbanModal.classList.add("open");
        taskTitle.setAttribute("readonly", true);
        taskDescription.setAttribute("readonly", true);
      };
    });
});


editIcon.addEventListener('click', () => {
  taskTitle.removeAttribute("readonly");
  taskDescription.removeAttribute("readonly");
  taskTitle.focus();
  editIcon.classList.add("open");
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
    existingTask.date = selectedDate;

    taskCard.querySelector('h3').textContent = taskData.title;
    taskCard.querySelector('.task-description p').textContent = taskData.description;
    taskCard.querySelector('.task-date span').textContent = taskData.date;
  }

  editIcon.classList.remove("open");
  kanbanModal.classList.remove("open");
  console.log(tasks);
})



/* THIS IS FOR DATE INPUT */
let selectedDate = "No Date";
const dateInput = flatpickr("#task-date", {
  dateFormat: "Y-m-d",
  onChange: function(selectedDates, dateStr, instance) {
    const date = selectedDates[0];
    const options = { month: "short", day: "numeric"};
    const formatted = date.toLocaleDateString("en-US", options);


    document.getElementById("date-text").textContent = formatted;
    selectedDate = formatted;
  }
});


const dateDisplayPick = document.querySelector(".modal-date-display");
dateDisplayPick.addEventListener('click', () => {
  dateInput.open();
})



/* ------------------------------------>THIS IS FOR PROGRESSION LIST COUNT<------------------------------------ */
const progressionCount = document.querySelectorAll(".progression-count");
const progressionCountTodo = document.querySelector(".progression-count-todo");
const progressionCountDoing = document.querySelector(".progression-count-doing");
const progressionCountDone = document.querySelector(".progression-count-done");


function updateCounts() {
  progressionCountTodo.textContent = tasks.todo.length;
  progressionCountDoing.textContent = tasks.doing.length;
  progressionCountDone.textContent = tasks.done.length;
}



/* ------------------------------------> THIS IS FOR DELETING TASK ITEMS <------------------------------------*/


progressionTaskLists.forEach(list => {
  list.addEventListener('click', (e) => {
    const deleteTaskButton = e.target.closest(".task-title i");

    if (!deleteTaskButton) return;

    const taskCard = e.target.closest(".task-container");
    const taskId = Number(taskCard.dataset.id);

    tasks.todo = tasks.todo.filter(task => task.id !== taskId);
    tasks.doing = tasks.doing.filter(task => task.id !== taskId);
    tasks.done = tasks.done.filter(task => task.id !== taskId);

    updateCounts();
    taskCard.remove();
    console.log(tasks);
  })
})



/* ------------------------------------> THIS IS FOR DRAG AND DROP FEATURE<------------------------------------*/
progressionTaskLists.forEach(list => {
  list.addEventListener('dragstart', (e) => {
    const clickedTaskWrapper = e.target.closest(".task-wrapper");
    const clickedTaskCard = e.target.closest(".task-container");
    const clickedTaskCardId = Number(clickedTaskCard.dataset.id);

    if (!clickedTaskCard) return;

    draggedTaskId = clickedTaskCardId;

    e.dataTransfer.setDragImage(clickedTaskCard, 0, 0);
    clickedTaskWrapper.classList.add("dragging");
  })
})


progressionTaskLists.forEach(list => {
  list.addEventListener('dragover', (e) => {
    e.preventDefault();
  })
})

progressionTaskLists.forEach(list => {
  list.addEventListener('drop', (e) => {
    e.preventDefault();
    const targetColumn = list.dataset.column;

    const allTasks = [...tasks.todo, ...tasks.doing, ...tasks.done];
    const draggedTaskCard = allTasks.find(task => task.id === draggedTaskId);

    if (!draggedTaskCard) return;

    for (let column in tasks) {
      tasks[column] = tasks[column].filter(task => task.id !== draggedTaskId)
    };
    
    tasks[targetColumn].push(draggedTaskCard);


    const taskElement = document.querySelector(`[data-id="${draggedTaskId}"]`);
    const taskWrapper = taskElement.closest(".task-wrapper");
    taskElement.classList.remove("todo", "doing", "done");
    taskElement.classList.add(targetColumn);
    list.appendChild(taskWrapper);
    taskWrapper.classList.add("dropped");
    setTimeout(() => {
      taskWrapper.classList.remove("dropped");
    }, 300);
    updateCounts();
  });
});


progressionTaskLists.forEach(list => {
  list.addEventListener("dragend", (e) => {
    const clickedTaskWrapper = e.target.closest(".task-wrapper");
    const taskCard = e.target.closest(".task-container");
    if (!taskCard) return;

    clickedTaskWrapper.classList.remove("dragging");
  });
});



/* ------------------------------------> THIS IS FOR STATUS FLAG/BANNER<------------------------------------*/
// const taskStatusFlag = document.querySelector(".task-status i");


progressionTaskLists.forEach(list => {
  list.addEventListener('click', (e) => {
    const urgencyBannerFlag = e.target.closest(".task-status i");

    if (!urgencyBannerFlag) return;

    const taskWrapper = e.target.closest(".task-wrapper")
    const taskCard = e.target.closest(".task-container");
    const bannerFlag = taskWrapper.querySelector(".urgent-banner")
    const taskId = Number(taskCard.dataset.id);


    taskWrapper.classList.toggle("urgent");
    bannerFlag.classList.toggle("open");
    urgencyBannerFlag.classList.toggle("open");
  })
})



