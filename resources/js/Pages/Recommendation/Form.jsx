import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { FaArrowLeft, FaComment, FaHandsHelping, FaLightbulb, FaClock, FaStar } from 'react-icons/fa';
import axios from 'axios';

export default function RecommendationForm({ academician, hasRecommended }) {
  const [ratings, setRatings] = useState({
    communication_rating: 0,
    communication_comment: '',
    support_rating: 0,
    support_comment: '',
    expertise_rating: 0,
    expertise_comment: '',
    responsiveness_rating: 0,
    responsiveness_comment: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle rating change
  const handleRatingChange = (category, value) => {
    setRatings({ ...ratings, [category]: value });
  };

  // Handle comment change
  const handleCommentChange = (category, value) => {
    setRatings({ ...ratings, [category]: value });
  };

  // Submit the recommendation
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    axios.post(route('academicians.recommendations.store'), {
      academician_id: academician.academician_id,
      ...ratings
    })
      .then(response => {
        setSubmitting(false);
        setSuccess(true);
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

  // Render stars for ratings
  const renderStars = (category, rating) => {
    return (
      <div className="flex items-center space-x-1 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(`${category}_rating`, star)}
            className={`h-8 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              star <= ratings[`${category}_rating`] 
                ? 'text-yellow-500 hover:text-yellow-600' 
                : 'text-gray-300 hover:text-gray-400'
            }`}
          >
            <FaStar className="w-6 h-6" />
          </button>
        ))}
      </div>
    );
  };

  // Show thank you message if they've already recommended
  if (hasRecommended) {
    return (
      <>
        <Head title="Thank You for Your Recommendation" />
        <div className="max-w-3xl mx-auto pt-10 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Thank You!</h2>
              <div className="flex justify-center mb-8">
                <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="h-12 w-12 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="text-center text-gray-600 mb-6">
                You have already submitted a recommendation for {academician.full_name}. Thank you for your valuable feedback!
              </p>
              <div className="flex justify-center">
                <Link
                  href={route('academicians.show', academician.url)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <FaArrowLeft className="mr-2" />
                  Return to Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Show success message after submission
  if (success) {
    return (
      <>
        <Head title="Recommendation Submitted" />
        <div className="max-w-3xl mx-auto pt-10 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Thank You!</h2>
              <div className="flex justify-center mb-8">
                <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="h-12 w-12 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="text-center text-gray-600 mb-6">
                Your recommendation for {academician.full_name} has been successfully submitted. Thank you for your valuable feedback!
              </p>
              <div className="flex justify-center">
                <Link
                  href={route('academicians.show', academician.url)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <FaArrowLeft className="mr-2" />
                  Return to Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Main form
  return (
    <>
      <Head title={`Recommend ${academician.full_name}`} />
      <div className="max-w-3xl mx-auto pt-10 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="mb-6">
              <Link
                href={route('academicians.show', academician.url)}
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaArrowLeft className="mr-2" />
                Back to Profile
              </Link>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommend {academician.full_name}</h2>
            <p className="text-gray-600 mb-8">
              Please rate your experience with this academician in the following categories. Your recommendation will help others make informed decisions.
            </p>
            
            {errors.general && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errors.general}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Communication */}
              <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center mb-4">
                  <FaComment className="text-blue-500 mr-3 h-6 w-6" />
                  <h3 className="text-lg font-medium text-gray-900">Communication</h3>
                </div>
                <p className="text-gray-600 mb-3">How effective is this academician at communicating ideas, feedback, and expectations?</p>
                {renderStars('communication', ratings.communication_rating)}
                {errors.communication_rating && (
                  <p className="mt-1 text-sm text-red-600">{errors.communication_rating}</p>
                )}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comments (optional)</label>
                  <textarea
                    rows="3"
                    className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Add specific details about communication style..."
                    value={ratings.communication_comment}
                    onChange={(e) => handleCommentChange('communication_comment', e.target.value)}
                  ></textarea>
                  {errors.communication_comment && (
                    <p className="mt-1 text-sm text-red-600">{errors.communication_comment}</p>
                  )}
                </div>
              </div>
              
              {/* Support */}
              <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center mb-4">
                  <FaHandsHelping className="text-pink-500 mr-3 h-6 w-6" />
                  <h3 className="text-lg font-medium text-gray-900">Supportiveness</h3>
                </div>
                <p className="text-gray-600 mb-3">How supportive is this academician when you face challenges or need assistance?</p>
                {renderStars('support', ratings.support_rating)}
                {errors.support_rating && (
                  <p className="mt-1 text-sm text-red-600">{errors.support_rating}</p>
                )}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comments (optional)</label>
                  <textarea
                    rows="3"
                    className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Add specific details about supportiveness..."
                    value={ratings.support_comment}
                    onChange={(e) => handleCommentChange('support_comment', e.target.value)}
                  ></textarea>
                  {errors.support_comment && (
                    <p className="mt-1 text-sm text-red-600">{errors.support_comment}</p>
                  )}
                </div>
              </div>
              
              {/* Expertise */}
              <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center mb-4">
                  <FaLightbulb className="text-yellow-500 mr-3 h-6 w-6" />
                  <h3 className="text-lg font-medium text-gray-900">Expertise & Knowledge</h3>
                </div>
                <p className="text-gray-600 mb-3">How would you rate this academician's expertise and depth of knowledge in their field?</p>
                {renderStars('expertise', ratings.expertise_rating)}
                {errors.expertise_rating && (
                  <p className="mt-1 text-sm text-red-600">{errors.expertise_rating}</p>
                )}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comments (optional)</label>
                  <textarea
                    rows="3"
                    className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Add specific details about expertise and knowledge..."
                    value={ratings.expertise_comment}
                    onChange={(e) => handleCommentChange('expertise_comment', e.target.value)}
                  ></textarea>
                  {errors.expertise_comment && (
                    <p className="mt-1 text-sm text-red-600">{errors.expertise_comment}</p>
                  )}
                </div>
              </div>
              
              {/* Responsiveness */}
              <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center mb-4">
                  <FaClock className="text-red-500 mr-3 h-6 w-6" />
                  <h3 className="text-lg font-medium text-gray-900">Responsiveness & Availability</h3>
                </div>
                <p className="text-gray-600 mb-3">How responsive and available is this academician when you need to reach them?</p>
                {renderStars('responsiveness', ratings.responsiveness_rating)}
                {errors.responsiveness_rating && (
                  <p className="mt-1 text-sm text-red-600">{errors.responsiveness_rating}</p>
                )}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comments (optional)</label>
                  <textarea
                    rows="3"
                    className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Add specific details about responsiveness and availability..."
                    value={ratings.responsiveness_comment}
                    onChange={(e) => handleCommentChange('responsiveness_comment', e.target.value)}
                  ></textarea>
                  {errors.responsiveness_comment && (
                    <p className="mt-1 text-sm text-red-600">{errors.responsiveness_comment}</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                    submitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : 'Submit Recommendation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
} 