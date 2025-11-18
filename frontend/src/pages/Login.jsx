
//version_2
// import { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth, db } from "../utils/firebase.js";
// import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
// import { toast } from "react-toastify";
// import Header from "../components/layout/Header.jsx";
// import Footer from "../components/layout/Footer.jsx";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [prn, setPrn] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const role = searchParams.get("role") || "student";

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       let userEmail = email;

//       // For students, look up email by PRN
//       if (role === "student") {
//         if (!prn) {
//           toast.error("Please enter your PRN.");
//           setLoading(false);
//           return;
//         }
        
//         try {
//           const q = query(collection(db, "users"), where("prn", "==", prn));
//           const querySnapshot = await getDocs(q);
          
//           if (querySnapshot.empty) {
//             toast.error("PRN not found. Please contact the exam cell.");
//             setLoading(false);
//             return;
//           }

//           const userData = querySnapshot.docs[0].data();
          
//           if (!userData.email) {
//             toast.error("Email not found for this PRN. Please contact the exam cell.");
//             setLoading(false);
//             return;
//           }

//           if (userData.active === false) {
//             toast.error("Your account has been disabled. Please contact the exam cell.");
//             setLoading(false);
//             return;
//           }

//           userEmail = userData.email;
//         } catch (error) {
//           console.error("Error looking up PRN:", error);
//           toast.error("Error looking up PRN. Please check your connection.");
//           setLoading(false);
//           return;
//         }
//       }

//       if (!userEmail || !password) {
//         toast.error("Please provide all required fields.");
//         setLoading(false);
//         return;
//       }

//       // CAPTCHA placeholder - in production, integrate Google reCAPTCHA v2
//       // For now, we'll proceed with login

//       const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
      
//       // Wait a bit for auth state to update
//       await new Promise(resolve => setTimeout(resolve, 100));
      
//       const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

//       if (!userDoc.exists()) {
//         await auth.signOut();
//         toast.error("User data not found in database. Please contact support.");
//         setLoading(false);
//         return;
//       }

//       const userData = userDoc.data();
      
//       console.log("User data:", userData); // Debug log

//       if (userData.active === false || userData.active === undefined) {
//         await auth.signOut();
//         toast.error("Your account has been disabled. Please contact the exam cell.");
//         setLoading(false);
//         return;
//       }

//       if (userData.role !== role) {
//         await auth.signOut();
//         toast.error(`You are logged in as ${userData.role}, but this section requires ${role}.`);
//         setLoading(false);
//         return;
//       }

//       toast.success("Login successful!");
//       // Small delay to ensure state updates
//       setTimeout(() => {
//         navigate(role === "admin" ? "/admin" : "/student");
//       }, 100);
//     } catch (err) {
//       console.error("Login error:", err);
//       toast.error(err.message || "Login failed. Please check your credentials.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header />
//       <main className="flex-1 flex items-center justify-center bg-gray-50 py-12">
//         <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
//           <h2 className="text-3xl font-bold text-navy mb-2 text-center">
//             {role === "admin" ? "Admin Login" : "Student Login"}
//           </h2>
//           <p className="text-gray-600 text-center mb-6">
//             {role === "student"
//               ? "Enter your PRN and password to access question papers"
//               : "Enter your credentials to manage the repository"}
//           </p>

//           <form onSubmit={handleLogin} className="space-y-4">
//             {role === "student" && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   PRN (Permanent Registration Number)
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter your PRN"
//                   value={prn}
//                   onChange={(e) => setPrn(e.target.value)}
//                   className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
//                   required
//                 />
//               </div>
//             )}

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 {role === "student" ? "Email (from student record)" : "Email"}
//               </label>
//               <input
//                 type="email"
//                 placeholder={role === "student" ? "Email (auto-filled)" : "Enter your email"}
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
//                 disabled={role === "student" && prn}
//                 required={role === "admin"}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
//                 required
//               />
//             </div>

//             {/* CAPTCHA Placeholder */}
//             <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-600 text-center">
//               🔒 CAPTCHA verification (reCAPTCHA v2 integration)
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-navy text-white py-3 rounded-lg font-semibold hover:bg-navy-dark transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? "Logging in..." : "Login"}
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600">
//               Forgot password?{" "}
//               <a href="#" className="text-teal hover:underline">
//                 Contact Exam Cell
//               </a>
//             </p>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }

