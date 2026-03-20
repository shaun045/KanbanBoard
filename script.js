
/* ------------------------------------> KANBAN ENTIRE MODAL <------------------------------------ */
const kanbanModal = document.querySelector(".modal");



/* ------------------------------------> THIS IS FOR TASKS ITEMS <------------------------------------*/
const addNewTask = document.querySelector(".new-task-btn");
const todoTaskList = document.querySelector(".todo-progress-list ul");
const progressionTaskLists = document.querySelectorAll(".progression-list");



/* ------------------------------------> THIS IS FOR MASTER LIST <------------------------------------*/
const mainTab = document.querySelector(".main");
const masterListTab = document.querySelector(".master-list-container ul");
const addNewMasterTab = document.querySelector(".add-new-topic-btn button");
addNewMasterTab.addEventListener("click", () => {
  const uniqueId = "tab-" + Date.now();

  boards[uniqueId] = {
    name: "New Tab",
    todo: [],
    doing: [],
    done: []
  };

  saveToStorage();

  const newTab = document.createElement("li");
  newTab.innerHTML = `
  <i class="fa-solid fa-pen-to-square edit-btn"></i>
  <span class="tab-title">${boards[uniqueId].name || "New"}</span>
  <i class="fa-solid fa-trash delete-btn"></i>
  `;

  newTab.dataset.id = uniqueId;
  
  document.querySelector(".master-list-container ul").appendChild(newTab);
});



masterListTab.addEventListener('click', (e) => {
  const tab = e.target.closest("li");
  if (!tab) return;

  if (e.target.closest(".delete-btn")) {
  e.stopPropagation();
  handleDeleteTab(tab);
  return;
  }

  if (e.target.closest(".edit-btn") || e.target.closest(".fa-check")) {
    e.stopPropagation();
    toggleEditTab(tab);
  }

  const clickedTab = e.target.closest("li");

  if (!clickedTab) return;

  mainTab.classList.remove("hidden");

  document.querySelectorAll(".master-list-container li").forEach(tab => {
    tab.classList.remove("open");
  });

  clickedTab.classList.add("open");

  currentBoard = clickedTab.dataset.id;

  renderAllTasks();   
  updateCounts(); 
  
  requestAnimationFrame(() => {
    initChart();
    // updateMyChart();
  });
});


function renderMasterList() {
  const ul = document.querySelector(".master-list-container ul");
  ul.innerHTML = '';

  Object.keys(boards).forEach(boardId => {
    if (boardId === "default") return;

    const li = document.createElement("li");
    li.innerHTML = `
    <i class="fa-solid fa-pen-to-square edit-btn"></i>
    <span class="tab-title">${boards[boardId].name || "New Tab"}</span>
    <i class="fa-solid fa-trash delete-btn"></i>
    `;

    li.dataset.id = boardId;
    ul.appendChild(li);
  });

  mainTab.classList.add("hidden");

  renderAllTasks();
  updateCounts();
  updateMyChart();
}


/* ------------------------------------> THIS IS FOR EDIT MASTER TAB NAME<------------------------------------ */
function toggleEditTab(tab) {
  const editBtn = tab.querySelector(".edit-btn, .fa-check");
  const titleSpan = tab.querySelector(".tab-title");

  const input = tab.querySelector("input");

  if (!input) {
    const currentTitle = titleSpan.textContent;

    const inputEl = document.createElement("input");
    inputEl.value = currentTitle;
    inputEl.classList.add("tab-input");

    titleSpan.replaceWith(inputEl);

    editBtn.classList.remove("fa-pen-to-square");
    editBtn.classList.add("fa-check");

    inputEl.focus();

    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") toggleEditTab(tab);
      });
  } else {
    const newTitle = input.value.trim() || "New Tab";

    const span = document.createElement("span");
    span.classList.add("tab-title");
    span.textContent = newTitle;

    input.replaceWith(span);

    editBtn.classList.remove("fa-check");
    editBtn.classList.add("fa-pen-to-square");

    const tabId = tab.dataset.id;
    boards[tabId].name = newTitle;
    saveToStorage();
  }
}


function handleDeleteTab(tab) {
  const tabId = tab.dataset.id;

  if (tabId === "default") {
    alert("Cannot delete default tab");
    return;
  }

  if (!confirm("Delete this tab?")) return;

  delete boards[tabId];
  tab.remove();
  saveToStorage();

  handleAfterDelete(tabId);
}

