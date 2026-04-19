// ══════════════════════════════════════════════
// VIDEO PLAYER — Advanced Video Learning System
// ══════════════════════════════════════════════

let currentVideoData = null;
let videoProgressInterval = null;
let lastProgressSave = 0;

// ── Video Player API ──
const VideoAPI = {
  getLessons: (courseId) => apiFetch(`/video-lessons/${courseId}`),
  updateProgress: (courseId, lessonId, watchTime, duration, completed) => apiFetch(
    `/video-lessons/${courseId}/${lessonId}/progress`,
    {
      method: 'POST',
      body: JSON.stringify({ watchTime, duration, completed })
    }
  ),
  getStats: (courseId) => apiFetch(`/video-lessons/${courseId}/stats`)
};

// ── Initialize Video Player ──
function initVideoPlayer(courseId) {
  loadVideoLessons(courseId);
}

async function loadVideoLessons(courseId) {
  try {
    const data = await VideoAPI.getLessons(courseId);
    renderVideoLessons(data.lessons, courseId);
  } catch (error) {
    console.error('[Video] Failed to load lessons:', error);
    showToast('Gagal memuat video lessons.');
  }
}

function renderVideoLessons(lessons, courseId) {
  const container = document.getElementById('video-lessons-container');
  if (!container) return;

  if (!lessons.length) {
    container.innerHTML = `
      <div style="text-align:center;padding:40px;color:var(--text-muted)">
        <i data-lucide="video" style="width:40px;height:40px;margin-bottom:12px;opacity:0.4"></i>
        <div style="font-size:14px;margin-bottom:8px">Belum ada video lessons.</div>
        <div style="font-size:12px">Video lessons akan segera ditambahkan.</div>
      </div>`;
    lucide.createIcons();
    return;
  }

  container.innerHTML = `
    <div class="video-player-layout">
      <!-- Video Player -->
      <div class="video-player-main">
        <div id="video-player-wrapper" class="video-player-wrapper">
          <div class="video-placeholder">
            <i data-lucide="play-circle" style="width:64px;height:64px;color:var(--accent-light);margin-bottom:16px"></i>
            <p style="font-size:14px;color:var(--text-muted)">Pilih video lesson untuk mulai belajar</p>
          </div>
        </div>
        
        <!-- Video Info -->
        <div id="video-info" class="video-info" style="display:none">
          <div class="video-title-section">
            <h3 id="current-video-title">Video Title</h3>
            <div class="video-meta">
              <span id="current-video-duration">0:00</span>
              <span>•</span>
              <span id="current-video-progress">0% completed</span>
            </div>
          </div>
          <div id="current-video-description" class="video-description">
            Video description goes here...
          </div>
          
          <!-- Video Controls -->
          <div class="video-controls">
            <button class="btn btn-outline" onclick="markVideoCompleted()" id="mark-complete-btn">
              <i data-lucide="check-circle" style="width:14px;height:14px"></i>
              Mark as Complete
            </button>
            <button class="btn btn-primary" onclick="nextVideo()" id="next-video-btn">
              Next Video
              <i data-lucide="arrow-right" style="width:14px;height:14px"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Video Playlist -->
      <div class="video-playlist">
        <div class="playlist-header">
          <h4>Course Videos</h4>
          <div class="playlist-stats" id="playlist-stats">
            <span>0 / ${lessons.length} completed</span>
          </div>
        </div>
        <div class="playlist-content" id="playlist-content">
          ${lessons.map((lesson, index) => renderVideoItem(lesson, index, courseId)).join('')}
        </div>
      </div>
    </div>`;

  lucide.createIcons();
  updatePlaylistStats(lessons);
}

