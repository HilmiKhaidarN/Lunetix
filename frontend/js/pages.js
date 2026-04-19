// ══════════════════════════════════════════════
// PAGES.JS — Entry point: routes page navigation
// ══════════════════════════════════════════════

function initPage(pageId) {
  switch (pageId) {
    case 'dashboard':    initDashboard();      break;
    case 'courses':      renderCourses();       break;
    case 'materials':    renderMaterials();    break;
    case 'playground':   initPlayground();     break;
    case 'projects':     renderProjects();     break;
    case 'quizzes':      renderQuizPage();     break;
    case 'community':    renderCommunity();    break;
    case 'certificates': renderCertificates(); break;
    case 'analytics':    renderAnalytics();    break;
    case 'bookmarks':    renderBookmarks();    break;
    case 'settings':     initSettings();       break;
  }
}


// Function to render materials page
function renderMaterials() {
    // Load materials page content
    const pageContent = document.getElementById('page-content-root');
    if (!pageContent) return;
    
    // Check if materials page already exists
    let materialsPage = document.getElementById('page-materials');
    if (!materialsPage) {
        // Load materials page HTML
        fetch('/frontend/html/pages/page-materials.html')
            .then(response => response.text())
            .then(html => {
                // Create temporary container
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                
                // Find the materials page content
                const materialsContent = tempDiv.querySelector('#page-materials');
                if (materialsContent) {
                    // Add to page content
                    pageContent.appendChild(materialsContent);
                    
                    // Initialize materials page
                    if (typeof initMaterialsPage === 'function') {
                        initMaterialsPage();
                    }
                    
                    // Initialize icons
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
            })
            .catch(error => {
                console.error('Error loading materials page:', error);
                // Fallback: show simple materials page
                showFallbackMaterialsPage();
            });
    } else {
        // Page already exists, just initialize
        if (typeof initMaterialsPage === 'function') {
            initMaterialsPage();
        }
        
        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

// Fallback materials page
function showFallbackMaterialsPage() {
    const pageContent = document.getElementById('page-content-root');
    if (!pageContent) return;
    
    const fallbackHTML = `
        <div class="page" id="page-materials">
            <div class="materials-header">
                <h1>📚 Course Materials</h1>
                <p>Access comprehensive learning materials for all 8 AI courses</p>
            </div>
            
            <div class="materials-grid">
                <div class="material-card">
                    <h3>Machine Learning Fundamentals</h3>
                    <p>Learn the core concepts of ML, algorithms, and practical implementation.</p>
                    <button class="btn btn-primary" onclick="window.open('/frontend/html/pages/course-materials.html#ml', '_blank')">
                        Read Materials
                    </button>
                </div>
                
                <div class="material-card">
                    <h3>Python for AI</h3>
                    <p>Master Python programming and essential libraries for AI development.</p>
                    <button class="btn btn-primary" onclick="window.open('/frontend/html/pages/course-materials.html#python', '_blank')">
                        Read Materials
                    </button>
                </div>
                
                <div class="material-card">
                    <h3>Deep Learning Essentials</h3>
                    <p>Understand neural networks, backpropagation, and modern DL architectures.</p>
                    <button class="btn btn-primary" onclick="window.open('/frontend/html/pages/course-materials.html#dl', '_blank')">
                        Read Materials
                    </button>
                </div>
                
                <div class="material-card">
                    <h3>Natural Language Processing</h3>
                    <p>Learn text processing, embeddings, and transformer models for NLP tasks.</p>
                    <button class="btn btn-primary" onclick="window.open('/frontend/html/pages/course-materials.html#nlp', '_blank')">
                        Read Materials
                    </button>
                </div>
                
                <div class="material-card">
                    <h3>Computer Vision with Python</h3>
                    <p>Master image processing, object detection, and computer vision techniques.</p>
                    <button class="btn btn-primary" onclick="window.open('/frontend/html/pages/course-materials.html#cv', '_blank')">
                        Read Materials
                    </button>
                </div>
                
                <div class="material-card">
                    <h3>Data Science with AI</h3>
                    <p>Learn data analysis, visualization, and AI-powered data science workflows.</p>
                    <button class="btn btn-primary" onclick="window.open('/frontend/html/pages/course-materials.html#ds', '_blank')">
                        Read Materials
                    </button>
                </div>
                
                <div class="material-card">
                    <h3>Reinforcement Learning</h3>
                    <p>Master RL algorithms, MDPs, and practical applications in gaming and robotics.</p>
                    <button class="btn btn-primary" onclick="window.open('/frontend/html/pages/course-materials.html#rl', '_blank')">
                        Read Materials
                    </button>
                </div>
                
                <div class="material-card">
                    <h3>AI Ethics & Safety</h3>
                    <p>Understand ethical principles, bias mitigation, and responsible AI development.</p>
                    <button class="btn btn-primary" onclick="window.open('/frontend/html/pages/course-materials.html#ethics', '_blank')">
                        Read Materials
                    </button>
                </div>
            </div>
        </div>
        
        <style>
            .page#page-materials {
                padding: 24px;
            }
            
            .materials-header {
                margin-bottom: 30px;
            }
            
            .materials-header h1 {
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 8px;
                color: var(--text-primary);
            }
            
            .materials-header p {
                font-size: 14px;
                color: var(--text-secondary);
            }
            
            .materials-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
            }
            
            .material-card {
                background: var(--bg-card);
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 20px;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            
            .material-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
            }
            
            .material-card h3 {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 12px;
                color: var(--text-primary);
            }
            
            .material-card p {
                font-size: 14px;
                color: var(--text-secondary);
                line-height: 1.5;
                margin-bottom: 20px;
            }
            
            .material-card .btn {
                width: 100%;
            }
            
            @media (max-width: 768px) {
                .materials-grid {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    `;
    
    // Remove existing materials page if exists
    const existingPage = document.getElementById('page-materials');
    if (existingPage) {
        existingPage.remove();
    }
    
    // Add fallback page
    pageContent.insertAdjacentHTML('beforeend', fallbackHTML);
    
    // Initialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}


// Function to render courses page
function renderCourses() {
    // This function should be defined in courses.js
    // We'll just call the existing function if it exists
    if (typeof renderCoursesPage === 'function') {
        renderCoursesPage();
    } else if (typeof initCoursesPage === 'function') {
        initCoursesPage();
    } else {
        console.log('Courses page functions not found');
    }
}