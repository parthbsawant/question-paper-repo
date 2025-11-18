/**
 * Script to create an admin user via Firebase Admin SDK
 * 
 * NOTE: This requires Firebase Admin SDK setup.
 * For most users, it's easier to use Firebase Console (see QUICK_START.md)
 * 
 * To use this script:
 * 1. Install firebase-admin: npm install firebase-admin
 * 2. Create a service account key in Firebase Console
 * 3. Set GOOGLE_APPLICATION_CREDENTIALS environment variable
 * 4. Run: node scripts/createAdminUser.js
 */

// This is a template - you'll need to set up Firebase Admin SDK first
console.log(`
╔══════════════════════════════════════════════════════════╗
║  Admin User Creation Script                             ║
╚══════════════════════════════════════════════════════════╝

For now, please use Firebase Console to create users.
See QUICK_START.md for step-by-step instructions.

The easiest way:
1. Firebase Console → Authentication → Add user
2. Firebase Console → Firestore → Create document in 'users' collection
3. Use the User UID as document ID
4. Add fields: uid, name, email, role, active

Or use the Admin Dashboard after creating your first admin!
`);

