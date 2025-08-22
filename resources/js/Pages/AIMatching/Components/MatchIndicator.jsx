import React from 'react';

const MatchIndicator = ({ score, showDetails = false }) => {
  // Parse the score to ensure it's a number between 0 and 1
  const numericScore = parseFloat(score);
  const validScore = !isNaN(numericScore) && numericScore >= 0 && numericScore <= 1 
    ? numericScore 
    : 0.5; // Default to middle if invalid
  
  // Calculate percentage for display
  const percentage = Math.round(validScore * 100);
  
  // Determine color gradient based on score
  const getColor = (score) => {
    if (score < 0.3) return 'bg-red-500';
    if (score < 0.5) return 'bg-orange-500';
    if (score < 0.7) return 'bg-yellow-500';
    if (score < 0.9) return 'bg-green-500';
    return 'bg-emerald-500';
  };
  
  // Label based on score
  const getMatchLabel = (score) => {
    if (score < 0.3) return 'Poor Match';
    if (score < 0.5) return 'Fair Match';
    if (score < 0.7) return 'Good Match';
    if (score < 0.9) return 'Great Match';
    return 'Excellent Match';
  };
  
  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center mb-1 text-xs">
        <span className="font-medium text-gray-700">{getMatchLabel(validScore)}</span>
        <span className="font-bold">{percentage}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
        <div 
          className={`h-2.5 rounded-full ${getColor(validScore)}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      {showDetails && (
        <div className="mt-2 text-xs text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Query match:</span>
            <span className="font-medium">{Math.round(validScore * 0.6 * 100)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Profile match:</span>
            <span className="font-medium">{Math.round(validScore * 0.4 * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchIndicator; 