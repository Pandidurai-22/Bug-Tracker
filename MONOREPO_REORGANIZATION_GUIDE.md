# 🗂️ Monorepo Reorganization Guide

## Goal: Convert to Monorepo Structure

**Current Structure:**
```
bug-tracker-backend/  (GitHub repo)
├── src/
├── pom.xml
├── README.md
└── ... (backend files at root)
```

**Target Structure:**
```
bug-tracker-backend/  (Same GitHub repo)
├── backend/          ← Backend code (moved from root)
├── frontend/         ← React app (from bug-tracker-client)
├── ai-service/       ← AI service (from bug-tracker-ai)
└── README.md         ← Updated README
```

---

## 📋 Step-by-Step Instructions (Windows PowerShell)

### ⚠️ IMPORTANT: Do this in your GitHub repo folder

Open PowerShell in your `bug-tracker-backend` folder (the one connected to GitHub).

---

### STEP 1️⃣: Navigate to Your Repo

```powershell
cd "G:\Bug tracker Project\bug-tracker-backend"
```

Verify you're in the right place:
```powershell
git status
```

You should see your backend files.

---

### STEP 2️⃣: Create Backend Folder and Move Files

**Create backend folder:**
```powershell
mkdir backend
```

**Move backend files into backend/ folder:**
```powershell
# Move main backend files
Move-Item -Path src, pom.xml, mvnw, mvnw.cmd, Dockerfile, HELP.md, assets -Destination backend/ -Force

# Move .mvn folder if it exists
if (Test-Path .mvn) { Move-Item -Path .mvn -Destination backend/ -Force }

# Move target folder (optional - can delete if you want)
if (Test-Path target) { Move-Item -Path target -Destination backend/ -Force }
```

**Verify:**
```powershell
ls backend/
```

You should see: `src`, `pom.xml`, `mvnw`, etc.

---

### STEP 3️⃣: Copy Frontend Folder

**From your project root, copy frontend:**
```powershell
# Go back to project root
cd "G:\Bug tracker Project"

# Copy frontend folder into backend repo
Copy-Item -Path "bug-tracker-client" -Destination "bug-tracker-backend\frontend" -Recurse

# Go back to repo
cd "bug-tracker-backend"
```

**Verify:**
```powershell
ls frontend/
```

You should see: `src`, `package.json`, `public`, etc.

---

### STEP 4️⃣: Copy AI Service Folder

**Copy AI service:**
```powershell
# From project root
cd "G:\Bug tracker Project"

# Copy AI service folder
Copy-Item -Path "bug-tracker-ai" -Destination "bug-tracker-backend\ai-service" -Recurse

# Go back to repo
cd "bug-tracker-backend"
```

**Verify:**
```powershell
ls ai-service/
```

You should see: `main.py`, `requirements.txt`, `render.yaml`, etc.

---

### STEP 5️⃣: Update README.md

Now update your existing README.md to reflect the new structure.

**Your repo structure should now be:**
```
bug-tracker-backend/
├── backend/
├── frontend/
├── ai-service/
└── README.md
```

---

### STEP 6️⃣: Commit and Push

```powershell
# Check what changed
git status

# Add all changes
git add .

# Commit
git commit -m "Reorganize into monorepo structure: backend, frontend, and ai-service"

# Push to GitHub
git push origin main
```

---

## ✅ Verification Checklist

After completing the steps:

- [ ] `backend/` folder exists with `src`, `pom.xml`, etc.
- [ ] `frontend/` folder exists with `src`, `package.json`, etc.
- [ ] `ai-service/` folder exists with `main.py`, `requirements.txt`, etc.
- [ ] `README.md` is still at root (will update next)
- [ ] Git status shows all changes
- [ ] Changes pushed to GitHub

---

## 🎯 Next: Update README.md

I'll create an updated README for you that reflects the monorepo structure!

