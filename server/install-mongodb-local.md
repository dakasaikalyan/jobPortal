# Local MongoDB Installation Guide

## Installing MongoDB Community Server on Windows

### Step 1: Download MongoDB
1. Go to https://www.mongodb.com/try/download/community
2. Select:
   - Version: Latest (7.0.x)
   - Platform: Windows
   - Package: msi
3. Click "Download"

### Step 2: Install MongoDB
1. Run the downloaded .msi file
2. Choose "Complete" installation
3. **Important**: Check "Install MongoDB as a Service"
4. Complete the installation

### Step 3: Verify Installation
Open a new PowerShell window and run:
```powershell
mongod --version
```

You should see MongoDB version information.

### Step 4: Start MongoDB Service
MongoDB should start automatically as a Windows service. To verify:
1. Open Services (services.msc)
2. Look for "MongoDB" service
3. Make sure it's running

### Step 5: Test Connection
Your `.env` file should already be configured for local MongoDB:
```env
MONGODB_URI=mongodb://localhost:27017/job-portal
```

### Step 6: Start Your Server
```bash
npm run dev
```

You should see: "MongoDB Connected: localhost"

## Alternative: Using MongoDB Compass (GUI)
1. Download MongoDB Compass from: https://www.mongodb.com/try/download/compass
2. Install and open it
3. Connect to: `mongodb://localhost:27017`
4. This gives you a visual interface to manage your database 