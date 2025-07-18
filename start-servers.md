# 🚀 Start AgriTech Servers

## Quick Start Commands

### Option 1: Start Frontend (Current Directory)
```bash
npm run dev
```

### Option 2: Start Both Servers (PowerShell Commands)

#### Terminal 1 - Backend Server:
```powershell
cd ..\agri-backend
python manage.py runserver --noreload
```

#### Terminal 2 - Frontend Server:
```powershell
npm run dev
```

## 🧪 Troubleshooting Blank Page

### 1. Test React App
Visit: http://localhost:5173/?test=true

This will show a simple test page to verify React is working.

### 2. Check Browser Console
- Open browser DevTools (F12)
- Look for errors in Console tab
- Check Network tab for failed API calls

### 3. Common Issues:

#### Backend Not Running
- Error: "Unable to connect to backend"
- Solution: Start Django server on port 8000

#### Port Conflicts
- Error: Port already in use
- Solution: Kill existing processes or use different ports

#### Missing Dependencies
- Error: Module not found
- Solution: Run `npm install` in frontend directory

## 🔍 Debug URLs

- **Frontend**: http://localhost:5173
- **Frontend Test**: http://localhost:5173/?test=true  
- **Backend API**: http://127.0.0.1:8000/api
- **Django Admin**: http://127.0.0.1:8000/admin

## 📋 Checklist

- [ ] Backend server running on port 8000
- [ ] Frontend server running on port 5173
- [ ] No console errors in browser
- [ ] Can access test page (?test=true)
- [ ] Database connection working

## 🏥 Health Check

Visit the homepage. You should see:
- AgriTech header with navigation
- Category rail with icons
- Featured products from database
- "API Integration Status" card showing green checkmarks

If you see any of these issues:
- ❌ White/blank page → Check console errors
- ❌ Loading forever → Backend not running
- ❌ "Network Error" → Port/URL mismatch
- ❌ React error boundary → Dependencies issue 