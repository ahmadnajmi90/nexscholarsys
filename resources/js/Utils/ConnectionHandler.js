/**
 * ConnectionHandler - Utility functions for managing connections across components
 */

import axios from 'axios';

export default class ConnectionHandler {
  /**
   * Check if a user is bookmarked by the current user
   * 
   * @param {number} userId - The ID of the user to check
   * @returns {Promise<Object>} Object containing bookmark status information
   */
  static async checkBookmarkStatus(userId) {
    try {
      const response = await axios.get(route('bookmarks.check'), {
        params: {
          bookmarkable_id: userId,
          bookmarkable_type: 'academician'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      throw error;
    }
  }

  /**
   * Toggle bookmark status (add if not bookmarked, remove if already bookmarked)
   * 
   * @param {number} userId - The ID of the user to bookmark/unbookmark
   * @returns {Promise<Object>} Object containing updated bookmark information
   */
  static async toggleBookmark(userId) {
    try {
      const response = await axios.post(route('bookmarks.toggle'), {
        bookmarkable_id: userId,
        bookmarkable_type: 'academician',
        category: 'Profiles'
      });
      return response.data;
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      throw error;
    }
  }

  /**
   * Send a friend request to a user
   * 
   * @param {number} userId - The ID of the user to send the request to
   * @returns {Promise<Object>} Object containing connection information
   */
  static async sendFriendRequest(userId) {
    try {
      const response = await axios.post(route('connections.friend.request'), {
        user_id: userId
      });
      return response.data;
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw error;
    }
  }

  /**
   * Accept a friend request
   * 
   * @param {number} connectionId - The ID of the connection to accept
   * @returns {Promise<Object>} Object containing connection information
   */
  static async acceptFriendRequest(connectionId) {
    try {
      const response = await axios.post(route('connections.friend.accept', connectionId));
      return response.data;
    } catch (error) {
      console.error('Error accepting friend request:', error);
      throw error;
    }
  }

  /**
   * Reject a friend request
   * 
   * @param {number} connectionId - The ID of the connection to reject
   * @returns {Promise<Object>} Object containing connection information
   */
  static async rejectFriendRequest(connectionId) {
    try {
      const response = await axios.post(route('connections.friend.reject', connectionId));
      return response.data;
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      throw error;
    }
  }

  /**
   * Remove a connection with a user
   * 
   * @param {number} userId - The ID of the user to remove the connection with
   * @returns {Promise<Object>} Object containing status information
   */
  static async removeConnection(userId) {
    try {
      const response = await axios.delete(route('connections.remove'), {
        data: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error removing connection:', error);
      throw error;
    }
  }

  /**
   * Check connection status with a user
   * 
   * @param {number} userId - The ID of the user to check connection status with
   * @returns {Promise<Object>} Object containing connection status information
   */
  static async checkConnectionStatus(userId) {
    try {
      const response = await axios.get(route('connections.status'), {
        params: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking connection status:', error);
      throw error;
    }
  }

  /**
   * Get connections of a specific type and status
   * 
   * @param {string} type - The type of connection ('bookmark', 'friendship', 'supervision')
   * @param {string} status - The status of connection ('pending', 'accepted', 'rejected', 'blocked')
   * @returns {Promise<Object>} Object containing connections
   */
  static async getConnections(type, status = 'accepted') {
    try {
      const response = await axios.get(route('connections.get'), {
        params: { type, status }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting connections:', error);
      throw error;
    }
  }
} 