# Final Fix for Firestore Errors

## The Problem
Your app is trying to connect to the `(default)` database, but you have a `brainly` database. I've updated the code to use `brainly` database.

## What I Fixed
✅ Updated `src/firebase/config.js` to use `brainly` database explicitly
✅ Updated the connection test to use `_test` collection

## What YOU Need to Do

### Step 1: Update Security Rules for `brainly` Database

1. Go to Firebase Console → Firestore Database
2. Make sure **`brainly`** database is selected (dropdown at top)
3. Click the **"Rules"** tab
4. Replace ALL the rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow connection test collection
    match /_test/{document=**} {
      allow read, write: if true;
    }
    
    // Allow connection test collection (alternative name)
    match /_firestore_connection_test/{document=**} {
      allow read, write: if true;
    }
    
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Resources collection - users can only read/write their own resources
    match /resources/{resourceId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

5. Click **"Publish"** button

### Step 2: Enable Google Authentication

1. Go to **Authentication** → **Sign-in method**
2. Click on **Google**
3. Toggle **"Enable"** ON
4. Add a project support email
5. Click **Save**

### Step 3: Restart Dev Server

1. Stop your dev server (Ctrl+C)
2. Run: `npm run dev`
3. Refresh your browser

## After This
The errors should stop! The app will now:
- Connect to the `brainly` database (not default)
- Use proper security rules
- Work with Google Authentication

