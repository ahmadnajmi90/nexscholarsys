import React, { useState } from 'react';
import { FaComment, FaHandsHelping, FaLightbulb, FaClock, FaTimes } from 'react-icons/fa';
import axios from 'axios';

export default function RecommendationModal({ academician, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    academician_id: academician.academician_id,
    communication_comment: '',
    support_comment: '',
    expertise_comment: '',
    responsiveness_comment: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  // Handle comment change
  const handleCommentChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Submit the recommendation
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    axios.post(route('academicians.recommendations.store'), formData)
      .then(response => {
        setSubmitting(false);
        if (onSuccess) onSuccess();
      })
      .catch(error => {
        setSubmitting(false);
        if (error.response && error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else if (error.response && error.response.data.error) {
          setErrors({ general: error.response.data.error });
        } else {
          setErrors({ general: 'An error occurred while submitting your recommendation.' });
        }
      });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recommend {academician.full_name}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FaTimes />
          </button>
        </div>
        
        {errors.general && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            </div>
          </div>
        )}

        <p className="text-gray-600 mb-6">
          Share your experience working with {academician.full_name}. Your comments will help others make informed decisions.
        </p>
            
        <form onSubmit={handleSubmit}>
          {/* Communication */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <FaComment className="text-blue-500 mr-2 h-5 w-5" />
              <h3 className="text-md font-medium text-gray-900">Communication</h3>
            </div>
            <textarea
              rows="3"
              className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
              placeholder="How effective is their communication style? Share your thoughts..."
              value={formData.communication_comment}
              onChange={(e) => handleCommentChange('communication_comment', e.target.value)}
            ></textarea>
            {errors.communication_comment && (
              <p className="mt-1 text-sm text-red-600">{errors.communication_comment}</p>
            )}
          </div>
          
          {/* Supportiveness */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <FaHandsHelping className="text-pink-500 mr-2 h-5 w-5" />
              <h3 className="text-md font-medium text-gray-900">Supportiveness</h3>
            </div>
            <textarea
              rows="3"
              className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
              placeholder="How supportive are they? Share your experience..."
              value={formData.support_comment}
              onChange={(e) => handleCommentChange('support_comment', e.target.value)}
            ></textarea>
            {errors.support_comment && (
              <p className="mt-1 text-sm text-red-600">{errors.support_comment}</p>
            )}
          </div>
          
          {/* Expertise */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <FaLightbulb className="text-yellow-500 mr-2 h-5 w-5" />
              <h3 className="text-md font-medium text-gray-900">Expertise & Knowledge</h3>
            </div>
            <textarea
              rows="3"
              className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
              placeholder="How would you rate their expertise and knowledge? Share your insights..."
              value={formData.expertise_comment}
              onChange={(e) => handleCommentChange('expertise_comment', e.target.value)}
            ></textarea>
            {errors.expertise_comment && (
              <p className="mt-1 text-sm text-red-600">{errors.expertise_comment}</p>
            )}
          </div>
          
          {/* Responsiveness */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <FaClock className="text-red-500 mr-2 h-5 w-5" />
              <h3 className="text-md font-medium text-gray-900">Responsiveness & Availability</h3>
            </div>
            <textarea
              rows="3"
              className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
              placeholder="How responsive and available are they? Share your experience..."
              value={formData.responsiveness_comment}
              onChange={(e) => handleCommentChange('responsiveness_comment', e.target.value)}
            ></textarea>
            {errors.responsiveness_comment && (
              <p className="mt-1 text-sm text-red-600">{errors.responsiveness_comment}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
                submitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {submitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : 'Submit Recommendation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 