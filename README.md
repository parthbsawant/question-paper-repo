# Cloud-Based Academic Question Paper Repository

A professional, responsive React.js + Firebase web application for managing and accessing academic question papers. College admins can upload and manage question papers, while students can securely log in using their PRN to view, search, preview, and download papers.

## 🚀 Features

### For Students
- **PRN-based Authentication**: Secure login using Permanent Registration Number
- **Advanced Search**: Filter papers by year, semester, branch, and exam type
- **PDF Viewer**: Built-in PDF viewer with page navigation
- **Download Access**: Secure download links for all accessible papers
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### For Admins
- **Paper Management**: Upload, edit, and delete question papers
- **Student Management**: Create, disable/enable, and manage student accounts
- **Advanced Filters**: Filter papers by branch, year, semester, and subject
- **Audit Logging**: Track all admin actions
- **File Storage**: Secure cloud storage with organized folder structure

## 🛠️ Tech Stack

- **Frontend**: React.js 18 (JSX, no TypeScript)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase
  - Authentication (Email/Password)
  - Firestore (Database)
  - Storage (File Storage)
  - Hosting (Deployment)
- **Routing**: React Router DOM v6
- **PDF Viewer**: react-pdf
- **Notifications**: react-toastify

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js (v16 or higher) and npm installed
- A Firebase project set up
- Firebase Authentication enabled (Email/Password)
- Firestore Database initialized
- Firebase Storage enabled

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd QuestionPaperRepository
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication (Email/Password method)
4. Create a Firestore database
5. Enable Storage
6. Go to Project Settings > General > Your apps > Web app
7. Copy your Firebase configuration

### 4. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Firestore Security Rules

Update your Firestore security rules in Firebase Console:

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

### 6. Firebase Storage Rules

Update your Storage security rules:

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

### 7. Create First Admin User

You need to create your first admin user manually:

1. Go to Firebase Console > Authentication
2. Add a user with email/password
3. Go to Firestore and create a document in `/users` collection with document ID = user's UID
4. Set the following fields:
   ```json
   {
     "uid": "user_uid_here",
     "name": "Admin Name",
     "email": "admin@example.com",
     "role": "admin",
     "active": true,
     "createdAt": "timestamp"
   }
   ```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📦 Deployment to Firebase Hosting

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize Firebase Hosting

```bash
firebase init hosting
```

Select:
- Use existing project (select your Firebase project)
- Public directory: `dist`
- Configure as single-page app: Yes
- Set up automatic builds: No

### 4. Deploy

```bash
npm run build
firebase deploy --only hosting
```

Your app will be deployed to `https://your-project-id.web.app`

## 📁 Project Structure

```
src/
  ├── components/
  │   ├── admin/
  │   │   ├── AdminDashboard.jsx
  │   │   ├── UploadForm.jsx
  │   │   ├── ManagePapers.jsx
  │   │   └── ManageStudents.jsx
  │   ├── auth/
  │   │   └── PrivateRoute.jsx
  │   ├── layout/
  │   │   ├── Header.jsx
  │   │   └── Footer.jsx
  │   └── student/
  │       ├── StudentDashboard.jsx
  │       └── PdfViewer.jsx
  ├── pages/
  │   ├── Home.jsx
  │   └── Login.jsx
  ├── styles/
  │   └── index.css
  ├── utils/
  │   └── firebase.js
  ├── App.jsx
  └── main.jsx
```

## 🔐 User Roles

### Admin
- Full access to all features
- Can upload, edit, and delete papers
- Can create, disable, and delete student accounts
- Access to audit logs

### Student
- Access to view and download papers
- Can search papers by filters
- PRN-based login
- Access can be disabled by admin

## 📊 Firestore Collections

### `/users`
- Stores user information (admins and students)
- Fields: `uid`, `name`, `email`, `prn`, `role`, `branch`, `year`, `semester`, `active`, `createdAt`

### `/papers`
- Stores question paper metadata
- Fields: `subject`, `branch`, `year`, `semester`, `examType`, `fileURL`, `filePath`, `uploadedBy`, `uploadedAt`

### `/auditLogs`
- Tracks admin actions
- Fields: `actorUid`, `actorName`, `action`, `targetId`, `timestamp`

## 🎨 Customization

### Colors
The app uses a navy blue and teal color scheme. To customize, edit `tailwind.config.js`:

```javascript
colors: {
  navy: {
    DEFAULT: '#0b3d91',
    light: '#0d4ba3',
    dark: '#0a3278',
  },
  teal: {
    DEFAULT: '#06b6d4',
    light: '#22d3ee',
    dark: '#0891b2',
  },
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Firebase configuration errors**
   - Ensure all environment variables are set correctly
   - Check that Firebase project settings match your `.env` file

2. **Authentication errors**
   - Verify that Email/Password authentication is enabled in Firebase Console
   - Check that user exists in Firestore `/users` collection

3. **File upload errors**
   - Check Firebase Storage rules
   - Verify file size is under 25MB
   - Ensure file is PDF format

4. **PDF viewer not loading**
   - Check browser console for CORS errors
   - Verify Firebase Storage download URLs are accessible

## 📝 License

This project is created for academic purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ using React.js and Firebase**

