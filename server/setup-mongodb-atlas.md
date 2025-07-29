# MongoDB Atlas Setup Guide

## Quick Setup for MongoDB Atlas (Cloud Database)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/atlas
2. Click "Try Free" and create an account
3. Choose "Free" tier (M0)

### Step 2: Create a Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region close to you
5. Click "Create"

### Step 3: Set Up Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### Step 4: Set Up Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### Step 5: Get Your Connection String
1. Go back to "Database" in the left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string

### Step 6: Update Your .env File
Replace the MONGODB_URI in your `.env` file with the connection string from Step 5:

```env
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/job-portal?retryWrites=true&w=majority
```

Replace:
- `yourusername` with your database username
- `yourpassword` with your database password
- `cluster0.xxxxx.mongodb.net` with your actual cluster URL

### Step 7: Test the Connection
Run your server again:
```bash
npm run dev
```

You should see: "MongoDB Connected: cluster0.xxxxx.mongodb.net" 