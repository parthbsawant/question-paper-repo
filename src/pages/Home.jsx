import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-navy mb-6">
              Academic Cloud Question Paper Repository for Fr. Conceicao Rodrigues of Engineering
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              A secure cloud-based platform for students to access and download
              previous year question papers, managed by your college exam cell.
              Experience the benefits of cloud computing with instant access,
              organized storage, and seamless availability from anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/login?role=student"
                className="bg-navy text-white px-8 py-3 rounded-lg shadow-lg hover:bg-navy-dark transition duration-200 font-semibold text-lg"
              >
                Student Login
              </Link>
              <Link
                to="/login?role=admin"
                className="bg-teal text-white px-8 py-3 rounded-lg shadow-lg hover:bg-teal-dark transition duration-200 font-semibold text-lg"
              >
                Admin Login
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-navy mb-2">
                Organized Access
              </h3>
              <p className="text-gray-600">
                All question papers are organized by branch, year, semester, and
                exam type for easy navigation.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">☁️</div>
              <h3 className="text-xl font-semibold text-navy mb-2">
                Cloud Benefits
              </h3>
              <p className="text-gray-600">
                Access your papers from anywhere, anytime. No need to carry
                physical copies or worry about losing them.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-navy mb-2">
                Secure & Reliable
              </h3>
              <p className="text-gray-600">
                PRN-based authentication ensures only authorized students can
                access the repository.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

