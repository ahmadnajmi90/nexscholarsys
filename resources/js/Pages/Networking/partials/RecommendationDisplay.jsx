import React, { useState, useEffect } from 'react';
import { FaComment, FaHandsHelping, FaLightbulb, FaClock } from 'react-icons/fa';
import axios from 'axios';

export default function RecommendationDisplay({ academicianId }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(null); // No active tab by default
  const [ratings, setRatings] = useState({
    averages: {},
    counts: {}
  });

  useEffect(() => {
    if (academicianId) {
      setLoading(true);
      axios.get(route('academicians.recommendations.get', academicianId))
        .then(response => {
          // Get the raw recommendations data for display
          if (response.data && response.data.recommendations) {
            setRecommendations(response.data.recommendations);
          } else {
            setRecommendations([]);
          }
          
          // Get the ratings data including counts
          if (response.data && response.data.ratings) {
            setRatings(response.data.ratings);
          }
          
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching recommendations:', error);
          setError('Failed to load recommendations');
          setLoading(false);
        });
    }
  }, [academicianId]);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-sm">{error}</p>;
  }

  // Initialize recommendations as empty array if null/undefined to ensure tab buttons always show
  const safeRecommendations = recommendations || [];

  const tabButtons = [
    { id: 'communication', icon: <FaComment size={28} className="text-blue-500" /> },
    { id: 'support', icon: <FaHandsHelping size={28} className="text-pink-500" /> },
    { id: 'expertise', icon: <FaLightbulb size={28} className="text-yellow-500" /> },
    { id: 'responsiveness', icon: <FaClock size={28} className="text-red-500" /> }
  ];

  // Get the count for the selected tab
  const getCount = (tabId) => {
    return ratings.counts && ratings.counts[tabId] ? ratings.counts[tabId] : 0;
  };

  // Handle tab click
  const handleTabClick = (tabId) => {
    // Toggle the active tab when clicked
    setActiveTab(activeTab === tabId ? null : tabId);
  };

  // Filter recommendations with comments for the active tab
  const filteredRecommendations = activeTab ? safeRecommendations.filter(
    rec => rec[`${activeTab}_comment`] && rec[`${activeTab}_comment`].trim() !== ''
  ) : [];

  return (
    <div>
      
      {/* Recommendation summary in horizontal layout */}
      <div className="flex items-center justify-start gap-6 w-full">
        {tabButtons.map((tab) => (
          <div 
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className="flex items-center cursor-pointer transition-transform duration-200 hover:scale-105"
          >
            <div className={`p-1 rounded-full ${activeTab === tab.id ? 'bg-gray-200' : ''}`}>
              {tab.icon}
            </div>
            <span className="text-gray-700 text-lg font-medium ml-1">{getCount(tab.id)}</span>
          </div>
        ))}
      </div>

      {/* Comment display - only show when a tab is selected */}
      {activeTab && (
        <div className="mt-4 transition-all duration-300">
          {filteredRecommendations.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto px-0 py-2">
              {filteredRecommendations.map((rec, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                  <p className="text-gray-700">{rec[`${activeTab}_comment`]}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(rec.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic p-2 text-center">No comments yet for this category</p>
          )}
        </div>
      )}
    </div>
  );
} 