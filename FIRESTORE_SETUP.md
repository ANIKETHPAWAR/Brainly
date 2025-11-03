# Firestore Setup Instructions

## The Error You're Seeing
The 400 Bad Request errors from Firestore indicate that either:
1. Firestore database hasn't been created/enabled
2. Firestore security rules are blocking access
3. Database is in wrong mode (Datastore vs Native)

## Step-by-Step Fix

### 1. Create Firestore Database
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `moneyrapidloan-fcfee`
3. Click on **Firestore Database** in the left sidebar
4. Click **Create Database**
5. Choose **Start in test mode** (for now - we'll update rules later)
6. Select a location (choose closest to your users)
7. Click **Enable**

### 2. Set Up Security Rules
After creating the database:

1. Go to **Firestore Database** → **Rules** tab
2. Replace the default rules with these (for testing):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Resources collection - users can only access their own resources
    match /resources/{resourceId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

3. Click **Publish**

### 3. Verify Database Mode
Make sure your Firestore is in **Native mode** (not Datastore mode):
- If you see "Datastore" anywhere, you need to create a new Firestore database
- Native mode shows "Firestore Database" (not "Cloud Datastore")

### 4. Enable Authentication
1. Go to **Authentication** → **Sign-in method**
2. Click on **Google**
3. Enable it
4. Add your project's support email
5. Save

### 5. Restart Your Dev Server
After making these changes:
- Stop your dev server (Ctrl+C)
- Run `npm run dev` again

## Testing
After completing these steps:
1. Try signing in with Google
2. The Firestore errors should stop
3. Your user profile should be created in Firestore

## Important Notes
- **Test mode rules** are temporary - they allow reads/writes for 30 days
- For production, use the security rules provided above
- Make sure Authentication is enabled before testing