function handleAfterDelete(deletedTabId) {
  if (currentBoard !== deletedTabId) return;

  const firstTab = document.querySelector(".master-list-container li");

  if (firstTab) {
    handleSwitchTab(firstTab);
  } else {
    mainTab.classList.add("hidden");
  }
}

function handleSwitchTab(tab) {
  document.querySelectorAll(".master-list-container li").forEach(t => {
    t.classList.remove("open");
  });

  tab.classList.add("open");

  currentBoard = tab.dataset.id;

  mainTab.classList.remove("hidden");

  renderAllTasks();
  updateCounts();

  requestAnimationFrame(() => {
    initChart();
  });
}






/* ------------------------------------> THIS IS FOR TASKS LIST <------------------------------------ */
const allProgressionLists = document.querySelectorAll(".progression-list ul");

/* ------------------------------------> THIS IS FOR CHART DATA<------------------------------------*/
function updateMyChart() {
  if (!window.myChart) return;

  window.myChart.data.datasets[0].data = [
    boards[currentBoard].todo.length,
    boards[currentBoard].doing.length,
    boards[currentBoard].done.length
  ];

  window.myChart.update();
}




/* ------------------------------------> THIS IS FOR TASKS STORAGE <------------------------------------ */
let boards = {
  default: {
    name: "Default",
    todo: [],
    doing: [],
    done: []
  }
};

let currentBoard = "default";

let currentTaskId = null;
let draggedTaskId = null;
let isUrgent = false;
let searchQuery = "";


let filterNoDate = false;
let filterNoTitle = false;
let filterNoDescription = false;
let filterUrgent = false;

try {
  const storedBoards = JSON.parse(localStorage.getItem("boards"));

  if (storedBoards) {
    boards = storedBoards;
  }
} catch (error) {
  console.error("Storage error", error)
}


function saveToStorage() {
  localStorage.setItem('boards', JSON.stringify(boards));
}



function getAllTasks() {
  return [...boards[currentBoard].todo, ...boards[currentBoard].doing, ...boards[currentBoard].done];
}


/* ------------------------------------> THIS IS FOR GETTING TASK INFORMATION <------------------------------------ */
const taskTitle = document.querySelector(".modal-title-input input");
const taskDescription = document.querySelector(".modal-description-container textarea");
const taskDateModal = document.querySelector(".modal-date-display");
const taskStatus = document.querySelector(".modal-flag-review");




function getTaskInformation() {
  return {
    title: taskTitle.value.trim(),
    description: taskDescription.value.trim(),
    comment: [],
    date: selectedDate,
    status: isUrgent,
    id: Date.now()
  };
}


function renderTask(taskData, column = "todo") {
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
                  <p>${taskData.comment.length}</p>
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

  const columnList = document.querySelector(`.${column}-progress-list ul`);
  columnList.appendChild(newTask);
  

  if (taskData.status === "urgent") {
    const taskWrapper = newTask.querySelector(".task-wrapper");
    const bannerFlag = newTask.querySelector(".urgent-banner");
    const flagIcon = newTask.querySelector(".task-status i");
    taskWrapper.classList.add("urgent");
    bannerFlag.classList.add("open");
    flagIcon.classList.add("open");
  }

  const taskContainer = newTask.querySelector('.task-container');
  taskContainer.classList.add('open');
  taskContainer.classList.add(column);

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
  boards[currentBoard].todo.push(taskData);
  saveToStorage();
  renderTask(taskData);
  updateCounts();
  updateTotalTaskCount();
  updateMyChart();
})



/* ------------------------------------>THIS IS FOR FILTER FUNCTION<------------------------------------ */
const filterButton = document.querySelector(".filter-btn");
const openFilterOptions = document.querySelector(".filter-options-container");

filterButton.addEventListener('click',() => {
  openFilterOptions.classList.toggle("open");
})



const filterSearchInput = document.querySelector(".search-task-title input");

filterSearchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value.toLowerCase().trim();
  filterTasks();
})

document.querySelector(".filter-no-dates input").addEventListener('change', (e) => {
  filterNoDate = e.target.checked;
  filterTasks();
})

document.querySelector(".filter-no-titles input").addEventListener('change', (e) => {
  filterNoTitle = e.target.checked;
  filterTasks();
})

document.querySelector(".filter-no-description input").addEventListener('change', (e) => {
  filterNoDescription = e.target.checked;
  filterTasks();
})

document.querySelector(".filter-urgent input").addEventListener('change', (e) => {
  filterUrgent = e.target.checked;
  filterTasks();
})