//version_1
// import { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth, db } from "../utils/firebase.js";
// // Import 'limit'
// import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
// import { toast } from "react-toastify";
// import Header from "../components/layout/Header.jsx";
// import Footer from "../components/layout/Footer.jsx";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [prn, setPrn] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   // Changed this to use state, so it's reactive
//   const [role, setRole] = useState("student");

//   // Set the role based on the URL parameter
//   useEffect(() => {
//     setRole(searchParams.get("role") || "student");
//   }, [searchParams]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       let userEmail = email;

//       // For students, look up email by PRN
//       if (role === "student") {
//         if (!prn) {
//           toast.error("Please enter your PRN.");
//           setLoading(false);
//           return;
//         }
        
//         try {
//           // --- THIS IS THE FIXED QUERY ---
//           // Added limit(1) to match the security rule
//           const q = query(
//             collection(db, "users"), 
//             where("prn", "==", prn),
//             limit(1) 
//           );
//           const querySnapshot = await getDocs(q);
          
//           if (querySnapshot.empty) {
//             toast.error("PRN not found. Please contact the exam cell.");
//             setLoading(false);
//             return;
//           }

//           const userData = querySnapshot.docs[0].data();
          
//           if (!userData.email) {
//             toast.error("Email not found for this PRN. Please contact the exam cell.");
//             setLoading(false);
//             return;
//           }

//           if (userData.active === false) {
//             toast.error("Your account has been disabled. Please contact the exam cell.");
//             setLoading(false);
//             return;
//           }

//           userEmail = userData.email;
//           setEmail(userEmail); // Auto-fill the email field
//         } catch (error) {
//           console.error("Error looking up PRN:", error);
//           toast.error("Error looking up PRN. Please check your connection.");
//           setLoading(false);
//           return;
//         }
//       }

//       if (role === "admin" && !email) {
//          toast.error("Please enter your email.");
//          setLoading(false);
//          return;
//       }

//       if (!userEmail || !password) {
//         toast.error("Please provide all required fields.");
//         setLoading(false);
//         return;
//       }

//       // CAPTCHA placeholder - in production, integrate Google reCAPTCHA v2
//       // For now, we'll proceed with login

//       const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
            
//       const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

//       if (!userDoc.exists()) {
//         await auth.signOut();
//         toast.error("User data not found in database. Please contact support.");
//         setLoading(false);
//         return;
//       }

//       const userData = userDoc.data();
      
//       console.log("User data:", userData); // Debug log

//       if (userData.active === false) {
//         await auth.signOut();
//         toast.error("Your account has been disabled. Please contact the exam cell.");
//         setLoading(false);
//         return;
//       }

//       if (userData.role !== role) {
//         await auth.signOut();
//         toast.error(`You are logged in as ${userData.role}, but this section requires ${role}.`);
//         setLoading(false);
//         return;
//       }

//       toast.success("Login successful!");
//       navigate(role === "admin" ? "/admin" : "/student");

//     } catch (err) {
//       console.error("Login error:", err);
//       toast.error(err.message || "Login failed. Please check your credentials.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header />
//       <main className="flex-1 flex items-center justify-center bg-gray-50 py-12">
//         <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
//           <h2 className="text-3xl font-bold text-navy mb-2 text-center">
//             {role === "admin" ? "Admin Login" : "Student Login"}
//           </h2>
//           <p className="text-gray-600 text-center mb-6">
//             {role === "student"
//               ? "Enter your PRN and password to access question papers"
//               : "Enter your credentials to manage the repository"}
//           </p>

//           <form onSubmit={handleLogin} className="space-y-4">
//             {role === "student" && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   PRN (Permanent Registration Number)
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter your PRN"
//                   value={prn}
//                   onChange={(e) => setPrn(e.target.value)}
//                   className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
//                   required
//                 />
//               </div>
//             )}

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 {role === "student" ? "Email (from student record)" : "Email"}
//               </label>
//               <input
//                 type="email"
//                 placeholder={role === "student" ? "Email (auto-filled)" : "Enter your email"}
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
//                 disabled={role === "student"} // Changed this to be always disabled for student
//                 required={role === "admin"}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
//                 required
//               />
//             </div>

