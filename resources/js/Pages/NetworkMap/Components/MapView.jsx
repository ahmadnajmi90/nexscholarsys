import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color, iconText) => {
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                background-color: ${color};
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 18px;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">
                ${iconText}
            </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
    });
};

const universityIcon = createCustomIcon('#3B82F6', '🎓');
const projectIcon = createCustomIcon('#A855F7', '📋');
const industryIcon = createCustomIcon('#F97316', '🏢');

export default function MapView({ universities, projects, industry, activeTab }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);

    // Initialize map
    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Create map centered on Malaysia
        const map = L.map(mapRef.current, {
            center: [4.2105, 101.9758], // Center of Malaysia
            zoom: 7,
            zoomControl: true,
            scrollWheelZoom: true
        });

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(map);

        mapInstanceRef.current = map;

        // Cleanup
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Update markers when data changes
    useEffect(() => {
        if (!mapInstanceRef.current) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        const allMarkers = [];

        // Add university markers
        universities.forEach(uni => {
            const popupContent = `
                <div class="p-4 min-w-[280px]">
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-2xl">🎓</span>
                        <div>
                            <h3 class="font-bold text-lg text-gray-900">${uni.shortName}</h3>
                            <p class="text-xs text-gray-600">${uni.name}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-700 mb-3">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span class="font-medium">${uni.state}, Malaysia</span>
                    </div>
                    <div class="grid grid-cols-2 gap-2 mb-3">
                        <div class="bg-green-50 p-2 rounded text-center">
                            <div class="text-lg font-bold text-green-700">${uni.researchersCount}</div>
                            <div class="text-xs text-green-600">Researchers</div>
                        </div>
                        <div class="bg-purple-50 p-2 rounded text-center">
                            <div class="text-lg font-bold text-purple-700">${uni.activeProjects}</div>
                            <div class="text-xs text-purple-600">Projects</div>
                        </div>
                        <div class="bg-blue-50 p-2 rounded text-center">
                            <div class="text-lg font-bold text-blue-700">${uni.publications.toLocaleString()}</div>
                            <div class="text-xs text-blue-600">Publications</div>
                        </div>
                        <div class="bg-orange-50 p-2 rounded text-center">
                            <div class="text-lg font-bold text-orange-700">${uni.industryCitations.toLocaleString()}</div>
                            <div class="text-xs text-orange-600">Citations</div>
                        </div>
                    </div>
                    <div class="bg-indigo-50 p-2 rounded mb-3">
                        <p class="text-xs text-gray-600 mb-1">Top Research Area</p>
                        <p class="text-sm font-semibold text-indigo-700">${uni.topResearchArea}</p>
                    </div>
                    <button onclick="alert('View Details functionality coming soon!')" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
                        View Details
                    </button>
                </div>
            `;
            
            const marker = L.marker(uni.coordinates, { icon: universityIcon })
                .bindPopup(popupContent, {
                    maxWidth: 320,
                    className: 'custom-popup'
                })
                .addTo(mapInstanceRef.current);
            
            allMarkers.push(marker);
        });

        // Add project markers
        projects.forEach(project => {
            const statusColors = {
                'Active': 'bg-green-100 text-green-700',
                'Planning': 'bg-yellow-100 text-yellow-700',
                'Completed': 'bg-blue-100 text-blue-700'
            };
            const statusColor = statusColors[project.status] || statusColors['Active'];
            
            const popupContent = `
                <div class="p-4 min-w-[280px]">
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-2xl">📋</span>
                        <div class="flex-1">
                            <h3 class="font-bold text-base text-gray-900">${project.name}</h3>
                            <p class="text-xs text-gray-600">${project.type} Project</p>
                        </div>
                    </div>
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2 text-sm text-gray-700">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            </svg>
                            <span>${project.location}</span>
                        </div>
                        <span class="px-2 py-1 rounded-full text-xs font-medium ${statusColor}">${project.status}</span>
                    </div>
                    <p class="text-sm text-gray-700 mb-3 line-clamp-2">${project.description}</p>
                    <div class="grid grid-cols-2 gap-2 mb-3">
                        <div class="bg-blue-50 p-2 rounded">
                            <p class="text-xs text-gray-600">Timeline</p>
                            <p class="text-xs font-semibold text-blue-700">${new Date(project.startDate).toLocaleDateString('en-MY', { month: 'short', year: 'numeric' })} - ${new Date(project.endDate).toLocaleDateString('en-MY', { month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div class="bg-green-50 p-2 rounded">
                            <p class="text-xs text-gray-600">Budget</p>
                            <p class="text-sm font-bold text-green-700">${project.budget}</p>
                        </div>
                    </div>
                    <div class="bg-gray-50 p-2 rounded mb-3">
                        <p class="text-xs text-gray-600">Lead Researcher</p>
                        <p class="text-sm font-semibold text-gray-900">${project.leadResearcher}</p>
                    </div>
                    <button onclick="alert('View Project functionality coming soon!')" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors">
                        View Project
                    </button>
                </div>
            `;
            
            const marker = L.marker(project.coordinates, { icon: projectIcon })
                .bindPopup(popupContent, {
                    maxWidth: 320,
                    className: 'custom-popup'
                })
                .addTo(mapInstanceRef.current);
            
            allMarkers.push(marker);
        });

        // Add industry markers
        industry.forEach(partner => {
            const popupContent = `
                <div class="p-4 min-w-[280px]">
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-2xl">🏢</span>
                        <div>
                            <h3 class="font-bold text-base text-gray-900">${partner.name}</h3>
                            <p class="text-xs text-gray-600">${partner.type}</p>
                        </div>
                    </div>
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2 text-sm text-gray-700">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            </svg>
                            <span>${partner.location}</span>
                        </div>
                        <span class="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">${partner.sector}</span>
                    </div>
                    <p class="text-sm text-gray-700 mb-3 line-clamp-2">${partner.description}</p>
                    <div class="grid grid-cols-3 gap-2 mb-3">
                        <div class="bg-blue-50 p-2 rounded text-center">
                            <div class="text-base font-bold text-blue-700">${partner.universityPartners.length}</div>
                            <div class="text-xs text-blue-600">Universities</div>
                        </div>
                        <div class="bg-green-50 p-2 rounded text-center">
                            <div class="text-base font-bold text-green-700">${partner.activeCollaborations}</div>
                            <div class="text-xs text-green-600">Projects</div>
                        </div>
                        <div class="bg-purple-50 p-2 rounded text-center">
                            <div class="text-xs font-bold text-purple-700">${partner.fundingProvided}</div>
                            <div class="text-xs text-purple-600">Funding</div>
                        </div>
                    </div>
                    <div class="bg-indigo-50 p-2 rounded mb-3">
                        <p class="text-xs text-gray-600">Specialization</p>
                        <p class="text-sm font-semibold text-indigo-700">${partner.specialization}</p>
                    </div>
                    <button onclick="alert('View Company functionality coming soon!')" class="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded transition-colors">
                        View Company
                    </button>
                </div>
            `;
            
            const marker = L.marker(partner.coordinates, { icon: industryIcon })
                .bindPopup(popupContent, {
                    maxWidth: 320,
                    className: 'custom-popup'
                })
                .addTo(mapInstanceRef.current);
            
            allMarkers.push(marker);
        });

        markersRef.current = allMarkers;

        // Fit bounds to show all markers
        if (allMarkers.length > 0) {
            const group = L.featureGroup(allMarkers);
            mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [50, 50] });
        }
    }, [universities, projects, industry]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
            {/* Map Legend */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                            🎓
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            Universities ({universities.length})
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">
                            📋
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            Community Projects ({projects.length})
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs">
                            🏢
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            Industry Partners ({industry.length})
                        </span>
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div 
                ref={mapRef} 
                className="w-full h-[600px] bg-gray-100 dark:bg-gray-900"
            />
        </motion.div>
    );
}
