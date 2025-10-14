/**
 * Supervision Helper Functions
 * Shared utilities for supervision components
 */

/**
 * Get status badge color based on status
 * @param {string} status - The status string
 * @returns {string} - Tailwind CSS classes for badge styling
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'pending_student_acceptance':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'accepted':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'rejected':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'cancelled':
    case 'auto_cancelled':
      return 'bg-slate-50 text-slate-700 border-slate-200';
    case 'active':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'pending_unbind':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'completed':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'terminated':
      return 'bg-red-50 text-red-700 border-red-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

/**
 * Format status string for display
 * @param {string} status - The status string (e.g., 'pending_student_acceptance')
 * @returns {string} - Formatted status (e.g., 'Pending Student Acceptance')
 */
export const formatStatus = (status) => {
  if (!status) return '';
  
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Get initials from full name
 * @param {string} fullName - The person's full name
 * @param {number} maxLength - Maximum number of initials (default: 3)
 * @returns {string} - Initials (e.g., 'JD' or 'JDS')
 */
export const getInitials = (fullName, maxLength = 3) => {
  if (!fullName) return '';
  
  return fullName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, maxLength);
};

/**
 * Get avatar URL from profile picture path
 * @param {string} profilePicture - The profile picture path
 * @returns {string|null} - Full URL or null if no picture
 */
export const getAvatarUrl = (profilePicture) => {
  return profilePicture ? `/storage/${profilePicture}` : null;
};

/**
 * Check if a file is previewable (image or PDF under max size)
 * @param {Object} attachment - The attachment object
 * @param {number} maxSize - Maximum file size in bytes (default: 15MB)
 * @returns {boolean} - Whether the file can be previewed
 */
export const isFilePreviewable = (attachment, maxSize = 15 * 1024 * 1024) => {
  if (!attachment || !attachment.mime_type) return false;
  
  const isImage = attachment.mime_type.startsWith('image/');
  const isPdf = attachment.mime_type === 'application/pdf';
  const isUnderSizeLimit = attachment.size < maxSize;
  
  return (isImage || isPdf) && isUnderSizeLimit;
};

/**
 * Format attachment for preview modal
 * @param {Object} attachment - The attachment object
 * @returns {Object} - Formatted attachment for preview
 */
export const formatAttachmentForPreview = (attachment) => {
  return {
    url: `/storage/${attachment.path}`,
    original_name: attachment.original_name || 'Attachment',
    mime_type: attachment.mime_type,
    size_formatted: attachment.size_formatted || `${(attachment.size / 1024).toFixed(1)} KB`,
    created_at: attachment.created_at,
  };
};

/**
 * Handle attachment click - preview or open in new tab
 * @param {Object} attachment - The attachment object
 * @param {Function} setPreviewFile - Callback to set preview file
 * @param {number} maxPreviewSize - Maximum size for preview (default: 15MB)
 */
export const handleAttachmentClick = (attachment, setPreviewFile, maxPreviewSize = 15 * 1024 * 1024) => {
  if (isFilePreviewable(attachment, maxPreviewSize)) {
    setPreviewFile(formatAttachmentForPreview(attachment));
  } else {
    // For non-previewable files, open in new tab
    window.open(`/storage/${attachment.path}`, '_blank', 'noopener,noreferrer');
  }
};

