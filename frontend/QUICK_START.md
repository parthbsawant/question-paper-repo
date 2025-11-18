# 🚀 Quick Start - Create Your First Users

## Step 1: Create Admin User (Required First)

### Option A: Using Firebase Console (Easiest)

1. **Go to Firebase Console** → Your Project → **Authentication**
2. Click **"Add user"** or **"Create user"**
3. Enter:
   - Email: `admin@college.edu` (or any email you want)
   - Password: `admin123` (or your preferred password)
4. Click **"Add user"**
5. **IMPORTANT**: Copy the **User UID** (long string) - you'll need it next!

6. **Go to Firestore Database**
   - Click **"Start collection"** (if first time)
   - Collection ID: `users`
   - Document ID: **Paste the User UID from step 5**
   - Click **"Save"**

7. **Add fields to the document:**
   - Click **"Add field"** for each:
     - `uid` → Type: string → Value: (paste UID again)
     - `name` → Type: string → Value: `Admin User`
     - `email` → Type: string → Value: `admin@college.edu` (same as step 3)
     - `role` → Type: string → Value: `admin`
     - `active` → Type: boolean → Value: `true`
     - `createdAt` → Type: timestamp → Click and select current time

8. Click **"Save"**

✅ **Admin user created!** You can now login at `/login?role=admin`

---

## Step 2: Create Student User

### Option A: Using Admin Dashboard (Recommended)

1. **Login as admin** using the credentials from Step 1
2. Go to **"Manage Students"** tab
3. Click **"+ Add New Student"**
4. Fill in the form:
   - **PRN**: `PRN001` (or any PRN you want)
   - **Name**: `Test Student`
   - **Email**: `student@test.com` (must be unique)
   - **Password**: `student123` (min 6 characters)
   - **Branch**: `Computer Engineering` (optional)
   - **Year**: `3` (optional)
   - **Semester**: `6` (optional)
   - **Active**: ✅ Checked
5. Click **"Create Student Account"**

✅ **Student created!** You can now login at `/login?role=student` using:
   - **PRN**: `PRN001`
   - **Password**: `student123`

---

### Option B: Using Firebase Console (Manual)

1. **Authentication** → Add user:
   - Email: `student@test.com`
   - Password: `student123`

2. **Copy the User UID**

3. **Firestore** → `users` collection → Add document:
   - Document ID: (paste UID)
   - Fields:
     - `uid`: (paste UID)
     - `prn`: `PRN001`
     - `name`: `Test Student`
     - `email`: `student@test.com`
     - `role`: `student`
     - `branch`: `Computer Engineering`
     - `year`: `3`
     - `semester`: `6`
     - `active`: `true`
     - `createdAt`: (current timestamp)

---

## Step 3: Update Security Rules

**Before you can use the app, update Firestore rules:**

1. Go to **Firestore Database** → **Rules**
2. Copy the rules from `FIRESTORE_RULES_DEV.md`
3. Paste and click **"Publish"**

---

## Test Credentials (After Setup)

### Admin Login
- URL: `http://localhost:5173/login?role=admin`
- Email: `admin@college.edu`
- Password: `admin123`

### Student Login
- URL: `http://localhost:5173/login?role=student`
- PRN: `PRN001`
- Password: `student123`

---

## Troubleshooting

**"PRN not found"** → Student document doesn't exist or missing `prn` field

**"User data not found"** → User exists in Authentication but not in Firestore

**"Permission denied"** → Security rules need to be updated (see Step 3)

**"Unauthorized"** → Role field doesn't match (check `role` is `admin` or `student`)

