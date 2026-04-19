// Materials Page JavaScript

// Initialize materials page
function initMaterialsPage() {
    console.log('Initializing materials page...');
    
    // Initialize search functionality
    initSearch();
    
    // Initialize filter buttons
    initFilters();
    
    // Initialize material cards
    initMaterialCards();
    
    // Initialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Initialize search functionality
function initSearch() {
    const searchInput = document.getElementById('materials-search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.material-card');
        
        cards.forEach(card => {
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const desc = card.querySelector('.material-desc')?.textContent.toLowerCase() || '';
            const modules = Array.from(card.querySelectorAll('.material-modules li'))
                .map(li => li.textContent.toLowerCase())
                .join(' ');
            
            const matches = title.includes(searchTerm) || 
                           desc.includes(searchTerm) || 
                           modules.includes(searchTerm);
            
            card.style.display = matches ? 'block' : 'none';
        });
    });
}

// Initialize filter buttons
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons.length) return;
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            filterMaterials(filter);
        });
    });
}

// Filter materials by level
function filterMaterials(filter) {
    const cards = document.querySelectorAll('.material-card');
    
    cards.forEach(card => {
        if (filter === 'all') {
            card.style.display = 'block';
        } else {
            const level = card.dataset.level;
            card.style.display = level === filter ? 'block' : 'none';
        }
    });
}

// Initialize material cards
function initMaterialCards() {
    const cards = document.querySelectorAll('.material-card');
    cards.forEach(card => {
        // Add click handler for entire card
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking buttons
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                return;
            }
            
            const courseId = this.dataset.course;
            if (courseId) {
                openMaterial(courseId);
            }
        });
    });
}

// Open material details
function openMaterial(courseId) {
    const courseData = getCourseData(courseId);
    if (!courseData) {
        console.error('Course data not found:', courseId);
        return;
    }
    
    showMaterialModal(courseData);
}

