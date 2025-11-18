// import { Link, useNavigate } from "react-router-dom";
// import { auth } from "../../utils/firebase.js";
// import { signOut } from "firebase/auth";
// import { useEffect, useState } from "react";
// import { onAuthStateChanged } from "firebase/auth";

// export default function Header() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       navigate("/");
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   return (
//     <header className="bg-navy text-white shadow-lg">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center py-4">
//           <Link to="/" className="flex items-center space-x-3">
//             <div className="text-2xl font-bold">📚 QuestionPaperRepo</div>
//           </Link>
//           <nav className="flex items-center space-x-6">
//             {user ? (
//               <>
//                 <span className="text-sm">Welcome, {user.email}</span>
//                 <button
//                   onClick={handleLogout}
//                   className="bg-teal hover:bg-teal-dark px-4 py-2 rounded-md transition duration-200"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link to="/" className="hover:text-teal transition duration-200">
//                   Home
//                 </Link>
//                 <Link
//                   to="/login?role=student"
//                   className="hover:text-teal transition duration-200"
//                 >
//                   Student Login
//                 </Link>
//                 <Link
//                   to="/login?role=admin"
//                   className="hover:text-teal transition duration-200"
//                 >
//                   Admin Login
//                 </Link>
//               </>
//             )}
//           </nav>
//         </div>
//       </div>
//     </header>
//   );
// }



import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../utils/firebase.js";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import collegeLogo from "../../assets/college-logo.png"; // ⭐ Import Logo
import qprLogo from "../../assets/book.png";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="bg-navy text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Left: Existing branding (unchanged) */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={qprLogo}
              alt="Question Paper Repo Logo"
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold tracking-wide">
              QuestionPaperRepo
            </span>
          </Link>

          {/* Right: Navigation + College Logo */}
          <nav className="flex items-center space-x-6">
            {user ? (
              <>
                <span className="text-sm">Welcome, {user.email}</span>
                <button
                  onClick={handleLogout}
                  className="bg-teal hover:bg-teal-dark px-4 py-2 rounded-md transition duration-200"
                >
                  Logout
                </button>

                {/* ⭐ College logo at extreme right */}
                <img
                  src={collegeLogo}
                  alt="College Logo"
                  className="h-10 w-auto rounded-md shadow-md hover:scale-105 transition"
                />
              </>
            ) : (
              <>
                <Link to="/" className="hover:text-teal transition duration-200">
                  Home
                </Link>
                <Link
                  to="/login?role=student"
                  className="hover:text-teal transition duration-200"
                >
                  Student Login
                </Link>
                <Link
                  to="/login?role=admin"
                  className="hover:text-teal transition duration-200"
                >
                  Admin Login
                </Link>

                {/* Show logo even when not logged in (optional) */}
                <img
                  src={collegeLogo}
                  alt="College Logo"
                  className="h-10 w-auto rounded-md shadow-md hover:scale-105 transition"
                />
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