//             {/* CAPTCHA Placeholder */}
//             <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-600 text-center">
//               🔒 CAPTCHA verification (reCAPTCHA v2 integration)
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-navy text-white py-3 rounded-lg font-semibold hover:bg-navy-dark transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? "Logging in..." : "Login"}
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600">
//               Forgot password?{" "}
//               <a href="#" className="text-teal hover:underline">
//                 Contact Exam Cell
//               </a>
//             </p>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }

//version_3
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../utils/firebase.js";
// 1. IMPORT 'limit'
import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import { toast } from "react-toastify";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";

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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [prn, setPrn] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get("role") || "student";

  // --- ADDED STATE FOR PASSWORD VISIBILITY ---
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let userEmail = email;

      // For students, look up email by PRN
      if (role === "student") {
        if (!prn) {
          toast.error("Please enter your PRN.");
          setLoading(false);
          return;
        }
        
        try {
          // --- 2. ADDED limit(1) TO THE QUERY ---
          const q = query(
            collection(db, "users"), 
            where("prn", "==", prn),
            limit(1) // This ensures our Firestore rule works
          );
          const querySnapshot = await getDocs(q);
          
          if (querySnapshot.empty) {
            toast.error("PRN not found. Please contact the exam cell.");
            setLoading(false);
            return;
          }

          const userData = querySnapshot.docs[0].data();
          
          if (!userData.email) {
            toast.error("Email not found for this PRN. Please contact the exam cell.");
            setLoading(false);
            return;
          }

          if (userData.active === false) {
            toast.error("Your account has been disabled. Please contact the exam cell.");
            setLoading(false);
            return;
          }

          userEmail = userData.email;
          setEmail(userEmail); // Auto-fill
        } catch (error) {
          console.error("Error looking up PRN:", error);
          toast.error("Error looking up PRN. Please check your connection.");
          setLoading(false);
          return;
        }
      }

      if (!userEmail || !password) {
        toast.error("Please provide all required fields.");
        setLoading(false);
        return;
      }

      // CAPTCHA placeholder - in production, integrate Google reCAPTCHA v2
      // For now, we'll proceed with login

      const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
      
      // Wait a bit for auth state to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

      if (!userDoc.exists()) {
        await auth.signOut();
        toast.error("User data not found in database. Please contact support.");
        setLoading(false);
        return;
      }

      const userData = userDoc.data();
      
      console.log("User data:", userData); // Debug log

      if (userData.active === false || userData.active === undefined) {
        await auth.signOut();
        toast.error("Your account has been disabled. Please contact the exam cell.");
        setLoading(false);
        return;
      }

      if (userData.role !== role) {
        await auth.signOut();
        toast.error(`You are logged in as ${userData.role}, but this section requires ${role}.`);
        setLoading(false);
        return;
      }

      toast.success("Login successful!");
      // Small delay to ensure state updates
      setTimeout(() => {
        navigate(role === "admin" ? "/admin" : "/student");
      }, 100);
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gray-50 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-navy mb-2 text-center">
            {role === "admin" ? "Admin Login" : "Student Login"}
          </h2>
          <p className="text-gray-600 text-center mb-6">
            {role === "student"
              ? "Enter your PRN and password to access question papers"
              : "Enter your credentials to manage the repository"}
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {role === "student" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PRN (Permanent Registration Number)
                </label>
                <input
                  type="text"
                  placeholder="Enter your PRN"
                  value={prn}
                  onChange={(e) => setPrn(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {role === "student" ? "Email (from student record)" : "Email"}
              </label>
              <input
                type="email"
                placeholder={role === "student" ? "Email (auto-filled)" : "Enter your email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                disabled={role === "student"}
                required={role === "admin"}
              />
            </div>

            {/* --- PASSWORD FIELD UPDATED --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent pr-10"
                  required
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

            {/* CAPTCHA Placeholder */}
            <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-600 text-center">
              🔒 CAPTCHA verification (reCAPTCHA v2 integration)
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy text-white py-3 rounded-lg font-semibold hover:bg-navy-dark transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Forgot password?{" "}
              <a href="#" className="text-teal hover:underline">
                Contact Exam Cell
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