// Get course data
function getCourseData(courseId) {
    const courses = {
        ml: {
            id: 'ml',
            title: "Machine Learning Fundamentals",
            duration: "8h 30m",
            level: "Beginner",
            students: "2.1k students",
            description: "Learn the core concepts of Machine Learning, including supervised and unsupervised learning, basic algorithms, model evaluation, and feature engineering. This course provides a solid foundation for anyone starting their ML journey.",
            icon: "brain",
            iconColor: "#a78bfa",
            iconBg: "rgba(124, 58, 237, 0.15)",
            modules: [
                {
                    title: "Introduction to Machine Learning",
                    description: "Understand what ML is and why it's important",
                    lessons: [
                        { icon: "play", title: "What is Machine Learning?", duration: "12 min" },
                        { icon: "play", title: "History and Development of ML", duration: "10 min" },
                        { icon: "file-text", title: "AI vs ML vs Deep Learning", duration: "8 min" },
                        { icon: "play", title: "Real-world ML Applications", duration: "15 min" }
                    ]
                },
                {
                    title: "Types of Machine Learning",
                    description: "Learn about different ML approaches",
                    lessons: [
                        { icon: "play", title: "Supervised Learning", duration: "20 min" },
                        { icon: "play", title: "Unsupervised Learning", duration: "18 min" },
                        { icon: "play", title: "Reinforcement Learning", duration: "14 min" },
                        { icon: "code", title: "Lab: First Classification", duration: "30 min" }
                    ]
                },
                {
                    title: "Basic ML Algorithms",
                    description: "Learn core ML algorithms and their implementation",
                    lessons: [
                        { icon: "play", title: "Linear Regression", duration: "22 min" },
                        { icon: "play", title: "Logistic Regression", duration: "20 min" },
                        { icon: "play", title: "Decision Tree & Random Forest", duration: "25 min" },
                        { icon: "play", title: "K-Nearest Neighbors", duration: "18 min" },
                        { icon: "play", title: "Support Vector Machine", duration: "22 min" }
                    ]
                }
            ]
        },
        python: {
            id: 'python',
            title: "Python for AI",
            duration: "6h 45m",
            level: "Beginner",
            students: "1.8k students",
            description: "Master Python programming and essential libraries for AI development. Learn NumPy for numerical computing, Pandas for data manipulation, and Matplotlib for data visualization.",
            icon: "code",
            iconColor: "#22c55e",
            iconBg: "rgba(34, 197, 94, 0.15)",
            modules: [
                {
                    title: "Python Basics for AI",
                    description: "Setup Python environment and learn essential syntax",
                    lessons: [
                        { icon: "play", title: "Python Setup and Basics", duration: "20 min" },
                        { icon: "code", title: "Variables and Data Types", duration: "15 min" },
                        { icon: "code", title: "Control Structures", duration: "18 min" },
                        { icon: "code", title: "Functions and Modules", duration: "22 min" }
                    ]
                },
                {
                    title: "NumPy for Data Science",
                    description: "Master numerical computing with NumPy",
                    lessons: [
                        { icon: "play", title: "NumPy Arrays and Operations", duration: "25 min" },
                        { icon: "code", title: "Array Indexing and Slicing", duration: "20 min" },
                        { icon: "code", title: "Mathematical Operations", duration: "22 min" },
                        { icon: "code", title: "Broadcasting and Vectorization", duration: "18 min" }
                    ]
                }
            ]
        },
        dl: {
            id: 'dl',
            title: "Deep Learning Essentials",
            duration: "10h 15m",
            level: "Intermediate",
            students: "1.5k students",
            description: "Understand neural networks, backpropagation, convolutional neural networks, and transfer learning. Learn to build and train deep learning models for various applications.",
            icon: "layers",
            iconColor: "#3b82f6",
            iconBg: "rgba(59, 130, 246, 0.15)",
            modules: [
                {
                    title: "Neural Networks Fundamentals",
                    description: "Learn the basics of neural networks",
                    lessons: [
                        { icon: "play", title: "What are Neural Networks?", duration: "20 min" },
                        { icon: "play", title: "Activation Functions", duration: "18 min" },
                        { icon: "play", title: "Forward Propagation", duration: "22 min" },
                        { icon: "code", title: "Building Your First NN", duration: "30 min" }
                    ]
                }
            ]
        },
        nlp: {
            id: 'nlp',
            title: "Natural Language Processing",
            duration: "9h 20m",
            level: "Intermediate",
            students: "1.3k students",
            description: "Learn text processing, word embeddings, and transformer models for NLP tasks. Master techniques for text classification, sentiment analysis, and language generation.",
            icon: "message-square",
            iconColor: "#c084fc",
            iconBg: "rgba(192, 132, 252, 0.15)",
            modules: [
                {
                    title: "NLP Introduction",
                    description: "Understand the basics of Natural Language Processing",
                    lessons: [
                        { icon: "play", title: "What is NLP?", duration: "15 min" },
                        { icon: "play", title: "Applications of NLP", duration: "18 min" },
                        { icon: "code", title: "Text Preprocessing Pipeline", duration: "25 min" }
                    ]
                }
            ]
        },
        cv: {
            id: 'cv',
            title: "Computer Vision with Python",
            duration: "8h 50m",
            level: "Intermediate",
            students: "1.2k students",
            description: "Master image processing, object detection, and computer vision techniques using OpenCV and deep learning models.",
            icon: "eye",
            iconColor: "#34d399",
            iconBg: "rgba(52, 211, 153, 0.15)",
            modules: [
                {
                    title: "Computer Vision Basics",
                    description: "Learn the fundamentals of computer vision",
                    lessons: [
                        { icon: "play", title: "Introduction to Computer Vision", duration: "16 min" },
                        { icon: "play", title: "Image Processing Fundamentals", duration: "22 min" },
                        { icon: "code", title: "Working with OpenCV", duration: "28 min" }
                    ]
                }
            ]
        },
        ds: {
            id: 'ds',
            title: "Data Science with AI",
            duration: "7h 30m",
            level: "Intermediate",
            students: "1.4k students",
            description: "Learn data analysis, visualization, and AI-powered data science workflows. Master techniques for extracting insights from data.",
            icon: "bar-chart",
            iconColor: "#f59e0b",
            iconBg: "rgba(245, 158, 11, 0.15)",
            modules: [
                {
                    title: "Data Analysis Workflow",
                    description: "Learn the complete data analysis process",
                    lessons: [
                        { icon: "play", title: "CRISP-DM Methodology", duration: "18 min" },
                        { icon: "play", title: "Exploratory Data Analysis", duration: "22 min" },
                        { icon: "code", title: "Data Cleaning Techniques", duration: "25 min" }
                    ]
                }
            ]
        },
        rl: {
            id: 'rl',
            title: "Reinforcement Learning",
            duration: "11h 10m",
            level: "Advanced",
            students: "900 students",
            description: "Master RL algorithms, Markov Decision Processes, and practical applications in gaming and robotics.",
            icon: "gamepad-2",
            iconColor: "#ef4444",
            iconBg: "rgba(239, 68, 68, 0.15)",
            modules: [
                {
                    title: "RL Fundamentals",
                    description: "Understand the basics of Reinforcement Learning",
                    lessons: [
                        { icon: "play", title: "What is Reinforcement Learning?", duration: "20 min" },
                        { icon: "play", title: "Markov Decision Process", duration: "25 min" },
                        { icon: "play", title: "Reward and Policy", duration: "22 min" }
                    ]
                }
            ]
        },
        ethics: {
            id: 'ethics',
            title: "AI Ethics & Safety",
            duration: "5h 45m",
            level: "All Levels",
            students: "2.5k students",
            description: "Understand ethical principles, bias mitigation, and responsible AI development. Learn to build fair, transparent, and accountable AI systems.",
            icon: "scale",
            iconColor: "#8b5cf6",
            iconBg: "rgba(139, 92, 246, 0.15)",
            modules: [
                {
                    title: "Ethical Principles in AI",
                    description: "Learn the fundamental ethical principles for AI",
                    lessons: [
                        { icon: "play", title: "AI Ethics Framework", duration: "18 min" },
                        { icon: "play", title: "Fairness and Bias", duration: "22 min" },
                        { icon: "play", title: "Transparency and Explainability", duration: "20 min" },
                        { icon: "play", title: "Privacy and Security", duration: "16 min" }
                    ]
                }
            ]
        }
    };
    
    return courses[courseId];
}