function renderVideoItem(lesson, index, courseId) {
  const isCompleted = lesson.completed;
  const isWatched = lesson.watched;
  const progressPercent = lesson.duration > 0 ? Math.round((lesson.watchTime / lesson.duration) * 100) : 0;
  
  return `
    <div class="video-item ${isCompleted ? 'completed' : ''} ${isWatched ? 'watched' : ''}" 
         onclick="playVideo('${lesson.id}', ${courseId})" 
         data-lesson-id="${lesson.id}">
      
      <!-- Thumbnail -->
      <div class="video-thumbnail">
        <img src="${lesson.thumbnail_url || '/frontend/images/video-placeholder.jpg'}" 
             alt="${lesson.title}" 
             onerror="this.src='/frontend/images/video-placeholder.jpg'">
        
        <!-- Play Overlay -->
        <div class="video-play-overlay">
          ${isCompleted 
            ? '<i data-lucide="check-circle" style="width:24px;height:24px;color:#34d399"></i>'
            : '<i data-lucide="play" style="width:24px;height:24px;color:#fff"></i>'
          }
        </div>
        
        <!-- Progress Bar -->
        ${progressPercent > 0 ? `
          <div class="video-progress-bar">
            <div class="video-progress-fill" style="width:${progressPercent}%"></div>
          </div>
        ` : ''}
        
        <!-- Duration -->
        <div class="video-duration">${formatDuration(lesson.duration)}</div>
      </div>
      
      <!-- Info -->
      <div class="video-item-info">
        <div class="video-item-number">${index + 1}</div>
        <div class="video-item-content">
          <h5 class="video-item-title">${lesson.title}</h5>
          <p class="video-item-desc">${lesson.description || ''}</p>
          <div class="video-item-meta">
            <span>${formatDuration(lesson.duration)}</span>
            ${isCompleted ? '<span class="video-completed-badge">✓ Completed</span>' : ''}
            ${isWatched && !isCompleted ? '<span class="video-watched-badge">In Progress</span>' : ''}
          </div>
        </div>
      </div>
    </div>`;
}

