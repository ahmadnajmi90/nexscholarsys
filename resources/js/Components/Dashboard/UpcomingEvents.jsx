import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Eye, Globe, Clock } from 'lucide-react';
import { Link } from '@inertiajs/react';
import ReactCountryFlag from 'react-country-flag';
import country from 'country-js';
import useIsDesktop from '@/Hooks/useIsDesktop';

// Helper function to get country code from country name
const getCountryCode = (countryName) => {
  if (!countryName) return 'XX'; // Fallback for no country
  
  // Normalize the country name for better matching
  const normalizedName = countryName.trim().toLowerCase();
  
  // Comprehensive country map for common variations
  const countryMap = {
      // Original names
      'Malaysia': 'MY',
      'malaysia': 'MY',
      'MY': 'MY',
      'United States': 'US',
      'United States of America': 'US',
      'USA': 'US',
      'us': 'US',
      'usa': 'US',
      'United Kingdom': 'GB',
      'UK': 'GB',
      'uk': 'GB',
      'Great Britain': 'GB',
      'Croatia': 'HR',
      'croatia': 'HR',
      'HR': 'HR',
      'Canada': 'CA',
      'Australia': 'AU',
      'Germany': 'DE',
      'France': 'FR',
      'Italy': 'IT',
      'Spain': 'ES',
      'Netherlands': 'NL',
      'Belgium': 'BE',
      'Switzerland': 'CH',
      'Austria': 'AT',
      'Sweden': 'SE',
      'Norway': 'NO',
      'Denmark': 'DK',
      'Finland': 'FI',
      'Poland': 'PL',
      'Czech Republic': 'CZ',
      'Slovakia': 'SK',
      'Hungary': 'HU',
      'Romania': 'RO',
      'Bulgaria': 'BG',
      'Greece': 'GR',
      'Portugal': 'PT',
      'Ireland': 'IE',
      'New Zealand': 'NZ',
      'Japan': 'JP',
      'South Korea': 'KR',
      'China': 'CN',
      'India': 'IN',
      'Brazil': 'BR',
      'Argentina': 'AR',
      'Mexico': 'MX',
      'Chile': 'CL',
      'Colombia': 'CO',
      'Peru': 'PE',
      'Venezuela': 'VE',
      'South Africa': 'ZA',
      'Egypt': 'EG',
      'Nigeria': 'NG',
      'Kenya': 'KE',
      'Morocco': 'MA',
      'Tunisia': 'TN',
      'Algeria': 'DZ',
      'Turkey': 'TR',
      'Israel': 'IL',
      'Saudi Arabia': 'SA',
      'UAE': 'AE',
      'United Arab Emirates': 'AE',
      'Qatar': 'QA',
      'Kuwait': 'KW',
      'Bahrain': 'BH',
      'Oman': 'OM',
      'Jordan': 'JO',
      'Lebanon': 'LB',
      'Syria': 'SY',
      'Iraq': 'IQ',
      'Iran': 'IR',
      'Pakistan': 'PK',
      'Bangladesh': 'BD',
      'Sri Lanka': 'LK',
      'Thailand': 'TH',
      'Vietnam': 'VN',
      'Philippines': 'PH',
      'Indonesia': 'ID',
      'Singapore': 'SG',
      'Hong Kong': 'HK',
      'Taiwan': 'TW',
      'Russia': 'RU',
      'Ukraine': 'UA',
      'Belarus': 'BY',
      'Latvia': 'LV',
      'Lithuania': 'LT',
      'Estonia': 'EE',
      'Slovenia': 'SI',
      'Serbia': 'RS',
      'Bosnia and Herzegovina': 'BA',
      'Montenegro': 'ME',
      'North Macedonia': 'MK',
      'Albania': 'AL',
      'Kosovo': 'XK',
      'Moldova': 'MD',
      'Georgia': 'GE',
      'Armenia': 'AM',
      'Azerbaijan': 'AZ',
      'Kazakhstan': 'KZ',
      'Uzbekistan': 'UZ',
      'Kyrgyzstan': 'KG',
      'Tajikistan': 'TJ',
      'Turkmenistan': 'TM',
      'Mongolia': 'MN',
      'Nepal': 'NP',
      'Bhutan': 'BT',
      'Myanmar': 'MM',
      'Cambodia': 'KH',
      'Laos': 'LA',
      'Brunei': 'BN',
      'East Timor': 'TL',
      'Papua New Guinea': 'PG',
      'Fiji': 'FJ',
      'Vanuatu': 'VU',
      'Solomon Islands': 'SB',
      'New Caledonia': 'NC',
      'French Polynesia': 'PF',
      'Samoa': 'WS',
      'Tonga': 'TO',
      'Kiribati': 'KI',
      'Tuvalu': 'TV',
      'Nauru': 'NR',
      'Palau': 'PW',
      'Marshall Islands': 'MH',
      'Micronesia': 'FM',
      'Guam': 'GU',
      'Northern Mariana Islands': 'MP',
      'American Samoa': 'AS',
      'Cook Islands': 'CK',
      'Niue': 'NU',
      'Tokelau': 'TK',
      'Wallis and Futuna': 'WF',
      'French Guiana': 'GF',
      'Suriname': 'SR',
      'Guyana': 'GY',
      'Paraguay': 'PY',
      'Uruguay': 'UY',
      'Bolivia': 'BO',
      'Ecuador': 'EC',
      'Panama': 'PA',
      'Costa Rica': 'CR',
      'Nicaragua': 'NI',
      'Honduras': 'HN',
      'El Salvador': 'SV',
      'Guatemala': 'GT',
      'Belize': 'BZ',
      'Cuba': 'CU',
      'Jamaica': 'JM',
      'Haiti': 'HT',
      'Dominican Republic': 'DO',
      'Puerto Rico': 'PR',
      'Bahamas': 'BS',
      'Barbados': 'BB',
      'Trinidad and Tobago': 'TT',
      'Grenada': 'GD',
      'Saint Vincent and the Grenadines': 'VC',
      'Saint Lucia': 'LC',
      'Saint Kitts and Nevis': 'KN',
      'Antigua and Barbuda': 'AG',
      'Dominica': 'DM',
      'Cape Verde': 'CV',
      'Mauritania': 'MR',
      'Mali': 'ML',
      'Burkina Faso': 'BF',
      'Niger': 'NE',
      'Chad': 'TD',
      'Sudan': 'SD',
      'South Sudan': 'SS',
      'Ethiopia': 'ET',
      'Eritrea': 'ER',
      'Djibouti': 'DJ',
      'Somalia': 'SO',
      'Uganda': 'UG',
      'Tanzania': 'TZ',
      'Rwanda': 'RW',
      'Burundi': 'BI',
      'Central African Republic': 'CF',
      'Cameroon': 'CM',
      'Gabon': 'GA',
      'Congo': 'CG',
      'Democratic Republic of the Congo': 'CD',
      'Angola': 'AO',
      'Zambia': 'ZM',
      'Zimbabwe': 'ZW',
      'Botswana': 'BW',
      'Namibia': 'NA',
      'Lesotho': 'LS',
      'Eswatini': 'SZ',
      'Madagascar': 'MG',
      'Mauritius': 'MU',
      'Seychelles': 'SC',
      'Comoros': 'KM',
      'Mayotte': 'YT',
      'Reunion': 'RE',
      'Iceland': 'IS',
      'Greenland': 'GL',
      'Faroe Islands': 'FO',
      'Svalbard and Jan Mayen': 'SJ',
      'Cyprus': 'CY',
      'Malta': 'MT',
      'Luxembourg': 'LU',
      'Liechtenstein': 'LI',
      'Monaco': 'MC',
      'Andorra': 'AD',
      'San Marino': 'SM',
      'Vatican City': 'VA',
      'Holy See': 'VA',
      'Maldives': 'MV'
    };
    
    return countryMap[countryName] || 'XX'; // Fallback for unknown countries
  // Try to find the country in our map
  if (countryMap[countryName]) {
    return countryMap[countryName];
  }
  
  // Try with normalized name
  if (countryMap[normalizedName]) {
    return countryMap[normalizedName];
  }
  
  // If we reach here, log the country name for debugging
  console.log(`Country not found in map: ${countryName} (normalized: ${normalizedName})`);
  return 'XX'; // Fallback for unknown countries
};

