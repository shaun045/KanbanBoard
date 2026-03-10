
/* ---------> KANBAN ENTIRE MODAL <------------------ */
const kanbanModal = document.querySelector(".modal");
const modalExitButton = document.querySelector(".exit-button-container");



/* ----------> THIS IS FOR TASKS ITEMS <--------------*/
const taskItems = document.querySelector(".task-container");




// taskItems.forEach(task => {
//   task.addEventListener('click', () => {
//     kanbanModal.classList.add("open");
//     console.log("clicked");
//   });
// });


taskItems.addEventListener('click', () => {
  kanbanModal.classList.add("open");
})


modalExitButton.addEventListener('click', () => {
  kanbanModal.classList.remove("open");
})