// ── Play Video ──
async function playVideo(lessonId, courseId) {
  try {
    // Get lesson data
    const data = await VideoAPI.getLessons(courseId);
    const lesson = data.lessons.find(l => l.id === lessonId);
    
    if (!lesson) {
      showToast('Video lesson tidak ditemukan.');
      return;
    }
    
    currentVideoData = { ...lesson, courseId };
    
    // Update UI
    const wrapper = document.getElementById('video-player-wrapper');
    const info = document.getElementById('video-info');
    
    if (wrapper) {
      wrapper.innerHTML = `
        <iframe 
          id="video-iframe"
          src="${lesson.video_url}?autoplay=1&start=${Math.floor(lesson.watchTime || 0)}"
          frameborder="0" 
          allowfullscreen
          allow="autoplay; encrypted-media"
          style="width:100%;height:100%;border-radius:12px">
        </iframe>`;
    }
    
    if (info) {
      info.style.display = 'block';
      document.getElementById('current-video-title').textContent = lesson.title;
      document.getElementById('current-video-duration').textContent = formatDuration(lesson.duration);
      document.getElementById('current-video-description').textContent = lesson.description || '';
      
      updateVideoProgress(lesson);
    }
    
    // Update playlist active state
    document.querySelectorAll('.video-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-lesson-id="${lessonId}"]`)?.classList.add('active');
    
    // Start progress tracking
    startProgressTracking();
    
  } catch (error) {
    console.error('[Video] Play error:', error);
    showToast('Gagal memutar video.');
  }
}

function updateVideoProgress(lesson) {
  const progressPercent = lesson.duration > 0 ? Math.round((lesson.watchTime / lesson.duration) * 100) : 0;
  const progressEl = document.getElementById('current-video-progress');
  const markCompleteBtn = document.getElementById('mark-complete-btn');
  
  if (progressEl) {
    progressEl.textContent = `${progressPercent}% completed`;
  }
  
  if (markCompleteBtn) {
    if (lesson.completed) {
      markCompleteBtn.innerHTML = '<i data-lucide="check-circle" style="width:14px;height:14px"></i> Completed';
      markCompleteBtn.disabled = true;
      markCompleteBtn.classList.add('btn-success');
    } else {
      markCompleteBtn.innerHTML = '<i data-lucide="check-circle" style="width:14px;height:14px"></i> Mark as Complete';
      markCompleteBtn.disabled = false;
      markCompleteBtn.classList.remove('btn-success');
    }
  }
  
  lucide.createIcons();
}

// ── Progress Tracking ──
function startProgressTracking() {
  // Clear existing interval
  if (videoProgressInterval) {
    clearInterval(videoProgressInterval);
  }
  
  // Track progress every 5 seconds
  videoProgressInterval = setInterval(() => {
    if (currentVideoData) {
      const now = Date.now();
      // Save progress every 30 seconds to avoid too many API calls
      if (now - lastProgressSave > 30000) {
        saveVideoProgress();
        lastProgressSave = now;
      }
    }
  }, 5000);
}

async function saveVideoProgress() {
  if (!currentVideoData) return;
  
  try {
    // Estimate current watch time (this is simplified - in real app you'd get from video player)
    const estimatedWatchTime = (currentVideoData.watchTime || 0) + 30; // Add 30 seconds
    
    await VideoAPI.updateProgress(
      currentVideoData.courseId,
      currentVideoData.id,
      estimatedWatchTime,
      currentVideoData.duration,
      false
    );
    
    // Update local data
    currentVideoData.watchTime = estimatedWatchTime;
    updateVideoProgress(currentVideoData);
    
  } catch (error) {
    console.warn('[Video] Failed to save progress:', error);
  }
}

async function markVideoCompleted() {
  if (!currentVideoData) return;
  
  try {
    const result = await VideoAPI.updateProgress(
      currentVideoData.courseId,
      currentVideoData.id,
      currentVideoData.duration, // Full duration
      currentVideoData.duration,
      true // Mark as completed
    );
    
    if (result.pointsAwarded > 0) {
      showToast(`🎉 Video completed! +${result.pointsAwarded} points earned!`);
    } else {
      showToast('✅ Video marked as completed!');
    }
    
    // Update UI
    currentVideoData.completed = true;
    currentVideoData.watchTime = currentVideoData.duration;
    updateVideoProgress(currentVideoData);
    
    // Update playlist
    const videoItem = document.querySelector(`[data-lesson-id="${currentVideoData.id}"]`);
    if (videoItem) {
      videoItem.classList.add('completed');
      const badge = videoItem.querySelector('.video-item-meta');
      if (badge) {
        badge.innerHTML = `<span>${formatDuration(currentVideoData.duration)}</span><span class="video-completed-badge">✓ Completed</span>`;
      }
    }
    
    // Reload lessons to update stats
    loadVideoLessons(currentVideoData.courseId);
    
  } catch (error) {
    console.error('[Video] Mark complete error:', error);
    showToast('Gagal menandai video sebagai selesai.');
  }
}

function nextVideo() {
  if (!currentVideoData) return;
  
  // Find current video index and play next
  const playlist = document.querySelectorAll('.video-item');
  const currentIndex = Array.from(playlist).findIndex(item => 
    item.dataset.lessonId === currentVideoData.id
  );
  
  if (currentIndex >= 0 && currentIndex < playlist.length - 1) {
    const nextItem = playlist[currentIndex + 1];
    const nextLessonId = nextItem.dataset.lessonId;
    playVideo(nextLessonId, currentVideoData.courseId);
  } else {
    showToast('🎉 Kamu sudah menyelesaikan semua video di course ini!');
  }
}

function updatePlaylistStats(lessons) {
  const statsEl = document.getElementById('playlist-stats');
  if (!statsEl) return;
  
  const completed = lessons.filter(l => l.completed).length;
  const total = lessons.length;
  
  statsEl.innerHTML = `<span>${completed} / ${total} completed</span>`;
}

// ── Utility Functions ──
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// ── Cleanup ──
function cleanupVideoPlayer() {
  if (videoProgressInterval) {
    clearInterval(videoProgressInterval);
    videoProgressInterval = null;
  }
  
  // Save final progress
  if (currentVideoData) {
    saveVideoProgress();
  }
  
  currentVideoData = null;
}

// Cleanup when page unloads
window.addEventListener('beforeunload', cleanupVideoPlayer);

// ── Export for global access ──
window.initVideoPlayer = initVideoPlayer;
window.playVideo = playVideo;
window.markVideoCompleted = markVideoCompleted;
window.nextVideo = nextVideo;