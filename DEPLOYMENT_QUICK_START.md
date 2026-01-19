# Quick Deployment Guide - Render

## 🚀 Deploy AI Service on Render (5 Steps)

### Step 1: Push Code to GitHub
```bash
cd bug-tracker-ai
git add .
git commit -m "AI service ready for Render"
git push
```

### Step 2: Create Render Web Service
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `bug-tracker-ai`
   - **Root Directory**: `bug-tracker-ai`
   - **Environment**: Python 3
   - Build/Start commands auto-detected from `render.yaml`

### Step 3: Wait for Deployment
- ⏱️ First build: **10-15 minutes** (downloading ML models)
- ✅ Subsequent builds: **2-3 minutes**

### Step 4: Get Your Service URL
After deployment, copy the URL:
```
https://bug-tracker-ai-xxxx.onrender.com
```

### Step 5: Update Java Backend
In your Java backend's Render environment variables, add:
```
AI_SERVICE_URL=https://bug-tracker-ai-xxxx.onrender.com
```

**Done!** Your AI service is now live! 🎉

---

## 🧪 Test It

```bash
# Health check
curl https://bug-tracker-ai-xxxx.onrender.com/health

# Test AI
curl -X POST https://bug-tracker-ai-xxxx.onrender.com/analyze/comprehensive \
  -H "Content-Type: application/json" \
  -d '{"text": "Application crashes on submit"}'
```

---

## ⚠️ Important Notes

1. **Free Tier**: Service spins down after 15 min inactivity (cold start ~30-60s)
2. **Memory**: ML models need ~500MB+ RAM (free tier has 512MB)
3. **First Request**: May be slow due to model loading
4. **Environment Variable**: Java backend uses `AI_SERVICE_URL` (already configured!)

---

## 📋 Files Needed

Your `bug-tracker-ai/` folder should have:
- ✅ `main.py`
- ✅ `requirements.txt`
- ✅ `render.yaml`
- ✅ `.gitignore` (optional)

That's it! Render handles the rest.

