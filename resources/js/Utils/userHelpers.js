/**
 * Get the full name from a user object with role-specific relationships
 * @param {Object} user - User object with potential academician, postgraduate, undergraduate relationships
 * @returns {string} - The user's full name from their role profile or fallback to user.name
 */
export const getUserFullName = (user) => {
    if (!user) return 'Unknown User';
    
    return user.academician?.full_name || 
           user.postgraduate?.full_name || 
           user.undergraduate?.full_name || 
           user.name;
};

/**
 * Get the profile picture from a user object with role-specific relationships
 * @param {Object} user - User object with potential academician, postgraduate, undergraduate relationships
 * @returns {string} - The user's profile picture URL or default avatar
 */
export const getUserProfilePicture = (user) => {
    if (!user) return '/storage/profile_pictures/default.jpg';
    
    // Check for role-specific profile pictures
    if (user.academician?.profile_picture) {
        return `/storage/${user.academician.profile_picture}`;
    }
    if (user.postgraduate?.profile_picture) {
        return `/storage/${user.postgraduate.profile_picture}`;
    }
    if (user.undergraduate?.profile_picture) {
        return `/storage/${user.undergraduate.profile_picture}`;
    }
    
    // Fallback to user avatar_url or default
    return user.avatar_url || '/storage/profile_pictures/default.jpg';
}; 