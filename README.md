# 🌙 Lunetix — AI Learning Platform

Platform pembelajaran AI dengan courses interaktif, AI playground, dan real-world projects.

## 🚀 Tech Stack

- **Frontend:** Vanilla JS, HTML, CSS
- **Backend:** Node.js + Express
- **Database:** Supabase (PostgreSQL)
- **Deploy:** Vercel

## 📦 Deploy ke Production

### 1. Database Setup
Jalankan migrations di Supabase SQL Editor:
```sql
backend/supabase/migrations/add_course_student_count_function.sql
backend/supabase/migrations/add_quiz_points_tracking.sql
backend/supabase/migrations/add_lesson_points_tracking.sql
```

### 2. Supabase Config
- Authentication → Email Templates → Enable Email Confirmations

### 3. Vercel Environment Variables
```env
NODE_ENV=production
ALLOWED_ORIGINS=https://your-domain.vercel.app
SITE_URL=https://your-domain.vercel.app
GROQ_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
JWT_SECRET=your_secret
```

### 4. Deploy
```bash
git push origin main
```

## ✅ Production Ready

- ✅ Password min 8 characters
- ✅ Email verification
- ✅ HTTPS enforcement
- ✅ XSS protection
- ✅ CORS whitelist
- ✅ Rate limiting (serverless)
- ✅ Race condition fixes
- ✅ Global error handling
- ✅ Offline detection

## 📁 Structure

```
frontend/        ← HTML, CSS, JS
backend/         ← Express API
  src/
    controllers/ ← Business logic
    routes/      ← API routes
    middleware/  ← Auth, etc
  supabase/
    migrations/  ← Database migrations
```
