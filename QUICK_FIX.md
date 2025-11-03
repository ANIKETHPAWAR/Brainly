# Quick Fix for Firestore 400 Errors

## The Issue
The 400 Bad Request errors mean Firestore is trying to connect but can't access the database. This happens when:
1. Firestore database hasn't been created
2. Security rules are blocking access
3. Database is in wrong mode

## Quick Fix Steps

### Step 1: Create Firestore Database
1. Go to https://console.firebase.google.com
2. Select project: **moneyrapidloan-fcfee**
3. Click **Firestore Database** in left menu
4. If you see "Get started" → Click it
5. Choose **Start in test mode**
6. Pick a location (choose closest to you)
7. Click **Enable**

### Step 2: Update Security Rules
After creating the database:
1. Go to **Firestore Database** → **Rules** tab
2. Click **Edit rules**
3. Replace with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /resources/{resourceId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

4. Click **Publish**

### Step 3: Verify Authentication
1. Go to **Authentication** → **Sign-in method**
2. Find **Google** → Click it
3. Toggle **Enable** ON
4. Add support email
5. Click **Save**

### Step 4: Restart Dev Server
1. Stop server: Press `Ctrl+C` in terminal
2. Run: `npm run dev`
3. Refresh browser

## What Changed in Code
I've added:
- ✅ Timeout handling (5 seconds) for Firestore requests
- ✅ Better error suppression (won't break app)
- ✅ App works without Firestore (auth still works)

The errors will stop once Firestore is properly set up. Until then, the app will work but Firestore features won't be available.

