# Firestore Security Rules for Development

## Issue with Current Rules

The security rules in the README use `request.auth.token.role`, which requires Firebase Custom Claims. For development, we need rules that check Firestore directly.

## Development Rules (Temporary - Use for Testing)

**⚠️ IMPORTANT**: These rules are less secure and should only be used for development/testing. For production, you MUST use custom claims with the production rules.

### Firestore Rules (Development Version)

Go to **Firestore Database** > **Rules** and paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to get user role from Firestore
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    // Helper function to check if user is active
    function isUserActive() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.active == true;
    }
    
    match /users/{uid} {
      // Users can read their own data, or if they're admin
      allow read: if request.auth != null && 
        (request.auth.uid == uid || getUserRole() == 'admin');
      
      // Users can write their own data, or admins can write any user data
      allow write: if request.auth != null && 
        (request.auth.uid == uid || getUserRole() == 'admin');
    }
    
    match /papers/{paperId} {
      // Any authenticated user can read papers
      allow read: if request.auth != null && isUserActive();
      
      // Only admins can write/update/delete papers
      allow write, update, delete: if request.auth != null && 
        getUserRole() == 'admin' && isUserActive();
    }
    
    match /auditLogs/{logId} {
      // Only admins can read/write audit logs
      allow read, write: if request.auth != null && 
        getUserRole() == 'admin' && isUserActive();
    }
  }
}
```

### Storage Rules (Development Version)

Go to **Storage** > **Rules** and paste this:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Helper function to get user role (requires reading Firestore)
    function getUserRole() {
      return firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role;
    }
    
    match /question_papers/{allPaths=**} {
      // Any authenticated user can read
      allow read: if request.auth != null;
      
      // Only admins can write
      allow write: if request.auth != null && getUserRole() == 'admin';
    }
  }
}
```

## Even Simpler Rules (For Quick Testing Only)

**⚠️ VERY INSECURE - Only use if above doesn't work**

If you're still having issues, use these **ONLY FOR TESTING**:

### Firestore Rules (Open for Testing)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage Rules (Open for Testing)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Remember**: Change these back to proper rules before deploying to production!

## Production Rules (With Custom Claims)

Once you set up custom claims via Cloud Functions, use the rules from README.md that check `request.auth.token.role`.

## Common Issues

1. **"Missing or insufficient permissions"**
   - Check that rules are published
   - Verify user is authenticated
   - For development rules, ensure user document exists in Firestore

2. **Rules not updating**
   - Make sure you clicked "Publish" after editing
   - Wait a few seconds for changes to propagate
   - Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

3. **Storage rules failing**
   - Storage rules that read Firestore can be slow
   - Make sure Firestore rules allow reading user documents
   - Consider using simpler rules for development

