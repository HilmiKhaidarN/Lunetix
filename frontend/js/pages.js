// ══════════════════════════════════════════════
// PAGES.JS — Entry point: routes page navigation
// ══════════════════════════════════════════════

function initPage(pageId) {
  switch (pageId) {
    case 'dashboard':    initDashboard();      break;
    case 'courses':      renderCourses();       break;
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