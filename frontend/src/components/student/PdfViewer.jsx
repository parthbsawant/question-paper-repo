import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfViewer({ paper, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(error) {
    console.error("Error loading PDF:", error);
    setLoading(false);
  }

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-navy text-white rounded-t-lg">
          <div>
            <h3 className="text-lg font-semibold">{paper.subject}</h3>
            <p className="text-sm text-gray-200">
              {paper.year} | Semester {paper.semester} | {paper.examType}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {numPages && (
              <span className="text-sm">
                Page {pageNumber} of {numPages}
              </span>
            )}
            <button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-200"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* PDF Controls */}
        {numPages && numPages > 1 && (
          <div className="flex justify-center items-center p-2 bg-gray-100 border-b">
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="px-4 py-2 bg-navy text-white rounded-l-lg hover:bg-navy-dark disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              ‹ Previous
            </button>
            <span className="px-4 py-2 bg-white border-t border-b">
              Page {pageNumber} / {numPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="px-4 py-2 bg-navy text-white rounded-r-lg hover:bg-navy-dark disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              Next ›
            </button>
            <a
              href={paper.fileURL}
              download
              className="ml-4 px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark transition duration-200"
            >
              ⬇ Download
            </a>
          </div>
        )}

        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto p-4 bg-gray-100 flex justify-center">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4"></div>
                <p className="text-gray-600">Loading PDF...</p>
              </div>
            </div>
          )}
          <Document
            file={paper.fileURL}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading PDF...</p>
                </div>
              </div>
            }
            error={
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">⚠️</div>
                  <p className="text-red-600 font-semibold mb-2">Failed to load PDF</p>
                  <p className="text-gray-600 mb-4">
                    The PDF file could not be loaded. Please try downloading it instead.
                  </p>
                  <a
                    href={paper.fileURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark transition duration-200"
                  >
                    Open in New Tab
                  </a>
                </div>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-lg"
            />
          </Document>
        </div>
      </div>
    </div>
  );
}