function filterTasks() {
  const allTaskCards = document.querySelectorAll(".task-container");

  allTaskCards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const date = card.querySelector(".task-date span").textContent;
    const description = card.querySelector(".task-description p").textContent;
    const isUrgent = card.closest(".task-wrapper").classList.contains("urgent");

    const matchesSearch = title.includes(searchQuery);
    const matchesNoDate = !filterNoDate || date === "No Date";
    const matchesNoTitle = !filterNoTitle || title === "task title";
    const matchesNoDescription = !filterNoDescription || description === "task description";
    const matchesUrgent = !filterUrgent || isUrgent;

    if (matchesSearch && matchesNoDate && matchesNoTitle && matchesNoDescription && matchesUrgent) {
      card.closest(".task-wrapper").style.display = "block";
    } else {
      card.closest(".task-wrapper").style.display = "none";
    }
  })
}










/* ------------------------------------>THIS IS FOR OPENING MODAL<------------------------------------ */
const editIcon = document.querySelector(".modal-edit-title-input i");

progressionTaskLists.forEach(list => {
  list.addEventListener('click', (e) => {
    const clickedTask = e.target.closest(".task-container");
    const isDeleteBtn = e.target.closest(".task-title i");
    const urgencyBannerFlag = e.target.closest(".task-status i");

      if (clickedTask && !isDeleteBtn && !urgencyBannerFlag) {
        currentTaskId = Number(clickedTask.dataset.id);

        const existingTask = getAllTasks().find(task => task.id === currentTaskId);

        taskTitle.value = existingTask.title;
        taskDescription.value = existingTask.description;
        document.getElementById('date-text').textContent = existingTask.date;
        selectedDate = existingTask.date;
        renderComments(existingTask.comment);
        updateCommentCounts();
        updateMyChart();

        kanbanModal.classList.add("open");
        taskTitle.setAttribute("readonly", true);
        taskDescription.setAttribute("readonly", true);
      };
    });
});

const modalComment = document.querySelector(".modal-comment-display");
modalComment.addEventListener('click', () => {
  toggleCommentSection();
})


editIcon.addEventListener('click', () => {
  taskTitle.removeAttribute("readonly");
  taskDescription.removeAttribute("readonly");
  taskTitle.focus();
  editIcon.classList.add("open");
})




const modalBackGroundContainer = document.querySelector(".modal-background-container");
const modalInsetContainer = document.querySelector(".modal-inset-container");
const modalCommentSection = document.querySelector(".comment-section");
const modalInputCommentContainer = document.querySelector(".comment-input-container");

const commentTaskBtn = document.querySelector(".modal-comment-display");




function toggleCommentSection() {
  modalBackGroundContainer.classList.toggle("expanded");
  modalCommentSection.classList.toggle("expanded");
}


function updateCommentCounts() {
  const numberOfCommentDisplay = document.querySelector(".modal-comment-display p");

  const existingTask = getAllTasks().find(task => task.id === currentTaskId);

  const commentCounts = Number(existingTask.comment.length);

  numberOfCommentDisplay.textContent = commentCounts;
}

const commentList = document.querySelector(".comment-ul");
function renderComments(comments) {
  commentList.innerHTML = '';

  comments.forEach(comment => {
    const li = document.createElement("li");
    li.dataset.id = comment.id
    li.innerHTML = `
      <div class="modal-comment-container">
        <div class="modal-comment-date-time">
          <div class="comment-date">
            <p>${comment.date}</p>
          </div>
          <div class="comment-time">
            <p>${comment.time}</p>
          </div>
        </div>
        <div class="modal-comment-content">
          <p>${comment.text}</p>
        </div>
        <div class="modal-comment-delete">
          <i class="fa-solid fa-trash"></i>
        </div>
      </div>
    `;
    commentList.appendChild(li);
  });
}



function createComment(text) {
  let now = new Date();
  return {
    date: now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    time: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    text: text,
    id: Date.now()
  }
}



const addModalComment = document.querySelector(".comment-input-container button");
const modalCommentInput = document.querySelector(".comment-input-container input");

addModalComment.addEventListener('click', () => {
  const commentText = modalCommentInput.value.trim();
  if (!commentText) return;

  const existingTask = getAllTasks().find(task => task.id === currentTaskId);

  const newComment = createComment(commentText);
  existingTask.comment.push(newComment);
  updateCommentCounts();
  saveToStorage();


  const taskCard = document.querySelector(`[data-id="${currentTaskId}"]`);
  taskCard.querySelector('.task-comment p').textContent = existingTask.comment.length;

  renderComments(existingTask.comment);
  modalCommentInput.value = '';
})








