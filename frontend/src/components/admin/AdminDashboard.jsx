// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { signOut } from "firebase/auth";
// import { auth } from "../../utils/firebase.js";
// import Header from "../layout/Header.jsx";
// import Footer from "../layout/Footer.jsx";
// import UploadForm from "./UploadForm.jsx";
// import ManagePapers from "./ManagePapers.jsx";
// import ManageStudents from "./ManageStudents.jsx";
// import { toast } from "react-toastify";

// export default function AdminDashboard() {
//   const [section, setSection] = useState("upload");
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       toast.success("Logged out successfully");
//       navigate("/");
//     } catch (error) {
//       toast.error("Error logging out");
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header />
//       <div className="bg-navy text-white shadow-md">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <h1 className="text-2xl font-bold">Admin Dashboard</h1>
//             <button
//               onClick={handleLogout}
//               className="bg-teal hover:bg-teal-dark px-4 py-2 rounded-md transition duration-200"
//             >
//               Logout
//             </button>
//           </div>
//           <nav className="flex space-x-1 pb-2">
//             <button
//               onClick={() => setSection("upload")}
//               className={`px-4 py-2 rounded-t-lg transition duration-200 ${
//                 section === "upload"
//                   ? "bg-white text-navy font-semibold"
//                   : "hover:bg-navy-light"
//               }`}
//             >
//               Upload Paper
//             </button>
//             <button
//               onClick={() => setSection("managePapers")}
//               className={`px-4 py-2 rounded-t-lg transition duration-200 ${
//                 section === "managePapers"
//                   ? "bg-white text-navy font-semibold"
//                   : "hover:bg-navy-light"
//               }`}
//             >
//               Manage Papers
//             </button>
//             <button
//               onClick={() => setSection("manageStudents")}
//               className={`px-4 py-2 rounded-t-lg transition duration-200 ${
//                 section === "manageStudents"
//                   ? "bg-white text-navy font-semibold"
//                   : "hover:bg-navy-light"
//               }`}
//             >
//               Manage Students
//             </button>
//           </nav>
//         </div>
//       </div>

//       <main className="flex-1 p-6 bg-gray-50">
//         <div className="max-w-7xl mx-auto">
//           {section === "upload" && <UploadForm />}
//           {section === "managePapers" && <ManagePapers />}
//           {section === "manageStudents" && <ManageStudents />}
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import UploadForm from "./UploadForm";
import ManagePapers from "./ManagePapers";
import ManageStudents from "./ManageStudents";
import { toast } from "react-toastify";
// 1. ADDED THIS IMPORT
import { getFunctions, httpsCallable } from "firebase/functions";

export default function AdminDashboard() {
  const [section, setSection] = useState("upload");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  // 2. ADDED THIS FUNCTION
  const makeMeAdmin = async () => {
    // !! IMPORTANT: Make sure this email is your admin email !!
    const adminEmail = "admin@test.com"; 

    console.log(`Attempting to make ${adminEmail} an admin...`);
    toast.info("Attempting to set admin role...");
    const functions = getFunctions();
    const setUserRole = httpsCallable(functions, 'setUserRole');
    try {
      const result = await setUserRole({ 
        email: adminEmail,
        role: "admin" 
      });
      console.log(result.data.message);
      toast.success(result.data.message);
    } catch (error) {
      console.error(error);
      toast.error("Error setting role: " + error.message);
    }
  };


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="bg-navy text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            {/* <button
              onClick={handleLogout}
              className="bg-teal hover:bg-teal-dark px-4 py-2 rounded-md transition duration-200"
            >
              Logout
            </button> */}
          </div>
          <nav className="flex space-x-1 pb-2">
            <button
              onClick={() => setSection("upload")}
              className={`px-4 py-2 rounded-t-lg transition duration-200 ${
                section === "upload"
                  ? "bg-white text-navy font-semibold"
                  : "hover:bg-navy-light"
              }`}
            >
              Upload Paper
            </button>
            <button
              onClick={() => setSection("managePapers")}
              className={`px-4 py-2 rounded-t-lg transition duration-200 ${
                section === "managePapers"
                  ? "bg-white text-navy font-semibold"
                  : "hover:bg-navy-light"
              }`}
            >
              Manage Papers
            </button>
            <button
              onClick={() => setSection("manageStudents")}
              className={`px-4 py-2 rounded-t-lg transition duration-200 ${
                section === "manageStudents"
                  ? "bg-white text-navy font-semibold"
                  : "hover:bg-navy-light"
              }`}
            >
              Manage Students
            </button>
            
            {/* 3. ADDED THIS BUTTON */}
            {/* <button
              onClick={makeMeAdmin}
              className="ml-auto bg-yellow-500 text-black px-3 py-1 rounded-md text-sm hover:bg-yellow-400"
              title="Run this one time to set your admin custom claim."
            >
              Make Me Admin (One Time)
            </button> */}

          </nav>
        </div>
      </div>

      <main className="flex-1 p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {section === "upload" && <UploadForm />}
          {section === "managePapers" && <ManagePapers />}
          {section === "manageStudents" && <ManageStudents />}
        </div>
      </main>
      <Footer />
    </div>
  );
}



