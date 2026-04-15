// ══════════════════════════════════════════════
// PAGES.JS — Entry point: routes page navigation
// ══════════════════════════════════════════════

function initPage(pageId) {
  switch (pageId) {
    case 'dashboard':    initDashboard();      break;
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
