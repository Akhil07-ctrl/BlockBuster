# Render Deployment Guide for BlockBuster

## Overview
This guide explains how to deploy the BlockBuster application on Render. The application consists of two separate services: Backend (Node.js) and Frontend (React).

## Prerequisites
- GitHub repository: `https://github.com/Akhil07-ctrl/BlockBuster`
- Render account
- MongoDB Atlas database (or other MongoDB hosting)
- Clerk account for authentication

## Deployment Steps

### 1. Deploy Backend (Web Service)

1. **Create New Web Service** on Render
2. **Connect Repository**: Select `BlockBuster` from GitHub
3. **Configure Service**:
   - **Name**: `blockbuster-backend`
   - **Region**: Choose closest to your MongoDB
   - **Branch**: `main`
   - **Root Directory**: Leave empty (or `/`)
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`

4. **Environment Variables**:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/blockbuster
   CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...
   NODE_ENV=production
   ```

5. **Deploy** and wait for build to complete
6. **Note the URL**: e.g., `https://blockbuster-backend.onrender.com`

### 2. Deploy Frontend (Static Site)

1. **Create New Static Site** on Render
2. **Connect Repository**: Select `BlockBuster` from GitHub
3. **Configure Service**:
   - **Name**: `blockbuster-frontend`
   - **Branch**: `main`
   - **Root Directory**: Leave empty (or `/`)
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/dist`

4. **Environment Variables**:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
   VITE_API_URL=https://blockbuster-backend.onrender.com/api
   ```

5. **Deploy** and wait for build

### 3. Update Frontend API URL

Before deploying frontend, update the API base URL:

**File**: `client/src/api/index.js`
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

Commit and push this change.

## Troubleshooting

### Build Command Error
If you see `src/yarn: No such file or directory`:
- Ensure Build Command is: `cd server && npm install` (for backend)
- Ensure Build Command is: `cd client && npm install && npm run build` (for frontend)

### CORS Issues
Make sure backend allows frontend origin in CORS configuration.

### MongoDB Connection
- Use MongoDB Atlas connection string
- Whitelist Render's IP or use `0.0.0.0/0` (not recommended for production)

## Post-Deployment

1. Test the API at: `https://your-backend.onrender.com`
2. Test the Frontend at: `https://your-frontend.onrender.com`
3. Populate database using Postman pointing to production API
4. Test booking flow end-to-end

## Free Tier Limitations

Render's free tier:
- **Web Services** sleep after 15 minutes of inactivity
- First request may take 30-60 seconds to wake up
- **Static Sites** don't sleep

For production, consider upgrading to paid tier.
