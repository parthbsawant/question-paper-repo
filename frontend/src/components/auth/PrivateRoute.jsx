import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../utils/firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function PrivateRoute({ children, role }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login?role=" + role);
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
          console.error("User document not found for UID:", user.uid);
          toast.error("User data not found in database. Please contact support.");
          await auth.signOut();
          navigate("/login?role=" + role);
          setLoading(false);
          return;
        }

        const userData = userDoc.data();
        console.log("PrivateRoute - User data:", userData); // Debug log

        // Check if active field exists and is true
        if (userData.active === false || userData.active === undefined) {
          toast.error("Your account has been disabled. Please contact the exam cell.");
          await auth.signOut();
          navigate("/");
          setLoading(false);
          return;
        }

        // Check if role matches
        if (userData.role !== role) {
          console.error(`Role mismatch: Expected ${role}, got ${userData.role}`);
          toast.error(`Unauthorized access. You are logged in as ${userData.role}, but this section requires ${role}.`);
          navigate("/");
          setLoading(false);
          return;
        }

        setAuthorized(true);
      } catch (error) {
        console.error("Error checking user role:", error);
        toast.error("Error verifying access: " + error.message);
        navigate("/login?role=" + role);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate, role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return authorized ? children : null;
}

