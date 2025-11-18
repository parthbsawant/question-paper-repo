import { useEffect, useState } from "react";
import { db } from "../../utils/firebase.js";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../../utils/firebase.js";
import { toast } from "react-toastify";

export default function ManagePapers() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    branch: "",
    year: "",
    subject: "",
    semester: "",
  });
  const [editingPaper, setEditingPaper] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "papers"));
      const list = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      // Sort by uploaded date (newest first)
      list.sort((a, b) => {
        if (!a.uploadedAt || !b.uploadedAt) return 0;
        return b.uploadedAt.toMillis() - a.uploadedAt.toMillis();
      });
      setPapers(list);
    } catch (error) {
      console.error("Error fetching papers:", error);
      toast.error("Error loading papers");
    } finally {
      setLoading(false);
    }
  };

  const filteredPapers = papers.filter((paper) => {
    return (
      (!filters.branch || paper.branch.toLowerCase().includes(filters.branch.toLowerCase())) &&
      (!filters.year || paper.year.toString().includes(filters.year)) &&
      (!filters.subject || paper.subject.toLowerCase().includes(filters.subject.toLowerCase())) &&
      (!filters.semester || paper.semester.toString().includes(filters.semester))
    );
  });

  const handleDelete = async (paper) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${paper.subject}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "papers", paper.id));

      // Delete from Storage
      if (paper.filePath) {
        try {
          const storageRef = ref(storage, paper.filePath);
          await deleteObject(storageRef);
        } catch (storageError) {
          console.error("Error deleting file from storage:", storageError);
          // Continue even if storage deletion fails
        }
      }

      toast.success("Paper deleted successfully!");
      fetchPapers();
    } catch (error) {
      console.error("Error deleting paper:", error);
      toast.error("Error deleting paper: " + error.message);
    }
  };

  const handleEdit = (paper) => {
    setEditingPaper(paper);
    setEditData({
      subject: paper.subject,
      branch: paper.branch,
      year: paper.year,
      semester: paper.semester,
      examType: paper.examType,
      description: paper.description || "",
    });
  };

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "papers", editingPaper.id), {
        subject: editData.subject,
        branch: editData.branch,
        year: parseInt(editData.year),
        semester: parseInt(editData.semester),
        examType: editData.examType,
        description: editData.description,
      });
      toast.success("Paper updated successfully!");
      setEditingPaper(null);
      fetchPapers();
    } catch (error) {
      console.error("Error updating paper:", error);
      toast.error("Error updating paper: " + error.message);
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
        <h2 className="text-2xl font-bold text-navy">Manage Uploaded Papers</h2>
        <button
          onClick={fetchPapers}
          className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-teal-dark transition duration-200"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <input
          type="text"
          placeholder="Filter by Branch"
          value={filters.branch}
          onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
          className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
        />
        <input
          type="text"
          placeholder="Filter by Year"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
        />
        <input
          type="text"
          placeholder="Filter by Subject"
          value={filters.subject}
          onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
          className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
        />
        <input
          type="text"
          placeholder="Filter by Semester"
          value={filters.semester}
          onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
          className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy"
        />
      </div>

      {/* Papers Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-navy text-white">
            <tr>
              <th className="px-4 py-3 text-left">Subject</th>
              <th className="px-4 py-3 text-left">Branch</th>
              <th className="px-4 py-3 text-left">Year</th>
              <th className="px-4 py-3 text-left">Semester</th>
              <th className="px-4 py-3 text-left">Exam Type</th>
              <th className="px-4 py-3 text-left">Uploaded By</th>
              <th className="px-4 py-3 text-left">Upload Date</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPapers.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                  {papers.length === 0
                    ? "No papers found. Upload your first paper!"
                    : "No papers match the filters."}
                </td>
              </tr>
            ) : (
              filteredPapers.map((paper) => (
                <tr key={paper.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{paper.subject}</td>
                  <td className="px-4 py-3">{paper.branch}</td>
                  <td className="px-4 py-3">{paper.year}</td>
                  <td className="px-4 py-3">{paper.semester}</td>
                  <td className="px-4 py-3 capitalize">{paper.examType}</td>
                  <td className="px-4 py-3 text-sm">{paper.uploadedByName || "Unknown"}</td>
                  <td className="px-4 py-3 text-sm">
                    {paper.uploadedAt
                      ? new Date(paper.uploadedAt.toMillis()).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <a
                        href={paper.fileURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleEdit(paper)}
                        className="text-teal-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(paper)}
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

      {/* Edit Modal */}
      {editingPaper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-navy mb-4">Edit Paper Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={editData.subject}
                  onChange={(e) => setEditData({ ...editData, subject: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                <input
                  type="text"
                  value={editData.branch}
                  onChange={(e) => setEditData({ ...editData, branch: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={editData.year}
                    onChange={(e) => setEditData({ ...editData, year: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <input
                    type="number"
                    value={editData.semester}
                    onChange={(e) => setEditData({ ...editData, semester: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                <select
                  value={editData.examType}
                  onChange={(e) => setEditData({ ...editData, examType: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                >
                  <option value="mid">Midterm</option>
                  <option value="endsem">End Semester</option>
                  <option value="practical">Practical</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy-dark"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingPaper(null)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

