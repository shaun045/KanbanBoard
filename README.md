🗂️ Kanban Task Manager

A modern web-based Kanban-style task management application built with HTML, CSS, and Vanilla JavaScript. This app allows users to organize tasks across multiple boards, track progress, and visualize task distribution with dynamic charts. It focuses on clean UI design, interactive features, and efficient state management while staying lightweight and framework-free.

🔹 Overview

Managing projects and tasks requires clarity and efficiency. This Kanban Task Manager provides a simple and interactive interface to:

Create, edit, and delete boards (tabs)
Add tasks with titles, descriptions, due dates, and urgency flags
Track task counts and progress dynamically
Move tasks between To Do, Doing, and Done columns via drag-and-drop
Add and review comments per task
Filter tasks by title, description, due date, or urgency
Visualize task distribution with a Chart.js bar chart
Persist all data locally using LocalStorage, ensuring continuity across sessions
🔹 Features
🏷 Multi-Board Management
Create new boards dynamically
Edit board names inline
Delete boards safely, preserving default board
Search boards via a real-time search bar
✅ Task Management
Add tasks with:
Title
Description
Due date
Urgency flag
Tasks are automatically assigned to To Do, Doing, or Done
Edit tasks directly from a modal interface with read-only and editable modes
📝 Comments
Add multiple comments per task
Delete comments individually
View comment counts dynamically on task cards
🔄 Drag-and-Drop
Move tasks between columns
Smooth animations and updated storage
Status and charts update in real-time
⚡ Status Flag / Urgency
Mark tasks as urgent
Urgent tasks display banners and icon highlights
Toggle urgent status directly from the task card
🔍 Filtering & Search
Search tasks by title
Filter tasks:
Missing title
Missing description
Missing due date
Urgent tasks only
📊 Dynamic Chart
Visualize task distribution in To Do, Doing, Done columns
Chart dynamically updates as tasks are added, moved, or deleted
Shows percentage labels above each bar for clarity
📈 Total Task Count & Updates
Tracks total tasks per board
Displays increase/decrease indicators with counts
Persists counts across sessions
🔹 Technology Stack

Frontend:

HTML5
CSS3 (with animations & responsive layout)
Vanilla JavaScript (ES6+)

Libraries & APIs:

Chart.js for dynamic bar chart
Flatpickr for date selection
FontAwesome for icons
LocalStorage for persistent data
🔹 User Interface Highlights
Clean Kanban layout with To Do / Doing / Done columns
Smooth animations for adding, editing, and moving tasks
Modal interface for task details and comments
Visual urgency flags and banners
Real-time task counts and chart updates
🔹 Project Structure
kanban-task-manager/
├── index.html         # Main HTML layout with boards, tasks, and modal
├── style.css          # Styles, layout, animations, and responsive design
├── app.js             # Core logic: boards, tasks, comments, drag-drop, filters
├── chart.js           # Chart.js configuration and rendering
└── README.md          # Project documentation
🔹 Core Concepts Demonstrated
DOM Manipulation: Dynamic creation and update of task cards, comments, and boards
State Management: Multi-board task tracking with LocalStorage persistence
Data Visualization: Chart.js integration for task distribution
Animations: Smooth transitions and number updates using requestAnimationFrame
Event Handling: Clicks, drag-and-drop, form input, filtering, and modal interactions
UI/UX Design: Responsive, clean, and interactive Kanban interface
🔹 How to Run
Clone the repository:
git clone https://github.com/shaun045/KanbanBoard.git
Open the project folder
Launch the app by opening index.html in a browser

No additional dependencies are required.

🔹 Future Improvements
Edit tasks directly in modal
Advanced filtering (by board or due date)
Export/Import boards and tasks
Dark/light theme toggle
Backend integration for multi-user support
Notifications and reminders
🔹 Learning Goals

This project strengthens core front-end development skills, including:

JavaScript logic, event handling, and DOM manipulation
State management without frameworks
Responsive, interactive UI design
Data visualization with Chart.js
Building complete, user-facing applications
🔹 Author

Shaun Aniñon – Frontend Developer in progress, focused on building practical applications and mastering modern web development tools.
