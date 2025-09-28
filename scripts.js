 function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 20;
            
            for (let i = 0; i < particleCount; i++) {
                setTimeout(() => {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    particle.style.left = Math.random() * 100 + '%';
                    particle.style.animationDelay = Math.random() * 6 + 's';
                    particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
                    particlesContainer.appendChild(particle);
                    
                    // Remove particle after animation
                    setTimeout(() => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    }, 8000);
                }, i * 300);
            }
        }

        // Create particles periodically
        createParticles();
        setInterval(createParticles, 8000);

        // Drag and drop functionality
        function setupDragAndDrop() {
            const tasks = document.querySelectorAll(".task");
            const columns = document.querySelectorAll(".column");

            tasks.forEach(task => {
                task.addEventListener("dragstart", (e) => {
                    task.classList.add("dragging");
                    e.dataTransfer.effectAllowed = "move";
                });

                task.addEventListener("dragend", () => {
                    task.classList.remove("dragging");
                });
            });

            columns.forEach(column => {
                column.addEventListener("dragover", (e) => {
                    e.preventDefault();
                    column.classList.add("over");
                    
                    const dragging = document.querySelector(".dragging");
                    const afterElement = getDragAfterElement(column, e.clientY);
                    
                    if (afterElement == null) {
                        const addButton = column.querySelector('.add-task-btn');
                        column.insertBefore(dragging, addButton);
                    } else {
                        column.insertBefore(dragging, afterElement);
                    }
                });

                column.addEventListener("dragleave", (e) => {
                    if (!column.contains(e.relatedTarget)) {
                        column.classList.remove("over");
                    }
                });

                column.addEventListener("drop", (e) => {
                    e.preventDefault();
                    column.classList.remove("over");
                });
            });
        }

        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];
            
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }

        // Add new task functionality
        function addTask(columnId) {
            const taskText = prompt("Enter task description:");
            if (taskText && taskText.trim()) {
                const column = document.getElementById(columnId);
                const addButton = column.querySelector('.add-task-btn');
                
                const newTask = document.createElement('div');
                newTask.className = 'task';
                newTask.draggable = true;
                newTask.textContent = taskText.trim();
                
                column.insertBefore(newTask, addButton);
                setupDragAndDrop(); // Re-setup drag and drop for new task
            }
        }

        // Initialize drag and drop
        setupDragAndDrop();

        // Add some interactive effects
        document.addEventListener('mousemove', (e) => {
            const cursor = document.querySelector('.cursor');
            if (cursor) {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            }
        });

        // Add click ripple effect to tasks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('task')) {
                const ripple = document.createElement('span');
                const rect = e.target.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(102, 126, 234, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                e.target.style.position = 'relative';
                e.target.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            }
        });

        // Add ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);