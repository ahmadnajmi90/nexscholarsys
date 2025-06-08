import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FaUserClock, FaCheck, FaTimes, FaUser } from 'react-icons/fa';
import { Link } from '@inertiajs/react';

const NotificationPanel = ({ 
  isOpen, 
  closePanel, 
  pendingRequests, 
  handleAcceptRequest, 
  handleRejectRequest,
  isLoading
}) => {
  // Helper function to get the correct profile link
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

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog 
        as="div" 
        className="fixed inset-0 z-50 overflow-hidden" 
        onClose={closePanel}
      >
        <div className="absolute inset-0 overflow-hidden">
          {/* Background overlay */}
          <Transition.Child
            as={React.Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" />
          </Transition.Child>

          {/* Panel */}
          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <Transition.Child
              as={React.Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="relative w-screen max-w-md">
                <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-auto">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900 flex items-center">
                        <FaUserClock className="mr-2 text-blue-500" />
                        Pending Requests
                      </Dialog.Title>
                      <button
                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={closePanel}
                      >
                        <span className="sr-only">Close panel</span>
                        <FaTimes className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-6 relative flex-1 px-4 sm:px-6">
                    {isLoading ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    ) : pendingRequests.length > 0 ? (
                      <div className="space-y-4">
                        {pendingRequests.map(request => (
                          <div key={request.connection_id} className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                            <div className="p-4 flex items-center">
                              <div className="flex-shrink-0">
                                <img 
                                  src={request.profile?.profile_picture ? `/storage/${request.profile.profile_picture}` : '/storage/profile_pictures/default.jpg'} 
                                  alt={request.name} 
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              </div>
                              <div className="ml-3 flex-grow">
                                <h3 className="font-semibold">{request.name}</h3>
                                <p className="text-gray-600 text-sm">
                                  {request.profile?.current_position || request.profile?.research_title || 'No details available'}
                                </p>
                              </div>
                              <div className="flex-shrink-0 space-x-2 flex">
                                <button
                                  onClick={() => handleAcceptRequest(request.connection_id)}
                                  className="inline-flex items-center p-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                                  title="Accept Request"
                                >
                                  <FaCheck />
                                </button>
                                <button
                                  onClick={() => handleRejectRequest(request.connection_id)}
                                  className="inline-flex items-center p-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                                  title="Reject Request"
                                >
                                  <FaTimes />
                                </button>
                                <Link 
                                  href={getProfileLink(request.profile)}
                                  className="inline-flex items-center p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                                  title="View Profile"
                                >
                                  <FaUser />
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <FaUserClock className="mx-auto text-4xl text-gray-400 mb-2" />
                        <p className="text-gray-500">You have no pending connection requests.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default NotificationPanel; 