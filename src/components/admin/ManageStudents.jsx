//version_1
// import { useEffect, useState } from "react";
// import { db, auth } from "../../utils/firebase.js";
// import { getFunctions, httpsCallable } from "firebase/functions";
// import {
//   collection,
//   getDocs,
//   getDoc,
//   updateDoc,
//   doc,
//   deleteDoc,
//   addDoc,
//   serverTimestamp,
//   query,
//   where,
// } from "firebase/firestore";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { toast } from "react-toastify";

// export default function ManageStudents() {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [newStudent, setNewStudent] = useState({
//     prn: "",
//     name: "",
//     email: "",
//     password: "",
//     branch: "",
//     year: "",
//     semester: "",
//     active: true,
//   });

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const fetchStudents = async () => {
//     try {
//       setLoading(true);
//       const querySnapshot = await getDocs(
//         query(collection(db, "users"), where("role", "==", "student"))
//       );
//       const list = querySnapshot.docs.map((d) => ({
//         id: d.id,
//         ...d.data(),
//       }));
//       // Sort by PRN
//       list.sort((a, b) => (a.prn || "").localeCompare(b.prn || ""));
//       setStudents(list);
//     } catch (error) {
//       console.error("Error fetching students:", error);
//       toast.error("Error loading students");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateStudent = async (e) => {
//     e.preventDefault();
    
//     if (!newStudent.prn || !newStudent.name || !newStudent.email || !newStudent.password) {
//       toast.error("Please fill all required fields.");
//       return;
//     }

//     // Check if PRN already exists
//     const prnQuery = query(collection(db, "users"), where("prn", "==", newStudent.prn));
//     const prnSnapshot = await getDocs(prnQuery);
//     if (!prnSnapshot.empty) {
//       toast.error("PRN already exists. Please use a different PRN.");
//       return;
//     }

//     // Check if email already exists
//     const emailQuery = query(collection(db, "users"), where("email", "==", newStudent.email));
//     const emailSnapshot = await getDocs(emailQuery);
//     if (!emailSnapshot.empty) {
//       toast.error("Email already exists. Please use a different email.");
//       return;
//     }

//     try {
//       // Create Firebase Auth user
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         newStudent.email,
//         newStudent.password
//       );

//       // Create Firestore user document
//       await addDoc(collection(db, "users"), {
//         uid: userCredential.user.uid,
//         prn: newStudent.prn,
//         name: newStudent.name,
//         email: newStudent.email,
//         role: "student",
//         branch: newStudent.branch || "",
//         year: newStudent.year ? parseInt(newStudent.year) : null,
//         semester: newStudent.semester ? parseInt(newStudent.semester) : null,
//         active: newStudent.active,
//         createdAt: serverTimestamp(),
//         accessExpiry: null,
//       });

//       // Log to audit
//       try {
//         const currentUser = auth.currentUser;
//           const adminDoc = doc(db, "users", currentUser.uid);
//         const adminData = (await getDoc(adminDoc)).data();
//         await addDoc(collection(db, "auditLogs"), {
//           actorUid: currentUser.uid,
//           actorName: adminData?.name || currentUser.email,
//           action: "create_student",
//           targetId: userCredential.user.uid,
//           timestamp: serverTimestamp(),
//         });
//       } catch (auditError) {
//         console.error("Audit log error:", auditError);
//       }

//       toast.success("Student created successfully!");
//       setNewStudent({
//         prn: "",
//         name: "",
//         email: "",
//         password: "",
//         branch: "",
//         year: "",
//         semester: "",
//         active: true,
//       });
//       setShowAddForm(false);
//       fetchStudents();
//     } catch (error) {
//       console.error("Error creating student:", error);
//       toast.error("Error creating student: " + error.message);
//     }
//   };

//   const toggleAccess = async (student) => {
//     try {
//       await updateDoc(doc(db, "users", student.id), {
//         active: !student.active,
//       });
//       toast.success(`Student access ${!student.active ? "enabled" : "disabled"}!`);
//       fetchStudents();
//     } catch (error) {
//       console.error("Error updating access:", error);
//       toast.error("Error updating access: " + error.message);
//     }
//   };

//   const handleDelete = async (student) => {
//     if (
//       !window.confirm(
//         `Are you sure you want to delete student "${student.name}" (${student.prn})? This will permanently delete their account.`
//       )
//     ) {
//       return;
//     }

//     try {
//       // Delete from Firestore
//       await deleteDoc(doc(db, "users", student.id));

//       // Note: Deleting the Firebase Auth user requires admin privileges
//       // For now, we'll just remove from Firestore
//       // In production, you might want to use a Cloud Function for this

//       toast.success("Student deleted successfully!");
//       fetchStudents();
//     } catch (error) {
//       console.error("Error deleting student:", error);
//       toast.error("Error deleting student: " + error.message);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-navy">Manage Students</h2>
//         <button
//           onClick={() => setShowAddForm(!showAddForm)}
//           className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-teal-dark transition duration-200"
//         >
//           {showAddForm ? "Cancel" : "+ Add New Student"}
//         </button>
//       </div>

//       {/* Add Student Form */}
//       {showAddForm && (
//         <form
//           onSubmit={handleCreateStudent}
//           className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4"
//         >
//           <h3 className="text-lg font-semibold text-navy mb-4">Create New Student Account</h3>
//           <div className="grid md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 PRN <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={newStudent.prn}
//                 onChange={(e) => setNewStudent({ ...newStudent, prn: e.target.value })}
//                 className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={newStudent.name}
//                 onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
//                 className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Email <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="email"
//                 value={newStudent.email}
//                 onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
//                 className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Password <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="password"
//                 value={newStudent.password}
//                 onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
//                 className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
//                 required
//                 minLength="6"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
//               <input
//                 type="text"
//                 value={newStudent.branch}
//                 onChange={(e) => setNewStudent({ ...newStudent, branch: e.target.value })}
//                 className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
//                 placeholder="e.g., Computer Engineering"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
//               <input
//                 type="number"
//                 value={newStudent.year}
//                 onChange={(e) => setNewStudent({ ...newStudent, year: e.target.value })}
//                 className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
//                 placeholder="e.g., 3"
//                 min="1"
//                 max="4"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
//               <input
//                 type="number"
//                 value={newStudent.semester}
//                 onChange={(e) => setNewStudent({ ...newStudent, semester: e.target.value })}
//                 className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
//                 placeholder="e.g., 6"
//                 min="1"
//                 max="8"
//               />
//             </div>
//             <div className="flex items-center">
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   checked={newStudent.active}
//                   onChange={(e) =>
//                     setNewStudent({ ...newStudent, active: e.target.checked })
//                   }
//                   className="w-4 h-4 text-navy focus:ring-navy"
//                 />
//                 <span className="text-sm font-medium text-gray-700">Active (Enable Access)</span>
//               </label>
//             </div>
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy-dark transition duration-200"
//           >
//             Create Student Account
//           </button>
//         </form>
//       )}

//       {/* Students Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200">
//           <thead className="bg-navy text-white">
//             <tr>
//               <th className="px-4 py-3 text-left">PRN</th>
//               <th className="px-4 py-3 text-left">Name</th>
//               <th className="px-4 py-3 text-left">Email</th>
//               <th className="px-4 py-3 text-left">Branch</th>
//               <th className="px-4 py-3 text-left">Year</th>
//               <th className="px-4 py-3 text-left">Semester</th>
//               <th className="px-4 py-3 text-left">Status</th>
//               <th className="px-4 py-3 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.length === 0 ? (
//               <tr>
//                 <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
//                   No students found. Add your first student!
//                 </td>
//               </tr>
//             ) : (
//               students.map((student) => (
//                 <tr key={student.id} className="border-t hover:bg-gray-50">
//                   <td className="px-4 py-3 font-medium">{student.prn}</td>
//                   <td className="px-4 py-3">{student.name}</td>
//                   <td className="px-4 py-3 text-sm">{student.email}</td>
//                   <td className="px-4 py-3">{student.branch || "N/A"}</td>
//                   <td className="px-4 py-3">{student.year || "N/A"}</td>
//                   <td className="px-4 py-3">{student.semester || "N/A"}</td>
//                   <td className="px-4 py-3">
//                     <span
//                       className={`px-2 py-1 rounded text-sm font-semibold ${
//                         student.active
//                           ? "bg-green-100 text-green-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {student.active ? "Active" : "Disabled"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3">
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => toggleAccess(student)}
//                         className={`text-sm px-3 py-1 rounded ${
//                           student.active
//                             ? "bg-red-100 text-red-700 hover:bg-red-200"
//                             : "bg-green-100 text-green-700 hover:bg-green-200"
//                         }`}
//                       >
//                         {student.active ? "Disable" : "Enable"}
//                       </button>
//                       <button
//                         onClick={() => handleDelete(student)}
//                         className="text-red-600 hover:underline text-sm"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

