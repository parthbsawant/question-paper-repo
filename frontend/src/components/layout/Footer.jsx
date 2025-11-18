export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-400">
              Email: examcell@college.edu
              <br />
              Phone: +91-XXX-XXX-XXXX
              <br />
              Address: College Campus, City, State
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-teal transition duration-200">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/login?role=student"
                  className="hover:text-teal transition duration-200"
                >
                  Student Portal
                </a>
              </li>
              <li>
                <a
                  href="/login?role=admin"
                  className="hover:text-teal transition duration-200"
                >
                  Admin Portal
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <p className="text-gray-400">
              Cloud-based academic question paper repository system for secure
              and organized access to previous year papers.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Question Paper Repository. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

