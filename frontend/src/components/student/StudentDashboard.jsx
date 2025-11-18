//version_1
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { signOut } from "firebase/auth";
// import { auth, db } from "../../utils/firebase.js";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { doc, getDoc } from "firebase/firestore";
// import PdfViewer from "./PdfViewer.jsx";
// import { toast } from "react-toastify";
// import Header from "../layout/Header.jsx";
// import Footer from "../layout/Footer.jsx";

// export default function StudentDashboard() {
//   const [userData, setUserData] = useState(null);
//   const [form, setForm] = useState({
//     currentYear: "",
//     currentSemester: "",
//     targetYear: "",
//     targetSemester: "",
//   });
//   const [papers, setPapers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedPaper, setSelectedPaper] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   const fetchUserData = async () => {
//     try {
//       const user = auth.currentUser;
//       if (!user) {
//         navigate("/login?role=student");
//         return;
//       }

//       const userDoc = await getDoc(doc(db, "users", user.uid));
//       if (userDoc.exists()) {
//         const data = userDoc.data();
//         setUserData(data);
//         // Pre-fill form with student's year/semester if available
//         if (data.year && data.semester) {
//           setForm({
//             currentYear: data.year.toString(),
//             currentSemester: data.semester.toString(),
//             targetYear: "",
//             targetSemester: "",
//           });
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       toast.error("Error loading user data");
//     }
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const searchPapers = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Use target year/semester if provided, otherwise use current
//       const searchYear = form.targetYear || form.currentYear;
//       const searchSemester = form.targetSemester || form.currentSemester;
//       const searchBranch = userData?.branch || "";

//       if (!searchYear || !searchSemester) {
//         toast.error("Please provide year and semester!");
//         setLoading(false);
//         return;
//       }

//       // Build query - search by branch (if available), year, and semester
//       let q;
//       if (searchBranch) {
//         q = query(
//           collection(db, "papers"),
//           where("branch", "==", searchBranch),
//           where("year", "==", parseInt(searchYear)),
//           where("semester", "==", parseInt(searchSemester))
//         );
//       } else {
//         q = query(
//           collection(db, "papers"),
//           where("year", "==", parseInt(searchYear)),
//           where("semester", "==", parseInt(searchSemester))
//         );
//       }

//       const snapshot = await getDocs(q);
//       const results = snapshot.docs.map((d) => ({
//         id: d.id,
//         ...d.data(),
//       }));

//       // Sort by subject name
//       results.sort((a, b) => a.subject.localeCompare(b.subject));

//       setPapers(results);

//       if (results.length === 0) {
//         toast.info("No papers found for the selected criteria.");
//       } else {
//         toast.success(`Found ${results.length} paper(s)!`);
//       }
//     } catch (error) {
//       console.error("Error searching papers:", error);
//       toast.error("Error searching papers: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

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
//       <main className="flex-1 p-6 bg-gray-50">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
//             <h2 className="text-2xl font-bold text-navy mb-4">Student Dashboard</h2>
//             {userData && (
//               <div className="bg-gray-50 p-4 rounded-lg mb-4">
//                 <p className="text-sm text-gray-600">
//                   <span className="font-semibold">PRN:</span> {userData.prn || "N/A"} |{" "}
//                   <span className="font-semibold">Name:</span> {userData.name || "N/A"} |{" "}
//                   <span className="font-semibold">Branch:</span> {userData.branch || "N/A"} |{" "}
//                   <span className="font-semibold">Year:</span> {userData.year || "N/A"} |{" "}
//                   <span className="font-semibold">Semester:</span> {userData.semester || "N/A"}
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Search Form */}
//           <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
//             <h3 className="text-lg font-semibold text-navy mb-4">Search Question Papers</h3>
//             <form onSubmit={searchPapers} className="space-y-4">
//               <div className="grid md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Current Year
//                   </label>
//                   <input
//                     name="currentYear"
//                     type="number"
//                     placeholder="e.g., 2023"
//                     value={form.currentYear}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Current Semester
//                   </label>
//                   <input
//                     name="currentSemester"
//                     type="number"
//                     placeholder="e.g., 6"
//                     min="1"
//                     max="8"
//                     value={form.currentSemester}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Target Year (Optional)
//                   </label>
//                   <input
//                     name="targetYear"
//                     type="number"
//                     placeholder="e.g., 2022 (leave blank to use current)"
//                     value={form.targetYear}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Target Semester (Optional)
//                   </label>
//                   <input
//                     name="targetSemester"
//                     type="number"
//                     placeholder="e.g., 5 (leave blank to use current)"
//                     min="1"
//                     max="8"
//                     value={form.targetSemester}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
//                   />
//                 </div>
//               </div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-navy-dark transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? "Searching..." : "Search Papers"}
//               </button>
//             </form>
//           </div>