// Show material modal
function showMaterialModal(courseData) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.material-modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal HTML
    const modalHTML = `
        <div class="material-modal-overlay">
            <div class="material-modal">
                <div class="modal-header">
                    <h2>${courseData.title}</h2>
                    <button class="modal-close" onclick="closeMaterialModal()">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="modal-content">
                    <div class="course-info">
                        <div class="info-item">
                            <i data-lucide="clock"></i>
                            <span>${courseData.duration}</span>
                        </div>
                        <div class="info-item">
                            <i data-lucide="bar-chart"></i>
                            <span>${courseData.level}</span>
                        </div>
                        <div class="info-item">
                            <i data-lucide="users"></i>
                            <span>${courseData.students}</span>
                        </div>
                    </div>
                    
                    <div class="course-description">
                        <h3>Description</h3>
                        <p>${courseData.description}</p>
                    </div>
                    
                    <div class="course-modules">
                        <h3>Course Modules</h3>
                        <div class="modules-list">
                            ${courseData.modules.map((module, index) => `
                                <div class="module-item">
                                    <div class="module-number">${index + 1}</div>
                                    <div class="module-content">
                                        <h4>${module.title}</h4>
                                        <p>${module.description}</p>
                                        <div class="module-lessons">
                                            ${module.lessons.map(lesson => `
                                                <div class="lesson-item">
                                                    <i data-lucide="${lesson.icon}"></i>
                                                    <span>${lesson.title}</span>
                                                    <span class="lesson-duration">${lesson.duration}</span>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn btn-outline" onclick="closeMaterialModal()">
                            Close
                        </button>
                        <button class="btn btn-primary" onclick="startCourse('${courseData.id}')">
                            <i data-lucide="play"></i> Start Learning
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to document
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Initialize icons
    setTimeout(() => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, 100);
    
    // Add click handler to close modal when clicking overlay
    const modalOverlay = document.querySelector('.material-modal-overlay');
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === this) {
            closeMaterialModal();
        }
    });
    
    // Add escape key handler
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMaterialModal();
        }
    });
}

// Close material modal
function closeMaterialModal() {
    const modal = document.querySelector('.material-modal-overlay');
    if (modal) {
        modal.remove();
    }
    
    // Remove escape key handler
    document.removeEventListener('keydown', arguments.callee);
}

// Start course
function startCourse(courseId) {
    closeMaterialModal();
    
    // Navigate to courses page
    if (typeof window.navigateTo === 'function') {
        window.navigateTo('courses');
        
        // Show notification
        if (typeof showToast === 'function') {
            showToast(`Starting ${getCourseData(courseId)?.title || 'course'}...`);
        }
    } else {
        // Fallback: open courses page
        window.location.href = '/dashboard?page=courses';
    }
}

// Export functions for global access
window.initMaterialsPage = initMaterialsPage;
window.openMaterial = openMaterial;
window.closeMaterialModal = closeMaterialModal;
window.startCourse = startCourse;