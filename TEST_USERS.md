# Creating Test Users

## Quick Guide to Create Test Users

### Method 1: Using Firebase Console (Recommended for First Time)

#### Create Admin User:

1. **Go to Firebase Console > Authentication**
   - Click "Add user"
   - Enter email: `admin@test.com`
   - Enter password: `admin123`
   - Click "Add user"
   - **Copy the User UID** (you'll need it)

2. **Go to Firestore Database**
   - Click "Start collection" or navigate to `users` collection
   - Document ID: Paste the User UID from step 1
   - Add fields:
     ```
     uid: (string) - Paste the same UID
     name: (string) - "Admin User"
     email: (string) - "admin@test.com"
     role: (string) - "admin"
     active: (boolean) - true
     createdAt: (timestamp) - Click and select "timestamp"
     ```
   - Click "Save"

#### Create Student User:

1. **Go to Firebase Console > Authentication**
   - Click "Add user"
   - Enter email: `student@test.com`
   - Enter password: `student123`
   - Click "Add user"
   - **Copy the User UID**

2. **Go to Firestore Database**
   - Navigate to `users` collection
   - Click "Add document"
   - Document ID: Paste the User UID from step 1
   - Add fields:
     ```
     uid: (string) - Paste the same UID
     prn: (string) - "PRN123456"
     name: (string) - "Test Student"
     email: (string) - "student@test.com"
     role: (string) - "student"
     branch: (string) - "Computer Engineering"
     year: (number) - 3
     semester: (number) - 6
     active: (boolean) - true
     createdAt: (timestamp) - Click and select "timestamp"
     ```
   - Click "Save"

### Method 2: Using Admin Dashboard (After Creating Admin)

Once you have an admin user, you can:
1. Login as admin
2. Go to "Manage Students"
3. Click "+ Add New Student"
4. Fill in the form and create students directly

### Method 3: Using Browser Console (Advanced)

After logging in as admin, open browser console and run:

```javascript
// You'll need to import the functions first
// This is more complex, Method 1 or 2 is recommended
```

## Troubleshooting Login Issues

### Issue: "User data not found"
- **Cause**: User exists in Authentication but not in Firestore
- **Fix**: Create the corresponding document in Firestore `/users` collection with the user's UID

### Issue: "PRN not found" (Student login)
- **Cause**: Student user doesn't have a `prn` field in Firestore
- **Fix**: Ensure the student document has a `prn` field

### Issue: "Unauthorized for this section"
- **Cause**: User's `role` field doesn't match (e.g., trying to login as admin with student role)
- **Fix**: Check the `role` field in Firestore matches what you're trying to access

### Issue: "Access disabled"
- **Cause**: User's `active` field is `false`
- **Fix**: Set `active: true` in the user's Firestore document

### Issue: "Permission denied" errors
- **Cause**: Firestore security rules are blocking access
- **Fix**: 
  1. Check Firestore rules are published correctly
  2. For development, you can temporarily use:
     ```
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /{document=**} {
           allow read, write: if request.auth != null;
         }
       }
     }
     ```
  3. **IMPORTANT**: Change back to proper rules before production!

## Testing Checklist

- [ ] Admin user created in Authentication
- [ ] Admin user document exists in Firestore `/users` with `role: "admin"`
- [ ] Admin can login at `/login?role=admin`
- [ ] Student user created in Authentication
- [ ] Student user document exists in Firestore `/users` with `role: "student"` and `prn` field
- [ ] Student can login at `/login?role=student` using PRN
- [ ] Admin can access `/admin` dashboard
- [ ] Student can access `/student` dashboard

## Quick Test Credentials

### Admin
- Email: `admin@test.com`
- Password: `admin123`

### Student
- PRN: `PRN123456`
- Email: `student@test.com` (auto-filled)
- Password: `student123`

**Note**: These are example credentials. Create your own using the methods above!

