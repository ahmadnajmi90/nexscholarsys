/**
 * BookmarkHandler - Utility functions for managing bookmarks across components
 */

import axios from 'axios';

export default class BookmarkHandler {
  /**
   * Check if an item is bookmarked by the current user
   * 
   * @param {string} type - The type of bookmarkable item ('academician', 'event', 'project', 'grant', 'post')
   * @param {number} id - The ID of the bookmarkable item
   * @returns {Promise<Object>} Object containing bookmark status information
   */
  static async checkBookmarkStatus(type, id) {
    try {
      const response = await axios.get(route('bookmarks.check'), {
        params: {
          bookmarkable_type: type,
          bookmarkable_id: id
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
   * @param {string} type - The type of bookmarkable item ('academician', 'event', 'project', 'grant', 'post')
   * @param {number} id - The ID of the bookmarkable item
   * @param {string} category - The category to assign to the bookmark
   * @returns {Promise<Object>} Object containing updated bookmark information
   */
  static async toggleBookmark(type, id, category = 'general') {
    try {
      const response = await axios.post(route('bookmarks.toggle'), {
        bookmarkable_type: type,
        bookmarkable_id: id,
        category: category
      });
      return response.data;
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      throw error;
    }
  }

  /**
   * Remove a bookmark by ID
   * 
   * @param {number} bookmarkId - The ID of the bookmark to remove
   * @returns {Promise<Object>} Response data from the server
   */
  static async removeBookmark(bookmarkId) {
    try {
      const response = await axios.delete(route('bookmarks.destroy', bookmarkId));
      return response.data;
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  }
} 