const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

// Initialize the Firebase Admin SDK
initializeApp();

/**
 * Creates a new student auth user and their Firestore document.
 * This function can only be called by an authenticated admin.
 */
exports.createNewStudent = onCall(async (request) => {
  // 1. Check if the person calling this function is an admin.
  //    (This requires setting a custom claim, but for now we'll check Firestore)
  const adminUid = request.auth.uid;
  if (!adminUid) {
    throw new HttpsError('unauthenticated', 'You must be logged in to create a user.');
  }

  const adminDoc = await getFirestore().collection('users').doc(adminUid).get();
  if (!adminDoc.exists || adminDoc.data().role !== 'admin') {
    throw new HttpsError('permission-denied', 'Only admins can create new students.');
  }

  // 2. Get the new student's data from the app
  const { email, password, prn, name, branch, year, semester } = request.data;

  // Basic validation
  if (!email || !password || !prn || !name) {
     throw new HttpsError('invalid-argument', 'Missing required fields: email, password, PRN, and name.');
  }

  try {
    // 3. Create the new user in Firebase Authentication
    const userRecord = await getAuth().createUser({
      email: email,
      password: password,
      displayName: name,
    });

    // 4. Create the user's document in the Firestore 'users' collection
    await getFirestore().collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      prn: prn,
      name: name,
      email: email,
      branch: branch || "N/A", // Set default if empty
      year: year || "N/A",     // Set default if empty
      semester: semester || "N/A", // Set default if empty
      role: 'student',
      active: true, // Set new students as active by default
      createdAt: new Date(),
    });

    // 5. (Optional but good practice) Set their custom claim
    // This makes security rules much easier
    await getAuth().setCustomUserClaims(userRecord.uid, { role: 'student' });

    // 6. Send a success message back to the app
    return { success: true, uid: userRecord.uid };

  } catch (error) {
    // Handle errors (e.g., "email-already-exists")
    throw new HttpsError('internal', error.message);
  }
});

/**
 * Sets a user's role (e.g., 'admin') as a custom auth claim.
 * This can only be called by an existing admin.
 */
exports.setUserRole = onCall(async (request) => {
    // 1. Check if the caller is an admin
    const adminUid = request.auth.uid;
    if (!adminUid) {
      throw new HttpsError('unauthenticated', 'You must be logged in.');
    }
    const adminDoc = await getFirestore().collection('users').doc(adminUid).get();
    if (!adminDoc.exists || adminDoc.data().role !== 'admin') {
      throw new HttpsError('permission-denied', 'Only admins can set roles.');
    }
  
    // 2. Get the target user's email and the role to set
    const { email, role } = request.data;
    if (!email || !role) {
      throw new HttpsError('invalid-argument', 'Missing email or role.');
    }
  
    try {
      // 3. Get the target user's auth account by their email
      const user = await getAuth().getUserByEmail(email);
  
      // 4. Set the custom claim
      await getAuth().setCustomUserClaims(user.uid, { role: role });
  
      // 5. Send success message
      return { success: true, message: `Role '${role}' set for ${email}` };
    } catch (error) {
      throw new HttpsError('internal', error.message);
    }
  });

  /**
 * Deletes a student's Auth account and their Firestore document.
 * This can only be called by an authenticated admin.
 */
// exports.deleteStudent = onCall(async (request) => {
//     // 1. Check if the caller is an admin
//     const adminUid = request.auth.uid;
//     if (!adminUid) {
//       throw new HttpsError('unauthenticated', 'You must be logged in.');
//     }
//     const adminDoc = await getFirestore().collection('users').doc(adminUid).get();
//     if (!adminDoc.exists || adminDoc.data().role !== 'admin') {
//       throw new HttpsError('permission-denied', 'Only admins can delete users.');
//     }
  
//     // 2. Get the student's UID and Doc ID to delete
//     const { studentUid, studentDocId } = request.data;
//     if (!studentUid || !studentDocId) {
//       throw new HttpsError('invalid-argument', 'Missing student UID or Doc ID.');
//     }
  
//     try {
//       // 3. Delete the user from Firebase Authentication
//       await getAuth().deleteUser(studentUid);
  
//       // 4. Delete the user from Firestore
//       await getFirestore().collection('users').doc(studentDocId).delete();
  
//       return { success: true, message: `Successfully deleted user ${studentUid}` };
//     } catch (error) {
//       // If it fails, log the error
//       console.error("Error deleting student:", error);
//       throw new HttpsError('internal', error.message);
//     }
//   });