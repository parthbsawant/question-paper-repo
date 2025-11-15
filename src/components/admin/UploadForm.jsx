import { useState } from "react";
import { db, storage, auth } from "../../utils/firebase.js";
import { addDoc, collection, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { toast } from "react-toastify";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState({
    subject: "",
    branch: "",
    year: "",
    semester: "",
    examType: "",
    description: "",
  });
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      toast.error("Please select a PDF file only.");
      return;
    }

    if (selectedFile.size > 25 * 1024 * 1024) {
      toast.error("File size must be less than 25MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please select a PDF file!");
      return;
    }

    const { subject, branch, year, semester, examType } = data;
    if (!subject || !branch || !year || !semester || !examType) {
      toast.error("All required fields must be filled.");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("You must be logged in to upload.");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const uploadedByName = userDoc.exists() ? userDoc.data().name : user.email;

      const storagePath = `question_papers/${branch}/${year}/${semester}/${subject}_${Date.now()}.pdf`;
      const storageRef = ref(storage, storagePath);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        async (error) => {
          console.error("Upload error:", error);
          toast.error("Upload failed: " + error.message);
          setUploading(false);
          setProgress(0);
        },
        async () => {
          try {
            const fileURL = await getDownloadURL(uploadTask.snapshot.ref);

            await addDoc(collection(db, "papers"), {
              subject: data.subject,
              branch: data.branch,
              year: parseInt(data.year),
              semester: parseInt(data.semester),
              examType: data.examType,
              description: data.description || "",
              fileURL,
              filePath: storagePath,
              uploadedAt: serverTimestamp(),
              uploadedBy: user.uid,
              uploadedByName,
            });

            // Optional: Log to audit
            try {
              await addDoc(collection(db, "auditLogs"), {
                actorUid: user.uid,
                actorName: uploadedByName,
                action: "upload",
                targetId: "",
                timestamp: serverTimestamp(),
              });
            } catch (auditError) {
              console.error("Audit log error:", auditError);
            }

            toast.success("Paper uploaded successfully!");
            setFile(null);
            setData({
              subject: "",
              branch: "",
              year: "",
              semester: "",
              examType: "",
              description: "",
            });
            setProgress(0);
            // Reset file input
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = "";
          } catch (error) {
            console.error("Error saving paper data:", error);
            toast.error("Error saving paper data. File may have been uploaded.");
            // Try to delete uploaded file on error
            try {
              await deleteObject(storageRef);
            } catch (deleteError) {
              console.error("Error deleting file:", deleteError);
            }
          } finally {
            setUploading(false);
          }
        }
      );
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed: " + error.message);
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-navy mb-6">Upload Question Paper</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              name="subject"
              placeholder="e.g., Data Structures"
              value={data.subject}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch <span className="text-red-500">*</span>
            </label>
            <input
              name="branch"
              placeholder="e.g., Computer Engineering"
              value={data.branch}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year <span className="text-red-500">*</span>
            </label>
            <input
              name="year"
              type="number"
              placeholder="e.g., 2023"
              value={data.year}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semester <span className="text-red-500">*</span>
            </label>
            <input
              name="semester"
              type="number"
              placeholder="e.g., 6"
              value={data.semester}
              onChange={handleChange}
              min="1"
              max="8"
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exam Type <span className="text-red-500">*</span>
            </label>
            <select
              name="examType"
              value={data.examType}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              required
            >
              <option value="">Select Exam Type</option>
              <option value="mid">Midterm</option>
              <option value="endsem">End Semester</option>
              <option value="practical">Practical</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              name="description"
              placeholder="Additional notes about this paper..."
              value={data.description}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PDF File <span className="text-red-500">*</span> (Max 25MB)
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              required
            />
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
        </div>

        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-teal h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
            <p className="text-sm text-gray-600 mt-1">Upload progress: {progress.toFixed(0)}%</p>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading || !file}
          className="w-full bg-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-navy-dark transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading..." : "Upload Paper"}
        </button>
      </form>
    </div>
  );
}