/* ------------------------------------>THIS IS FOR CLOSING MODAL AND SAVING TASK<------------------------------------ */
const closeModalBtn = document.querySelector(".exit-button-container i");
closeModalBtn.addEventListener('click', () => {
  const taskData = getTaskInformation();

  const existingTask = getAllTasks().find(task => task.id === currentTaskId);
  const taskCard = document.querySelector(`[data-id="${currentTaskId}"]`);

  if (existingTask) {
    existingTask.title = taskData.title;
    existingTask.description = taskData.description;
    existingTask.date = selectedDate;

    taskCard.querySelector('h3').textContent = taskData.title;
    taskCard.querySelector('.task-description p').textContent = taskData.description;
    taskCard.querySelector('.task-date span').textContent = taskData.date;

    saveToStorage();
  }
    
  modalBackGroundContainer.classList.remove("expanded");
  modalInsetContainer.classList.remove("expanded");
  modalCommentSection.classList.remove("expanded");

  kanbanModal.classList.remove("open");
  editIcon.classList.remove("open");
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
  progressionCountTodo.textContent = boards[currentBoard].todo.length;
  progressionCountDoing.textContent = boards[currentBoard].doing.length;
  progressionCountDone.textContent = boards[currentBoard].done.length;
}



/* ------------------------------------> THIS IS FOR DELETING TASK ITEMS <------------------------------------*/
progressionTaskLists.forEach(list => {
  list.addEventListener('click', (e) => {
    const deleteTaskButton = e.target.closest(".task-title i");

    if (!deleteTaskButton) return;

    const taskCard = e.target.closest(".task-container");
    const taskId = Number(taskCard.dataset.id);

    boards[currentBoard].todo = boards[currentBoard].todo.filter(task => task.id !== taskId);
    boards[currentBoard].doing = boards[currentBoard].doing.filter(task => task.id !== taskId);
    boards[currentBoard].done = boards[currentBoard].done.filter(task => task.id !== taskId);

    taskCard.remove();
    
    saveToStorage();
    updateCounts();
    updateTotalTaskCount();
    updateMyChart();
    
  })
})


/* ------------------------------------> THIS IS FOR DELETING TASK ITEMS <------------------------------------*/
commentList.addEventListener('click',(e) => {
  const deleteBtn = e.target.closest(".modal-comment-delete i");
  if (!deleteBtn) return;

  const commentLi = e.target.closest("li");
  const commentId = Number(commentLi.dataset.id);

  const existingTask = getAllTasks().find(task => task.id === currentTaskId);
  existingTask.comment = existingTask.comment.filter(c => c.id !== commentId);

  saveToStorage();
  commentLi.remove();
  updateCommentCounts();

  const taskCard = document.querySelector(`[data-id="${currentTaskId}"]`);
  taskCard.querySelector('.task-comment p').textContent = existingTask.comment.length;
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
    const targetList = list.querySelector("ul");
    if (!targetList) return;

    const draggedTaskCard = getAllTasks().find(task => task.id === draggedTaskId);
    if (!draggedTaskCard) return;

    for (let sourceColumn in boards[currentBoard]) {
      if (!Array.isArray(boards[currentBoard][sourceColumn])) continue;
      boards[currentBoard][sourceColumn] = boards[currentBoard][sourceColumn].filter(task => task.id !== draggedTaskId)
    };
    
    boards[currentBoard][targetColumn].push(draggedTaskCard);


    const taskElement = document.querySelector(`[data-id="${draggedTaskId}"]`);
    const taskWrapper = taskElement.closest(".task-wrapper");
    taskElement.classList.remove("todo", "doing", "done");
    taskElement.classList.add(targetColumn);
    targetList.appendChild(taskWrapper);
    
    taskWrapper.classList.add("dropped");
    setTimeout(() => {
      taskWrapper.classList.remove("dropped");
    }, 300);

    updateCounts();
    updateMyChart();
    saveToStorage();
  });
});


progressionTaskLists.forEach(list => {
  list.addEventListener("dragend", (e) => {
    const clickedTaskWrapper = e.target.closest(".task-wrapper");
    const taskCard = e.target.closest(".task-container");
    if (!taskCard) return;

    clickedTaskWrapper.classList.remove("dragging");
    saveToStorage();
  });
});



/* ------------------------------------> THIS IS FOR STATUS FLAG/BANNER<------------------------------------*/

