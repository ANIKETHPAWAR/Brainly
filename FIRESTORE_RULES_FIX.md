# Fix Firestore Security Rules for Resources

## The Problem
You're getting "Missing or insufficient permissions" when trying to add resources. This is because the security rules need to check `request.resource.data.userId` (the data being written) instead of `resource.data.userId` (existing data).

## Solution: Update Security Rules

1. Go to **Firebase Console** → **Firestore Database**
2. Make sure **`brainly`** database is selected
3. Click the **"Rules"** tab
4. **Replace ALL rules** with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow connection test collection (no auth required for testing)
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
      // Allow read if user owns the resource
      allow read: if request.auth != null && 
                     (resource.data.userId == request.auth.uid || 
                      request.resource.data.userId == request.auth.uid);
      
      // Allow create if user is setting their own userId
      allow create: if request.auth != null && 
                        request.resource.data.userId == request.auth.uid;
      
      // Allow update/delete if user owns the resource
      allow update, delete: if request.auth != null && 
                               resource.data.userId == request.auth.uid;
    }
  }
}
```

5. Click **"Publish"** button
6. Wait a few seconds for rules to propagate
7. Try adding a resource again!

## Explanation

- **`request.resource.data.userId`** = The userId in the data you're trying to write (for CREATE operations)
- **`resource.data.userId`** = The userId in existing data (for READ/UPDATE/DELETE operations)

The rules now properly handle both creating new resources and reading/updating existing ones.

