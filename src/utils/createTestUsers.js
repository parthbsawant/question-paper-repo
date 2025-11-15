/**
 * Utility script to create test users
 * 
 * This file contains helper functions to create test users for development.
 * You can call these functions from the browser console after logging in as admin.
 * 
 * Usage in browser console (after admin login):
 * 
 * import { createTestStudent, createTestAdmin } from './utils/createTestUsers.js';
 * 
 * Or use Firebase Console directly:
 * 1. Go to Authentication > Add user (for email/password)
 * 2. Go to Firestore > users collection > Add document with UID = Auth user's UID
 */

import { db, auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

/**
 * Creates a test student user
 * @param {Object} studentData - Student information
 * @param {string} studentData.prn - PRN number
 * @param {string} studentData.name - Student name
 * @param {string} studentData.email - Student email
 * @param {string} studentData.password - Student password
 * @param {string} studentData.branch - Branch name
 * @param {number} studentData.year - Year
 * @param {number} studentData.semester - Semester
 */
export async function createTestStudent(studentData) {
  try {
    const { prn, name, email, password, branch, year, semester } = studentData;

    // Check if PRN already exists
    const { collection, query, where, getDocs } = await import("firebase/firestore");
    const q = query(collection(db, "users"), where("prn", "==", prn));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      throw new Error("PRN already exists");
    }

    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Create Firestore document
    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      prn: prn,
      name: name,
      email: email,
      role: "student",
      branch: branch || "",
      year: year || null,
      semester: semester || null,
      active: true,
      createdAt: serverTimestamp(),
      accessExpiry: null,
    });

    console.log("✅ Student created successfully:", userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error("❌ Error creating student:", error);
    throw error;
  }
}

/**
 * Creates a test admin user
 * @param {Object} adminData - Admin information
 * @param {string} adminData.name - Admin name
 * @param {string} adminData.email - Admin email
 * @param {string} adminData.password - Admin password
 */
export async function createTestAdmin(adminData) {
  try {
    const { name, email, password } = adminData;

    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Create Firestore document
    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      name: name,
      email: email,
      role: "admin",
      active: true,
      createdAt: serverTimestamp(),
    });

    console.log("✅ Admin created successfully:", userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    throw error;
  }
}

// Example usage (uncomment to use):
/*
// Create test student
createTestStudent({
  prn: "PRN123456",
  name: "Test Student",
  email: "student@test.com",
  password: "test123456",
  branch: "Computer Engineering",
  year: 3,
  semester: 6
});

// Create test admin
createTestAdmin({
  name: "Test Admin",
  email: "admin@test.com",
  password: "admin123456"
});
*/