progressionTaskLists.forEach(list => {
  list.addEventListener('click', (e) => {
    const urgencyBannerFlag = e.target.closest(".task-status i");

    if (!urgencyBannerFlag) return;

    const taskWrapper = e.target.closest(".task-wrapper")
    const taskCard = e.target.closest(".task-container");
    const bannerFlag = taskWrapper.querySelector(".urgent-banner")
    const taskId = Number(taskCard.dataset.id);

    const existingTask = getAllTasks().find(task => task.id === taskId);
    existingTask.status = existingTask.status === "urgent" ? "none" : "urgent";
    
    taskWrapper.classList.toggle("urgent");
    bannerFlag.classList.toggle("open");
    urgencyBannerFlag.classList.toggle("open");
    saveToStorage();
  })
})


function renderAllTasks() {

  document.querySelector(".todo-progress-list ul").innerHTML = '';
  document.querySelector(".doing-progress-list ul").innerHTML = '';
  document.querySelector(".done-progress-list ul").innerHTML = '';

  boards[currentBoard].todo.forEach(task => renderTask(task, "todo"));
  boards[currentBoard].doing.forEach(task => renderTask(task, "doing"));
  boards[currentBoard].done.forEach(task => renderTask(task, "done"));

  updateTotalTaskCount();
}



/* ------------------------------------> THIS IS FOR TOTAL TASKS DATA<------------------------------------*/

const totalTasksCountDisplay = document.querySelector(".number h3");
function updateTotalTaskCount() {
  const todoCount = boards[currentBoard].todo.length;
  const doingCount = boards[currentBoard].doing.length;
  const doneCount = boards[currentBoard].done.length;

  const currentTotal = todoCount + doingCount + doneCount;

  totalTasksCountDisplay.textContent = currentTotal;

  updateTaskCountIndicator(currentTotal);
}

const updateContainer = document.querySelector(".new-update");
const updateIcon = updateContainer.querySelector("i");
const updateSign = updateContainer.querySelector("span:first-child");
const updateNumber = updateContainer.querySelector("span:last-child");


let previousTotal = Number(localStorage.getItem("previousTotal")) || getAllTasks().length;
let baseTotal = Number(localStorage.getItem("baseTotal")) || previousTotal;
let lastDirection = localStorage.getItem("lastDirection") || null;

if (lastDirection === "up") {
  updateContainer.classList.add("up");
  updateContainer.classList.remove("down");
  updateIcon.className = "fa-solid fa-angles-up";
  updateSign.textContent = "+";
  updateNumber.textContent = getAllTasks().length - baseTotal;
} else if (lastDirection === "down") {
  updateContainer.classList.add("down");
  updateContainer.classList.remove("up");
  updateIcon.className = "fa-solid fa-angles-down";
  updateSign.textContent = "-";
  updateNumber.textContent = Math.abs(getAllTasks().length - baseTotal);
}

function updateTaskCountIndicator(currentTotal) {
  const diff = currentTotal - previousTotal;

  if (diff === 0) return;

  const currentDirection = diff > 0 ? "up" : "down";

  if (currentDirection !== lastDirection) {
    baseTotal = previousTotal;
    lastDirection = currentDirection;
    localStorage.setItem("baseTotal", baseTotal);  
    localStorage.setItem("lastDirection", lastDirection);
  }

  const totalDiff = currentTotal - baseTotal;

  if (currentTotal === 0) {
    updateNumber.textContent = "0";
    updateSign.textContent = "";
    updateContainer.classList.remove("up", "down");
    previousTotal = 0;
    baseTotal = 0;
    lastDirection = null;
    localStorage.setItem("previousTotal", 0);
    localStorage.setItem("baseTotal", 0);
    localStorage.removeItem("lastDirection");
    return;
  }

  if (diff === 0) return;

  if (diff > 0) {
    updateContainer.classList.add("up");
    updateContainer.classList.remove("down");

    updateIcon.className = "fa-solid fa-angles-up";
    updateSign.textContent = "+";
    updateNumber.textContent = totalDiff;
  } else if (diff < 0) {
    updateContainer.classList.add("down");
    updateContainer.classList.remove("up");

    updateIcon.className = "fa-solid fa-angles-down";
    updateSign.textContent = "-";
    updateNumber.textContent = Math.abs(totalDiff);
  } 

  previousTotal = currentTotal;
  localStorage.setItem("previousTotal", previousTotal);
}



renderMasterList();






