import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Eye, Globe, Clock } from 'lucide-react';
import { Link } from '@inertiajs/react';
import ReactCountryFlag from 'react-country-flag';

// Helper function to get country code from country name
const getCountryCode = (countryName) => {
  // Simplified country map
  const countryMap = {
    'Malaysia': 'MY',
    'United States': 'US',
    'United Kingdom': 'GB',
    'Croatia': 'HR',
    // Add other countries as needed
  };
  
  return countryMap[countryName] || 'XX'; // Return XX as fallback for unknown countries
};

const UpcomingEvents = ({ 
  events = [], // Accept the new prop
  eventsPage, 
  eventsPerPage, 
  handleEventsPrevPage, 
  handleEventsNextPage, 
  setEventsPage 
}) => {
  // Add state for active filter
  const [activeFilter, setActiveFilter] = useState('All Events');
  // Map the incoming 'events' prop to the structure the component needs
  const upcomingEvents = events.map(event => ({
      name: event.event_name || event.title || 'Untitled Event',
      shortName: event.event_name || event.title || 'Untitled Event', // Or a shortened version if available
      date: event.start_date && event.end_date ? 
        `${new Date(event.start_date).toLocaleDateString()} - ${new Date(event.end_date).toLocaleDateString()}` : 
        event.event_date ? new Date(event.event_date).toLocaleDateString() : 'TBA',
      location: `${event.city || ''}, ${event.country || ''}`.trim() || 'Online',
      type: event.event_type || 'Conference',
      status: event.event_status === 'published' ? 'Registration Open' : event.event_status || 'Upcoming',
      deadline: event.registration_deadline ? new Date(event.registration_deadline).toLocaleDateString() : 'TBA',
      flag: event.country_code || getCountryCode(event.country || 'Malaysia'),
      url: event.url || `/events/${event.id}`,
      category: event.event_theme || event.category || 'Academic'
  }));
  
  // Filter events based on the active filter
  const filteredEvents = activeFilter === 'All Events' 
    ? upcomingEvents 
    : upcomingEvents.filter(event => {
        if (activeFilter === 'Deadlines') {
          return event.deadline && event.deadline !== 'TBA';
        }
        return event.type === activeFilter.slice(0, -1); // Remove 's' from the end (e.g., 'Conferences' -> 'Conference')
      });

  // If no events are provided, use an empty array to prevent errors
  if (upcomingEvents.length === 0) {
    return (
      <div className="mb-8 bg-white rounded-xl shadow-lg overflow-hidden p-6 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">No Upcoming Events</h3>
        <p className="text-gray-600">Check back later for new academic events and conferences.</p>
      </div>
    );
  }
  return (
    <div className="mb-8 bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Enhanced Table Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Upcoming Academic Events</h3>
            <p className="text-sm text-gray-600">Conferences, workshops, and academic gatherings</p>
          </div>
          <span className="text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border">
            {filteredEvents.length} Events
          </span>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex space-x-4">
          {['All Events', 'Conferences', 'Workshops', 'Deadlines'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeFilter === filter
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      {/* Enhanced Events Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Event</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Location</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type & Category</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Deadline</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredEvents.slice((eventsPage - 1) * eventsPerPage, eventsPage * eventsPerPage).map((event, index) => (
              <tr key={index} className="hover:bg-blue-50 transition-all duration-200 group">
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
                      <ReactCountryFlag 
                        countryCode={event.flag}
                        svg
                        style={{
                          width: '1.5em',
                          height: '1.5em',
                        }}
                        title={event.location}
                      />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors duration-200">
                        {event.shortName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{event.location}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {event.type}
                    </span>
                    <div className="text-sm text-gray-600">{event.category}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    event.status === 'Registration Open' ? 'bg-green-100 text-green-800' :
                    event.status === 'Call for Papers' ? 'bg-blue-100 text-blue-800' :
                    event.status === 'Abstract Due' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{event.deadline}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <Link 
                    href={`/events/${event.url}`}
                    className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg group-hover:bg-blue-600"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Enhanced Table Pagination */}
      <div className="px-6 py-5 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((eventsPage - 1) * eventsPerPage) + 1}-{Math.min(eventsPage * eventsPerPage, filteredEvents.length)} of {filteredEvents.length} events
          </div>
          
          <div className="flex items-center space-x-4">
          <button
            onClick={handleEventsPrevPage}
            disabled={eventsPage === 1}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              eventsPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-blue-600 hover:bg-white shadow-sm'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>
          
          <div className="flex space-x-2">
            {Array.from({ length: Math.ceil(filteredEvents.length / eventsPerPage) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setEventsPage(page)}
                className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
                  eventsPage === page
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-white shadow-sm'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleEventsNextPage}
            disabled={eventsPage >= Math.ceil(filteredEvents.length / eventsPerPage)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              eventsPage >= Math.ceil(filteredEvents.length / eventsPerPage)
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-white bg-blue-500 hover:bg-blue-600 shadow-md'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;