//version_2
// import { useEffect, useState } from "react";
// import { db, auth } from "../../utils/firebase.js";
// import { getFunctions, httpsCallable } from "firebase/functions";
// import {
//   collection,
//   getDocs,
//   updateDoc,
//   doc,
//   deleteDoc,
//   query,
//   where,
// } from "firebase/firestore";
// // import { createUserWithEmailAndPassword } from "firebase/auth"; // We no longer use this
// import { toast } from "react-toastify";

// export default function ManageStudents() {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddForm, setShowAddForm] = useState(false);
//   // This loading state is for the form submit button
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [newStudent, setNewStudent] = useState({
//     prn: "",
//     name: "",
//     email: "",
//     password: "",
//     branch: "",
//     year: "",
//     semester: "",
//     active: true,
//   });

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const fetchStudents = async () => {
//     try {
//       setLoading(true);
//       const querySnapshot = await getDocs(
//         query(collection(db, "users"), where("role", "==", "student"))
//       );
//       const list = querySnapshot.docs.map((d) => ({
//         id: d.id,
//         ...d.data(),
//       }));
//       // Sort by PRN
//       list.sort((a, b) => (a.prn || "").localeCompare(b.prn || ""));
//       setStudents(list);
//     } catch (error) {
//       console.error("Error fetching students:", error);
//       toast.error("Error loading students");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- THIS IS THE UPDATED FUNCTION ---
//   const handleCreateStudent = async (e) => {
//     e.preventDefault();
    
//     if (!newStudent.prn || !newStudent.name || !newStudent.email || !newStudent.password) {
//       toast.error("Please fill all required fields.");
//       return;
//     }

//     setIsSubmitting(true);

//     // Check if PRN already exists (this is good client-side validation)
//     const prnQuery = query(collection(db, "users"), where("prn", "==", newStudent.prn));
//     const prnSnapshot = await getDocs(prnQuery);
//     if (!prnSnapshot.empty) {
//       toast.error("PRN already exists. Please use a different PRN.");
//       setIsSubmitting(false);
//       return;
//     }

//     // Check if email already exists (this is good client-side validation)
//     const emailQuery = query(collection(db, "users"), where("email", "==", newStudent.email));
//     const emailSnapshot = await getDocs(emailQuery);
//     if (!emailSnapshot.empty) {
//       toast.error("Email already exists. Please use a different email.");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       // 1. Get all the data from the form state (newStudent)
//       const formData = {
//         email: newStudent.email,
//         password: newStudent.password,
//         prn: newStudent.prn,
//         name: newStudent.name,
//         branch: newStudent.branch || "",
//         year: newStudent.year ? parseInt(newStudent.year) : null,
//         semester: newStudent.semester ? parseInt(newStudent.semester) : null,
//       };

//       // 2. Call the Cloud Function
//       const functions = getFunctions();
//       const createNewStudent = httpsCallable(functions, 'createNewStudent');
//       const result = await createNewStudent(formData);

//       // 3. Handle the successful result
//       if (result.data.success) {
//         toast.success("Student created successfully!");
//         // This logic is from your original function, so we keep it.
//         setNewStudent({
//           prn: "",
//           name: "",
//           email: "",
//           password: "",
//           branch: "",
//           year: "",
//           semester: "",
//           active: true,
//         });
//         setShowAddForm(false);
//         fetchStudents();
//       } else {
//          // Handle a function-level failure
//          toast.error("Failed to create student. Please try again.");
//       }

//     } catch (error) {
//       // 4. Handle any errors from the Cloud Function
//       console.error("Error creating student:", error);
//       toast.error("Failed to create student: " + error.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   // --- END OF UPDATED FUNCTION ---


//   const toggleAccess = async (student) => {
//     try {
//       await updateDoc(doc(db, "users", student.id), {
//         active: !student.active,
//       });
//       toast.success(`Student access ${!student.active ? "enabled" : "disabled"}!`);
//       fetchStudents();
//     } catch (error) {
//       console.error("Error updating access:", error);
//       toast.error("Error updating access: " + error.message);
//     }
//   };

//   const handleDelete = async (student) => {
//     if (
//       !window.confirm(
//         `Are you sure you want to delete student "${student.name}" (${student.prn})? This will permanently delete their account.`
//       )
//     ) {
//       return;
//     }

//     try {
//       // Delete from Firestore
//       await deleteDoc(doc(db, "users", student.id));

//       // Note: Deleting the Firebase Auth user requires admin privileges
//       // For now, we'll just remove from Firestore
//       // In production, you might want to use a Cloud Function for this

//       toast.success("Student deleted successfully!");
//       fetchStudents();
//     } catch (error) {
//       console.error("Error deleting student:", error);
//       toast.error("Error deleting student: " + error.message);
//     }
//   };



//   if (loading) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-navy">Manage Students</h2>
//         <button
//           onClick={() => setShowAddForm(!showAddForm)}
//           className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-teal-dark transition duration-200"
//         >
//           {showAddForm ? "Cancel" : "+ Add New Student"}
//         </button>
//       </div>

//       {/* Add Student Form */}
//       {showAddForm && (
//         <form
//           onSubmit={handleCreateStudent}
//           className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4"
//         >
//           <h3 className="text-lg font-semibold text-navy mb-4">Create New Student Account</h3>
//           <div className="grid md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 PRN <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={newStudent.prn}
//                 onChange={(e) => setNewStudent({ ...newStudent, prn: e.target.value })}
//                 className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={newStudent.name}
//                 onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
//                 className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Email <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="email"
//                 value={newStudent.email}
//                 onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
//                 className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Password <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="password"
//                 value={newStudent.password}
//                 onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
//                 className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
//                 required
//                 minLength="6"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
//               <input
//                 type="text"
//                 value={newStudent.branch}
//                 onChange={(e) => setNewStudent({ ...newStudent, branch: e.target.value })}
//                 className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
//                 placeholder="e.g., Computer Engineering"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
//               <input
//                 type="number"
//                 value={newStudent.year}
//                 onChange={(e) => setNewStudent({ ...newStudent, year: e.target.value })}
//                 className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
//                 placeholder="e.g., 3"
//                 min="1"
//                 max="4"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
//               <input
//                 type="number"
//                 value={newStudent.semester}
//                 onChange={(e) => setNewStudent({ ...newStudent, semester: e.target.value })}
//                 className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
//                 placeholder="e.g., 6"
//                 min="1"
//                 max="8"
//               />
//             </div>
//             <div className="flex items-center">
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   checked={newStudent.active}
//                   onChange={(e) =>
//                     setNewStudent({ ...newStudent, active: e.target.checked })
//                   }
//                   className="w-4 h-4 text-navy focus:ring-navy"
//                 />
//                 <span className="text-sm font-medium text-gray-700">Active (Enable Access)</span>
//               </label>
//             </div>
//           </div>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy-dark transition duration-200 disabled:bg-gray-400"
//           >
//             {isSubmitting ? "Creating..." : "Create Student Account"}
//           </button>
//         </form>
//       )}

//       {/* Students Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200">
//           <thead className="bg-navy text-white">
//             <tr>
//               <th className="px-4 py-3 text-left">PRN</th>
//               <th className="px-4 py-3 text-left">Name</th>
//               <th className="px-4 py-3 text-left">Email</th>
//               <th className="px-4 py-3 text-left">Branch</th>
//               <th className="px-4 py-3 text-left">Year</th>
//               <th className="px-4 py-3 text-left">Semester</th>
//               <th className="px-4 py-3 text-left">Status</th>
//               <th className="px-4 py-3 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.length === 0 ? (
//               <tr>
//                 <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
//                   No students found. Add your first student!
//                 </td>
//               </tr>
//             ) : (
//               students.map((student) => (
//                 <tr key={student.id} className="border-t hover:bg-gray-50">
//                   <td className="px-4 py-3 font-medium">{student.prn}</td>
//                   <td className="px-4 py-3">{student.name}</td>
//                   <td className="px-4 py-3 text-sm">{student.email}</td>
//                   <td className="px-4 py-3">{student.branch || "N/A"}</td>
//                   <td className="px-4 py-3">{student.year || "N/A"}</td>
//                   <td className="px-4 py-3">{student.semester || "N/A"}</td>
//                   <td className="px-4 py-3">
//                     <span
//                       className={`px-2 py-1 rounded text-sm font-semibold ${
//                         student.active
//                           ? "bg-green-100 text-green-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {student.active ? "Active" : "Disabled"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3">
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => toggleAccess(student)}
//                         className={`text-sm px-3 py-1 rounded ${
//                           student.active
//                             ? "bg-red-100 text-red-700 hover:bg-red-200"
//                             : "bg-green-100 text-green-700 hover:bg-green-200"
//                         }`}
//                       >
//                         {student.active ? "Disable" : "Enable"}
//                       </button>
//                       <button
//                         onClick={() => handleDelete(student)}
//                         className="text-red-600 hover:underline text-sm"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }






//verison_3
import { useEffect, useState } from "react";
// YEH LINE FIX HO GAYI HAI: .js extension hata diya gaya hai
import { db, auth } from "../../utils/firebase";
import { getFunctions, httpsCallable } from "firebase/functions";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";

// --- ADDED EYE ICON COMPONENTS ---
const EyeIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
    {...props}
  >
    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
    <path
      fillRule="evenodd"
      d="M.664 10.59a1.651 1.651 0 010-1.18l.88-1.32.88-1.32A1.65 1.65 0 013.8 6.07l.88-1.32.88-1.32A1.65 1.65 0 017.6 2.07l.88-1.32.88-1.32A1.65 1.65 0 0110 0c1.29 0 2.51.56 3.346 1.48l.88 1.32.88 1.32a1.65 1.65 0 011.086 1.63l.88 1.32.88 1.32a1.65 1.65 0 010 1.18l-.88 1.32-.88 1.32a1.65 1.65 0 01-1.086 1.63l-.88 1.32-.88 1.32a1.65 1.65 0 01-1.214.73l-.88 1.32-.88 1.32A1.65 1.65 0 0110 20c-1.29 0-2.51-.56-3.346-1.48l-.88-1.32-.88-1.32a1.65 1.65 0 01-1.086-1.63l-.88-1.32-.88-1.32a1.65 1.65 0 010-1.18zM10 15a5 5 0 100-10 5 5 0 000 10z"
      clipRule="evenodd"
    />
  </svg>
);

const EyeSlashIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.72-1.72A8.969 8.969 0 0018.75 10c-1.524-4.572-5.592-7.778-9.75-7.778a9.01 9.01 0 00-2.34.36L3.28 2.22zM10 15a5 5 0 01-5-5c0-.99.284-1.92.78-2.678L7.33 8.87C7.126 9.22 7 9.605 7 10a3 3 0 003 3c.395 0 .78-.126 1.13-.33l1.547 1.547A4.982 4.982 0 0110 15z"
      clipRule="evenodd"
    />
  </svg>
);
// --- END OF ICON COMPONENTS ---

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newStudent, setNewStudent] = useState({
    prn: "",
    name: "",
    email: "",
    password: "",
    branch: "",
    year: "",
    semester: "",
    active: true,
  });

  // --- ADDED STATE FOR PASSWORD VISIBILITY ---
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(
        query(collection(db, "users"), where("role", "==", "student"))
      );
      const list = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      list.sort((a, b) => (a.prn || "").localeCompare(b.prn || ""));
      setStudents(list);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Error loading students");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    
    if (!newStudent.prn || !newStudent.name || !newStudent.email || !newStudent.password) {
      toast.error("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);

    const prnQuery = query(collection(db, "users"), where("prn", "==", newStudent.prn));
    const prnSnapshot = await getDocs(prnQuery);
    if (!prnSnapshot.empty) {
      toast.error("PRN already exists. Please use a different PRN.");
      setIsSubmitting(false);
      return;
    }

    const emailQuery = query(collection(db, "users"), where("email", "==", newStudent.email));
    const emailSnapshot = await getDocs(emailQuery);
    if (!emailSnapshot.empty) {
      toast.error("Email already exists. Please use a different email.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = {
        email: newStudent.email,
        password: newStudent.password,
        prn: newStudent.prn,
        name: newStudent.name,
        branch: newStudent.branch || "",
        year: newStudent.year ? parseInt(newStudent.year) : null,
        semester: newStudent.semester ? parseInt(newStudent.semester) : null,
      };

      const functions = getFunctions();
      const createNewStudent = httpsCallable(functions, 'createNewStudent');
      const result = await createNewStudent(formData);

      if (result.data.success) {
        toast.success("Student created successfully!");
        setNewStudent({
          prn: "",
          name: "",
          email: "",
          password: "",
          branch: "",
          year: "",
          semester: "",
          active: true,
        });
        setShowAddForm(false);
        setShowPassword(false); // Reset password visibility
        fetchStudents();
      } else {
         toast.error("Failed to create student. Please try again.");
      }

    } catch (error) {
      console.error("Error creating student:", error);
      toast.error("Failed to create student: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  const toggleAccess = async (student) => {
    try {
      await updateDoc(doc(db, "users", student.id), {
        active: !student.active,
      });
      toast.success(`Student access ${!student.active ? "enabled" : "disabled"}!`);
      fetchStudents();
    } catch (error) {
      console.error("Error updating access:", error);
      toast.error("Error updating access: " + error.message);
    }
  };

  const handleDelete = async (student) => {
    if (
      !window.confirm(
        `Are you sure you want to delete student "${student.name}" (${student.prn})? This will permanently delete their account.`
      )
    ) {
      return;
    }

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "users", student.id));
      toast.success("Student deleted successfully!");
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Error deleting student: " + error.message);
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-navy">Manage Students</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-teal-dark transition duration-200"
        >
          {showAddForm ? "Cancel" : "+ Add New Student"}
        </button>
      </div>

      {/* Add Student Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateStudent}
          className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4"
        >
          <h3 className="text-lg font-semibold text-navy mb-4">Create New Student Account</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PRN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newStudent.prn}
                onChange={(e) => setNewStudent({ ...newStudent, prn: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
                required
              />
            </div>
            
            {/* --- PASSWORD FIELD UPDATED --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newStudent.password}
                  onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy pr-10"
                  required
                  minLength="6"
                />
                <div
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
            {/* --- END OF UPDATE --- */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <input
                type="text"
                value={newStudent.branch}
                onChange={(e) => setNewStudent({ ...newStudent, branch: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
                placeholder="e.g., Computer Engineering"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="number"
                value={newStudent.year}
                onChange={(e) => setNewStudent({ ...newStudent, year: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
                placeholder="e.g., 3"
                min="1"
                max="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <input
                type="number"
                value={newStudent.semester}
                onChange={(e) => setNewStudent({ ...newStudent, semester: e.g.target.value })}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
                placeholder="e.g., 6"
                min="1"
                max="8"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newStudent.active}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, active: e.target.checked })
                  }
                  className="w-4 h-4 text-navy focus:ring-navy"
                />
                <span className="text-sm font-medium text-gray-700">Active (Enable Access)</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy-dark transition duration-200 disabled:bg-gray-400"
          >
            {isSubmitting ? "Creating..." : "Create Student Account"}
          </button>
        </form>
      )}

      {/* Students Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-navy text-white">
            <tr>
              <th className="px-4 py-3 text-left">PRN</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Branch</th>
              <th className="px-4 py-3 text-left">Year</th>
              <th className="px-4 py-3 text-left">Semester</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                  No students found. Add your first student!
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{student.prn}</td>
                  <td className="px-4 py-3">{student.name}</td>
                  <td className="px-4 py-3 text-sm">{student.email}</td>
                  <td className="px-4 py-3">{student.branch || "N/A"}</td>
                  <td className="px-4 py-3">{student.year || "N/A"}</td>
                  <td className="px-4 py-3">{student.semester || "N/A"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-sm font-semibold ${
                        student.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {student.active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleAccess(student)}
                        className={`text-sm px-3 py-1 rounded ${
                          student.active
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {student.active ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => handleDelete(student)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}