// Mobile Event Card Component (defined inside UpcomingEvents.jsx)
const EventCard = ({ event, eventTypeColors }) => (
  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
    <div className="flex items-start space-x-4">
      {/* Flag/Icon */}
      <div className="w-12 h-12 min-w-12 rounded-lg flex items-center justify-center shadow-md bg-gradient-to-br from-blue-500 to-blue-600">
        {event.flag && event.flag !== 'XX' ? (
          <ReactCountryFlag 
            countryCode={event.flag}
            svg
            style={{
              width: '1.5em',
              height: '1.5em',
            }}
            title={event.location}
          />
        ) : (
          <Globe className="w-5 h-5 text-white" />
        )}
      </div>
      
      {/* Event Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">
          {event.shortName}
        </h4>
        
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className="text-gray-700">{event.date}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Globe className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600">{event.location}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${eventTypeColors[event.type] || eventTypeColors['Default']}`}>
              {event.type}
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              event.status === 'Upcoming' ? 'bg-purple-100 text-purple-800' : 
              event.status === 'Registration Open' ? 'bg-green-100 text-green-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {event.status}
            </span>
          </div>
        </div>
        
        <div className="mt-3">
          <Link 
            href={event.url}
            className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Eye className="w-3 h-3 mr-1" />
            View Details
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const UpcomingEvents = ({ 
  events = [], // Accept the new prop
  eventsPage, 
  eventsPerPage, 
  handleEventsPrevPage, 
  handleEventsNextPage, 
  setEventsPage 
}) => {
  const isDesktop = useIsDesktop();
  // Add state for active filter
  const [activeFilter, setActiveFilter] = useState('All Events');
  
  // Helper object for event type colors
  const eventTypeColors = {
    'Conference': 'bg-purple-100 text-purple-800',
    'Workshop': 'bg-blue-100 text-blue-800',
    'Seminar': 'bg-green-100 text-green-800',
    'Webinar': 'bg-indigo-100 text-indigo-800',
    'Symposium': 'bg-yellow-100 text-yellow-800',
    'Colloquium': 'bg-pink-100 text-pink-800',
    'Summit': 'bg-orange-100 text-orange-800',
    'Forum': 'bg-teal-100 text-teal-800',
    'Exhibition': 'bg-red-100 text-red-800',
    'Training': 'bg-cyan-100 text-cyan-800',
    'Meeting': 'bg-gray-100 text-gray-800',
    'Default': 'bg-gray-100 text-gray-800'
  };
  // Map the incoming 'events' prop to the structure the component needs
  const upcomingEvents = events.map(event => ({
      name: event.event_name || event.title || 'Untitled Event',
      shortName: event.event_name || event.title || 'Untitled Event', // Or a shortened version if available
      date: event.start_date && event.end_date ? 
        `${new Date(event.start_date).toLocaleDateString('en-GB')} - ${new Date(event.end_date).toLocaleDateString('en-GB')}` : 
        event.event_date ? new Date(event.event_date).toLocaleDateString('en-GB') : 'TBA',
      location: `${event.city || ''}, ${event.country || ''}`.trim() || 'Online',
      type: event.event_type || 'Conference',
      status: (() => {
        if (event.registration_deadline) {
          const now = new Date();
          const deadline = new Date(event.registration_deadline);
          return now <= deadline ? 'Registration Open' : 'Closed';
        }
        return 'Upcoming';
      })(),
      deadline: event.registration_deadline ? new Date(event.registration_deadline).toLocaleDateString('en-GB') : 'TBA',
      flag: event.country_code || getCountryCode(event.country || 'Malaysia'),
      url: event.url || `/events/${event.id}`,
      category: event.event_theme || event.category || 'Academic'
  }));
  
  // Dynamically generate filter tabs based on unique event types
  const eventTypes = ['All Events', ...[...new Set(upcomingEvents.map(event => event.type))]];
  
  // Filter events based on the active filter
  const filteredEvents = activeFilter === 'All Events'
    ? upcomingEvents
    : upcomingEvents.filter(event => event.type === activeFilter);

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
    <div className="mb-8 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Enhanced Table Header */}
      <div className="px-4 md:px-6 py-4 md:py-5 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-4">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Upcoming Academic Events</h3>
            <p className="text-sm text-gray-600">Conferences, workshops, and academic gatherings</p>
          </div>
          <span className="text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border self-start md:self-auto">
            {filteredEvents.length} Events
          </span>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex space-x-2 md:space-x-4 overflow-x-auto">
          {eventTypes.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      {/* Conditional Rendering: Desktop Table vs Mobile Cards */}
      {isDesktop ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '30%' }}>Event</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '20%' }}>Date & Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '15%' }}>Type & Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '15%' }}>Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '10%' }}>Deadline</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '10%' }}>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEvents.slice((eventsPage - 1) * eventsPerPage, eventsPage * eventsPerPage).map((event, index) => (
                <tr key={index} className="hover:bg-blue-50 transition-all duration-200 group">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 min-w-14 max-w-14 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
                        {event.flag && event.flag !== 'XX' ? (
                          <ReactCountryFlag 
                            countryCode={event.flag}
                            svg
                            style={{
                              width: '1.5em',
                              height: '1.5em',
                            }}
                            title={event.location}
                          />
                        ) : (
                          <Globe className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="min-w-[140px] max-w-[180px]">
                        <div className="font-bold text-gray-900 text-normal mb-1 group-hover:text-blue-600 transition-colors duration-200 leading-tight line-clamp-2">
                          {event.shortName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-sm text-gray-900">{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{event.location}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${eventTypeColors[event.type] || eventTypeColors['Default']}`}>
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
                      event.status === 'Upcoming' ? 'bg-purple-100 text-purple-800' :
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
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <Link 
                        href={`/events/${event.url}`}
                        className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg group-hover:bg-indigo-700"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 space-y-4 bg-gray-50">
          {filteredEvents.slice((eventsPage - 1) * eventsPerPage, eventsPage * eventsPerPage).map((event, index) => (
            <EventCard key={index} event={event} eventTypeColors={eventTypeColors} />
          ))}
        </div>
      )}
      
      {/* Enhanced Table Pagination */}
      <div className="px-4 md:px-6 py-4 md:py-5 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-sm text-gray-600 text-center md:text-left">
            Showing {((eventsPage - 1) * eventsPerPage) + 1}-{Math.min(eventsPage * eventsPerPage, filteredEvents.length)} of {filteredEvents.length} events
          </div>
          
          <div className="flex items-center justify-center md:justify-end space-x-2 md:space-x-4">
          <button
            onClick={handleEventsPrevPage}
            disabled={eventsPage === 1}
            className={`flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              eventsPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-indigo-600 hover:bg-white shadow-sm'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden md:inline">Prev</span>
          </button>
          
          <div className="flex space-x-1 md:space-x-2">
            {Array.from({ length: Math.ceil(filteredEvents.length / eventsPerPage) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setEventsPage(page)}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-xl font-medium transition-all duration-200 text-sm ${
                  eventsPage === page
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-white shadow-sm'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleEventsNextPage}
            disabled={eventsPage >= Math.ceil(filteredEvents.length / eventsPerPage)}
            className={`flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              eventsPage >= Math.ceil(filteredEvents.length / eventsPerPage)
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-white bg-indigo-600 hover:bg-indigo-700 shadow-md'
            }`}
          >
            <span className="hidden md:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;