//           {/* Papers Table */}
//           {papers.length > 0 && (
//             <div className="bg-white shadow-lg rounded-lg p-6">
//               <h3 className="text-lg font-semibold text-navy mb-4">
//                 Search Results ({papers.length} paper{papers.length !== 1 ? "s" : ""})
//               </h3>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full border border-gray-200">
//                   <thead className="bg-navy text-white">
//                     <tr>
//                       <th className="px-4 py-3 text-left">Subject</th>
//                       <th className="px-4 py-3 text-left">Year</th>
//                       <th className="px-4 py-3 text-left">Semester</th>
//                       <th className="px-4 py-3 text-left">Exam Type</th>
//                       <th className="px-4 py-3 text-left">Uploaded Date</th>
//                       <th className="px-4 py-3 text-left">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {papers.map((paper) => (
//                       <tr key={paper.id} className="border-t hover:bg-gray-50">
//                         <td className="px-4 py-3 font-medium">{paper.subject}</td>
//                         <td className="px-4 py-3">{paper.year}</td>
//                         <td className="px-4 py-3">{paper.semester}</td>
//                         <td className="px-4 py-3 capitalize">{paper.examType}</td>
//                         <td className="px-4 py-3 text-sm">
//                           {paper.uploadedAt
//                             ? new Date(paper.uploadedAt.toMillis()).toLocaleDateString()
//                             : "N/A"}
//                         </td>
//                         <td className="px-4 py-3">
//                           <div className="flex space-x-3">
//                             <button
//                               onClick={() => setSelectedPaper(paper)}
//                               className="text-blue-600 hover:underline text-sm font-medium"
//                             >
//                               View
//                             </button>
//                             <a
//                               href={paper.fileURL}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               download
//                               className="text-green-600 hover:underline text-sm font-medium"
//                             >
//                               Download
//                             </a>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {papers.length === 0 && !loading && (
//             <div className="bg-white shadow-lg rounded-lg p-12 text-center">
//               <div className="text-6xl mb-4">📚</div>
//               <p className="text-gray-600 text-lg">
//                 Use the search form above to find question papers.
//               </p>
//             </div>
//           )}
//         </div>
//       </main>
//       <Footer />
//       {selectedPaper && (
//         <PdfViewer paper={selectedPaper} onClose={() => setSelectedPaper(null)} />
//       )}
//     </div>
//   );
// }

//version_2
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../../utils/firebase";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import PdfViewer from "./PdfViewer";
import { toast } from "react-toastify";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

export default function StudentDashboard() {
  const [userData, setUserData] = useState(null);
  const [form, setForm] = useState({
    currentYear: "",
    currentSemester: "",
    targetYear: "",
    targetSemester: "",
  });
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const navigate = useNavigate();

  const API_URL = "https://qp-logs-api-gpfad6h0drb3huep.centralindia-01.azurewebsites.net/api/log-download";

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login?role=student");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        setForm({
          currentYear: data.year?.toString() || "",
          currentSemester: data.semester?.toString() || "",
          targetYear: "",
          targetSemester: "",
        });
      }
    } catch {
      toast.error("Error fetching user data!");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const searchPapers = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const searchYear = form.targetYear || form.currentYear;
      const searchSemester = form.targetSemester || form.currentSemester;
      const searchBranch = userData?.branch;

      if (!searchYear || !searchSemester) {
        toast.error("Year & Semester required!");
        setLoading(false);
        return;
      }

      let q = query(
        collection(db, "papers"),
        where("year", "==", parseInt(searchYear)),
        where("semester", "==", parseInt(searchSemester))
      );

      if (searchBranch) {
        q = query(
          collection(db, "papers"),
          where("branch", "==", searchBranch),
          where("year", "==", parseInt(searchYear)),
          where("semester", "==", parseInt(searchSemester))
        );
      }

      const snapshot = await getDocs(q);
      const results = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

      results.sort((a, b) => a.subject.localeCompare(b.subject));
      setPapers(results);

      results.length
        ? toast.success(`${results.length} papers found`)
        : toast.info("No papers found");
    } catch {
      toast.error("Search failed!");
    } finally {
      setLoading(false);
    }
  };

  const logDownloadAndOpen = async (paper) => {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentPrn: userData?.prn || "Unknown",
          paperName: paper.subject,
        }),
      });
    } catch {
      toast.error("Log failed! Still downloading...");
    }

    window.open(paper.fileURL, "_blank");
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          
          {/* Student Info */}
          {userData && (
            <div className="bg-white shadow p-4 mb-4 text-sm rounded-lg">
              <p><b>Student:</b> {userData.name} | <b>PRN:</b> {userData.prn}</p>
              <p><b>Branch:</b> {userData.branch} | <b>Semester:</b> {userData.semester}</p>
            </div>
          )}

          {/* 🔍 Search Form */}
          <form onSubmit={searchPapers} className="bg-white p-6 shadow rounded-lg mb-6 space-y-4">
            <h3 className="text-lg font-semibold">Search Question Papers</h3>

            <div className="grid grid-cols-2 gap-4">
              <input type="number" name="currentYear" value={form.currentYear} onChange={handleChange}
                placeholder="Current Year"
                className="border p-2 rounded" />

              <input type="number" name="currentSemester" value={form.currentSemester} onChange={handleChange}
                placeholder="Current Semester"
                className="border p-2 rounded" />

              <input type="number" name="targetYear" value={form.targetYear} onChange={handleChange}
                placeholder="Target Year (Optional)"
                className="border p-2 rounded" />

              <input type="number" name="targetSemester" value={form.targetSemester} onChange={handleChange}
                placeholder="Target Semester (Optional)"
                className="border p-2 rounded" />
            </div>

            <button type="submit" disabled={loading}
              className="bg-blue-700 text-white py-2 px-6 rounded w-full">
              {loading ? "Searching..." : "Search Papers"}
            </button>
          </form>

          {/* 📌 Papers Table */}
          {papers.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="font-semibold mb-4">Papers Found: {papers.length}</h3>
              <table className="min-w-full border">
                <thead className="bg-blue-800 text-white text-sm">
                  <tr>
                    <th className="px-4 py-2">Subject</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {papers.map((paper) => (
                    <tr key={paper.id} className="border text-sm">
                      <td className="p-3">{paper.subject}</td>
                      <td className="p-3 space-x-4">
                        <button className="text-blue-600 underline"
                          onClick={() => setSelectedPaper(paper)}>View</button>

                        <button className="text-green-600 underline"
                          onClick={() => logDownloadAndOpen(paper)}>Download</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>

      <Footer />

      {selectedPaper && (
        <PdfViewer paper={selectedPaper} onClose={() => setSelectedPaper(null)} />
      )}
    </div>
  );
}
