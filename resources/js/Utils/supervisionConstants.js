/**
 * Supervision system constants and helper functions
 */

export const REJECTION_REASONS = [
  { value: 'expertise_outside', label: 'Research topic is outside my expertise' },
  { value: 'capacity_full', label: 'I have reached my supervision capacity' },
  { value: 'methodology_mismatch', label: 'Methodology does not align with my research' },
  { value: 'language_communication', label: 'Language or communication concerns' },
  { value: 'timing_conflicts', label: 'Timing or schedule conflicts' },
  { value: 'additional_qualifications', label: 'Student needs additional qualifications' },
  { value: 'other', label: 'Other reason' },
];

/**
 * Get human-readable label for rejection reason code
 */
export const getRejectionReasonLabel = (reasonCode) => {
  if (!reasonCode) return 'No reason provided';
  
  const reason = REJECTION_REASONS.find(r => r.value === reasonCode);
  return reason ? reason.label : reasonCode;
};

/**
 * Format status for display
 */
export const formatSupervisionStatus = (status) => {
  if (!status) return 'Unknown';
  
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

