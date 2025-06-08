import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { FaUser, FaBookmark, FaTrash, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ConnectionHandler from '@/Utils/ConnectionHandler';
import axios from 'axios';

const ConnectionsIndex = ({ auth, friends, bookmarks = [] }) => {
  const [activeTab, setActiveTab] = useState('friends');
  const [updatedFriends, setUpdatedFriends] = useState(friends || []);
  const [updatedBookmarks, setUpdatedBookmarks] = useState(bookmarks);
  const [isLoadingBookmarks, setIsLoadingBookmarks] = useState(false);

  // Fetch bookmarks when tab changes to 'bookmarks' or on initial load if bookmarks tab is active
  useEffect(() => {
    if (activeTab === 'bookmarks' && updatedBookmarks.length === 0) {
      fetchBookmarks();
    }
  }, [activeTab]);

  // Function to fetch bookmarks from the BookmarkController
  const fetchBookmarks = async () => {
    setIsLoadingBookmarks(true);
    try {
      const response = await axios.get(route('bookmarks.index'));
      
      if (response.data.bookmarks && response.data.bookmarks.Profiles) {
        // Format bookmarks to match the expected structure
        const formattedBookmarks = response.data.bookmarks.Profiles.map(bookmark => {
          return {
            connection_id: bookmark.id,
            user_id: bookmark.bookmarkable_id,
            name: bookmark.bookmarkable.name || 'Unknown User',
            email: bookmark.bookmarkable.email || '',
            profile: {
              profile_picture: bookmark.bookmarkable.profile_picture || null,
              type: 'academician', // Default type
              url: bookmark.bookmarkable.url || '',
              current_position: bookmark.bookmarkable.current_position || '',
              research_title: bookmark.bookmarkable.research_title || '',
              university: bookmark.bookmarkable.university || ''
            },
            created_at: bookmark.created_at
          };
        });
        
        setUpdatedBookmarks(formattedBookmarks);
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      toast.error('Failed to fetch bookmarks. Please try again.', {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoadingBookmarks(false);
    }
  };

  const handleRemoveConnection = async (userId) => {
    try {
      await ConnectionHandler.removeConnection(userId);
      
      // Update the UI by removing the connection
      setUpdatedFriends(updatedFriends.filter(friend => friend.user_id !== userId));
      
      toast.success('Connection removed successfully.', {
        position: "bottom-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Error removing connection:', error);
      toast.error('Failed to remove connection. Please try again.', {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  const handleRemoveBookmark = async (bookmarkId) => {
    try {
      await axios.delete(route('bookmarks.destroy', bookmarkId));
      
      // Update the UI by removing the bookmark
      setUpdatedBookmarks(updatedBookmarks.filter(bookmark => bookmark.connection_id !== bookmarkId));
      
      toast.success('Bookmark removed successfully.', {
        position: "bottom-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast.error('Failed to remove bookmark. Please try again.', {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  // Helper function to render the correct profile link based on profile type
  const getProfileLink = (profile) => {
    if (!profile) return '#';
    
    const routeMap = {
      'academician': 'academicians.show',
      'postgraduate': 'postgraduates.show',
      'undergraduate': 'undergraduates.show'
    };
    
    const routeName = routeMap[profile.type];
    if (routeName && profile.url) {
      return route(routeName, profile.url);
    }
    
    return '#';
  };

  // Render a connection card for a user
  const renderConnectionCard = (connection, actionButtons) => {
    const { profile } = connection;
    
    return (
      <div key={connection.connection_id} className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
        <div className="p-4 flex items-center">
          <div className="flex-shrink-0">
            <img 
              src={profile?.profile_picture ? `/storage/${profile.profile_picture}` : '/storage/profile_pictures/default.jpg'} 
              alt={connection.name} 
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
          <div className="ml-4 flex-grow">
            <h3 className="font-semibold text-lg">{connection.name}</h3>
            <p className="text-gray-600 text-sm">
              {profile?.current_position || profile?.research_title || profile?.university || 'No details available'}
            </p>
            <p className="text-gray-500 text-xs">
              Connected since {new Date(connection.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex-shrink-0 space-x-2">
            {actionButtons(connection)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout title="My Connections">
      <Head title="My Connections" />

      <div className="py-6">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              {/* Tabs */}
              <div className="flex border-b mb-6">
                <button
                  onClick={() => setActiveTab('friends')}
                  className={`px-4 py-2 ${
                    activeTab === 'friends'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  } font-medium flex items-center`}
                >
                  <FaUser className="mr-2" />
                  <span>My Connections</span>
                  {updatedFriends.length > 0 && (
                    <span className="ml-2 bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                      {updatedFriends.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Friends Tab Content */}
              {activeTab === 'friends' && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">My Connections</h2>
                  {updatedFriends.length > 0 ? (
                    <div className="space-y-4">
                      {updatedFriends.map(friend => renderConnectionCard(friend, (friend) => (
                        <>
                          <Link 
                            href={route('email.compose', { to: friend.email })}
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                            title="Send Email"
                          >
                            <FaEnvelope />
                          </Link>
                          <Link 
                            href={getProfileLink(friend.profile)}
                            className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 ml-2"
                            title="View Profile"
                          >
                            <FaUser />
                          </Link>
                          <button
                            onClick={() => handleRemoveConnection(friend.user_id)}
                            className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 ml-2"
                            title="Remove Connection"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <FaUser className="mx-auto text-4xl text-gray-400 mb-2" />
                      <p className="text-gray-500">You have no connections yet.</p>
                      <p className="text-gray-400 text-sm mt-2">Explore profiles and send friend requests to build your network.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ConnectionsIndex; 