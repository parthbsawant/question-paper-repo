# Quick Setup Guide

## Step-by-Step Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" or select an existing project
3. Follow the setup wizard

### 3. Enable Firebase Services

#### Authentication
- Go to **Authentication** > **Sign-in method**
- Enable **Email/Password** provider
- Save

#### Firestore Database
- Go to **Firestore Database**
- Click **Create database**
- Start in **test mode** (we'll update rules later)
- Choose a location
- Click **Enable**

#### Storage
- Go to **Storage**
- Click **Get started**
- Start in **test mode**
- Choose the same location as Firestore
- Click **Done**

### 4. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps**
3. Click **</>** (Web icon)
4. Register app (nickname: "Question Paper Repo")
5. Copy the config values

### 5. Create Environment File

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` and paste your Firebase config:
```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 6. Update Firestore Security Rules

Go to **Firestore Database** > **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        (request.auth.token.role == 'admin' || request.auth.uid == uid);
    }
    match /papers/{paperId} {
      allow read: if request.auth != null;
      allow write, update, delete: if request.auth != null &&
        request.auth.token.role == 'admin';
    }
    match /auditLogs/{logId} {
      allow read, write: if request.auth != null &&
        request.auth.token.role == 'admin';
    }
  }
}
```

Click **Publish**.

### 7. Update Storage Security Rules

Go to **Storage** > **Rules** and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /question_papers/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role == 'admin';
    }
  }
}
```

Click **Publish**.

**Note**: For production, you'll need to set up custom claims for roles. See Firebase documentation.

### 8. Create First Admin User

#### Option A: Using Firebase Console
1. Go to **Authentication** > **Users**
2. Click **Add user**
3. Enter email and password
4. Note the User UID

#### Option B: Using Firebase CLI
```bash
firebase auth:export users.json
# Edit the file to add your admin user
firebase auth:import users.json
```

Then create Firestore document:
1. Go to **Firestore Database**
2. Create collection: `users`
3. Create document with ID = your User UID
4. Add these fields:
   - `uid` (string): Your User UID
   - `name` (string): "Admin Name"
   - `email` (string): "admin@example.com"
   - `role` (string): "admin"
   - `active` (boolean): true
   - `createdAt` (timestamp): Current timestamp

### 9. Set Up Custom Claims (For Production)

Custom claims are needed for security rules to work. You'll need a Cloud Function:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.setUserRole = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  // Verify user is admin in Firestore
  const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
  if (!userDoc.exists || userDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can set roles');
  }
  
  // Set custom claim
  await admin.auth().setCustomUserClaims(data.uid, { role: data.role });
  
  return { success: true };
});
```

**For Development**: You can temporarily modify rules to check Firestore directly, but for production, use custom claims.

### 10. Run the Application

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 11. Test the Application

1. Go to `/login?role=admin`
2. Login with your admin credentials
3. Create a test student account
4. Upload a test paper
5. Logout and login as student
6. Search and view papers

## Troubleshooting

### "Permission denied" errors
- Check that security rules are published
- Verify user has correct role in Firestore
- For production, ensure custom claims are set

### PDF not loading
- Check Firebase Storage rules
- Verify file was uploaded successfully
- Check browser console for CORS errors

### Authentication errors
- Verify Email/Password is enabled
- Check that user exists in Firestore `/users` collection
- Ensure `active` field is `true`

## Next Steps

- Customize colors in `tailwind.config.js`
- Update contact information in `Footer.jsx`
- Deploy to Firebase Hosting (see README.md)
- Set up Google reCAPTCHA for student login
- Configure email verification if needed

