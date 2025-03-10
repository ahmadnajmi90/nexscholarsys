// CVPreviewModal.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CVPreviewModal({ onClose, onDownload }) {
  const [cvText, setCvText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(route('role.generateCV'), { params: { preview: 1 } })
      .then((response) => {
        setCvText(response.data.cv_text);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching CV preview:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">CV Preview</h2>
        {isLoading ? (
          <p>Loading preview...</p>
        ) : (
          <>
            <textarea
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              rows={10}
              className="w-full border p-2"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={onClose}
                className="mr-2 px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => onDownload(cvText)}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Download CV
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
