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

export default function MapView({ 
    mode, 
    focusedResearcher, 
    showNetwork, 
    onUniversityClick, 
    onResearcherClick, 
    onProjectClick, 
    onIndustryClick, 
    onShowNetwork, 
    layers, 
    networkTypes,
    universities = [],
    researchers = [],
    projects = [],
    industries = [],
    paperNetworkData = {},
    projectNetworkData = {},
    researcherLocations = {}
}) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const networkLayersRef = useRef([]);
    const markersRef = useRef({
        universities: [],
        researchers: [],
        projects: [],
        industry: []
    });

    // Initialize map (only once)
    useEffect(() => {
        if (mapInstanceRef.current || !mapRef.current) return;

        const map = L.map(mapRef.current, {
            zoomControl: true,
            scrollWheelZoom: true,
        }).setView([4.2105, 101.9758], 6); // Center on Malaysia

        // Use CartoDB light tiles for cleaner look
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 19,
        }).addTo(map);

        // Event listeners for custom events
        const handleUniversityClick = (e) => onUniversityClick?.(e.detail);
        const handleResearcherClick = (e) => onResearcherClick?.(e.detail);
        const handleProjectClick = (e) => onProjectClick?.(e.detail);
        const handleIndustryClick = (e) => onIndustryClick?.(e.detail);

        window.addEventListener('universityClick', handleUniversityClick);
        window.addEventListener('researcherClick', handleResearcherClick);
        window.addEventListener('projectClick', handleProjectClick);
        window.addEventListener('industryClick', handleIndustryClick);

        mapInstanceRef.current = map;

        return () => {
            window.removeEventListener('universityClick', handleUniversityClick);
            window.removeEventListener('researcherClick', handleResearcherClick);
            window.removeEventListener('projectClick', handleProjectClick);
            window.removeEventListener('industryClick', handleIndustryClick);
            map.remove();
                mapInstanceRef.current = null;
        };
    }, [onUniversityClick, onResearcherClick, onProjectClick, onIndustryClick]);

    // Update markers when data changes
    useEffect(() => {
        if (!mapInstanceRef.current) return;
        const map = mapInstanceRef.current;

        // Clear all existing markers
        markersRef.current.universities.forEach(marker => marker.remove());
        markersRef.current.projects.forEach(marker => marker.remove());
        markersRef.current.industry.forEach(marker => marker.remove());
        markersRef.current = { universities: [], projects: [], industry: [] };

        // Create custom icons
        const universityIcon = L.divIcon({
            html: '<div style="background: #3b82f6; width: 24px; height: 24px; border-radius: 4px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"><svg width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg></div>',
            className: '',
            iconSize: [24, 24],
        });

        const projectIcon = L.divIcon({
            html: '<div style="background: #f59e0b; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"><svg width="12" height="12" fill="white" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div>',
            className: '',
            iconSize: [20, 20],
        });

        const industryIcon = L.divIcon({
            html: '<div style="background: #9333ea; width: 24px; height: 24px; border-radius: 4px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"><svg width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg></div>',
            className: '',
            iconSize: [24, 24],
        });

        // Add university markers (only if in overview mode and layer is active)
        if (mode === 'overview' && layers.universities) {
            universities.forEach((uni) => {
                const marker = L.marker(uni.coordinates, { icon: universityIcon });
                
                marker.bindPopup(
                    `<div style="font-size: 0.875rem; min-width: 220px;">
                        <strong style="color: #3b82f6; font-size: 1rem;">${uni.shortName}</strong><br />
                        <span style="color: #666;">${uni.name}</span><br />
                        <span style="color: #666; font-size: 0.85rem;">${uni.state}, Malaysia</span><br />
                        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <span>Researchers:</span>
                                <strong>${uni.researchersCount}</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span>Active Projects:</span>
                                <strong style="color: #3b82f6;">${uni.activeProjects}</strong>
                            </div>
                        </div>
                        <button onclick="window.dispatchEvent(new CustomEvent('universityClick', { detail: '${uni.name}' }))" style="margin-top: 8px; width: 100%; padding: 6px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">View Details</button>
                    </div>`
                );
                
                marker.addTo(map);
                markersRef.current.universities.push(marker);
            });
        }

        // Add project markers (only if in overview mode and layer is active)
        if (mode === 'overview' && layers.projects) {
            projects.forEach((project) => {
                const statusColor = project.status === 'Active' ? '#22c55e' : project.status === 'Completed' ? '#3b82f6' : '#eab308';
                
                const marker = L.marker(project.coordinates, { icon: projectIcon });
                
                marker.bindPopup(
                    `<div style="font-size: 0.875rem; min-width: 220px;">
                        <strong style="color: #f59e0b; font-size: 0.95rem;">${project.name}</strong><br />
                        <span style="color: #666;">${project.location}</span><br />
                        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
                            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                <span style="background: #f3f4f6; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;">${project.type}</span>
                                <span style="background: ${statusColor}20; color: ${statusColor}; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;">${project.status}</span>
                    </div>
                        </div>
                        <button onclick="window.dispatchEvent(new CustomEvent('projectClick', { detail: '${project.name}' }))" style="margin-top: 8px; width: 100%; padding: 6px; background: #f59e0b; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">View Project</button>
                    </div>`
                );
                
                marker.addTo(map);
                markersRef.current.projects.push(marker);
            });
        }

        // Add industry markers (only if in overview mode and layer is active)
        if (mode === 'overview' && layers.industry) {
            industries.forEach((company) => {
                const marker = L.marker(company.coordinates, { icon: industryIcon });
                
                const tagsHtml = company.tags ? company.tags.map(tag => 
                    `<span style="background: #f3e8ff; color: #7c3aed; padding: 2px 8px; border-radius: 12px; font-size: 0.7rem;">${tag}</span>`
                ).join('') : '';

                marker.bindPopup(
                    `<div style="font-size: 0.875rem; min-width: 240px;">
                        <strong style="color: #9333ea; font-size: 0.95rem;">${company.name}</strong><br />
                        <span style="color: #666;">${company.location}</span><br />
                        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
                            <div style="margin-bottom: 6px;">
                                <span style="font-size: 0.75rem; color: #888;">Sector:</span>
                                <strong style="font-size: 0.8rem; color: #9333ea; display: block;">${company.sector}</strong>
                        </div>
                            <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-top: 8px;">
                                ${tagsHtml}
                        </div>
                        </div>
                        <button onclick="window.dispatchEvent(new CustomEvent('industryClick', { detail: '${company.name}' }))" style="margin-top: 8px; width: 100%; padding: 6px; background: #9333ea; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">View Company</button>
                    </div>`
                );
                
                marker.addTo(map);
                markersRef.current.industry.push(marker);
            });
        }

        // Auto-fit bounds if there are markers
        const allMarkers = [
            ...markersRef.current.universities,
            ...markersRef.current.projects,
            ...markersRef.current.industry
        ];
        
        if (allMarkers.length > 0) {
            const group = L.featureGroup(allMarkers);
            map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 10 });
        }
    }, [universities, projects, industries, mode, layers]);

    // Handle focused researcher in network mode
    useEffect(() => {
        if (mode !== 'network' || !mapInstanceRef.current) return;

        const map = mapInstanceRef.current;

        // Clear existing network layers
        networkLayersRef.current.forEach(layer => layer.remove());
        networkLayersRef.current = [];

        if (!focusedResearcher) return;

        const researcher = researcherLocations[focusedResearcher];
        if (!researcher) return;

        // Create focus marker for the selected researcher
        const focusMarker = L.circleMarker([researcher.lat, researcher.lng], {
            radius: 12,
            fillColor: '#3b82f6',
            color: '#fff',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.9
        });

        const popupContent = `
            <div style="min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${researcher.name}</h3>
                <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${researcher.department}</p>
                <p style="margin: 0 0 12px 0; font-size: 12px; color: #666;">${researcher.university}</p>
                <button 
                    onclick="window.dispatchEvent(new CustomEvent('show-network'))" 
                    style="width: 100%; padding: 8px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500;"
                >
                    Show collaboration network
                    </button>
                </div>
            `;
            
        focusMarker.bindPopup(popupContent, { maxWidth: 250 });
        focusMarker.addTo(map);
        focusMarker.openPopup();

        networkLayersRef.current.push(focusMarker);

        // Center on researcher with animation
        map.flyTo([researcher.lat, researcher.lng], 8, { duration: 1 });

    }, [mode, focusedResearcher, researcherLocations]);

    // Handle network visualization (lines connecting collaborators)
    useEffect(() => {
        if (mode !== 'network' || !showNetwork || !focusedResearcher || !mapInstanceRef.current) return;

        const map = mapInstanceRef.current;
        const researcher = researcherLocations[focusedResearcher];
        
        if (!researcher) return;

        // Clear existing network layers except the focused researcher marker
        const focusedMarker = networkLayersRef.current[0];
        networkLayersRef.current.slice(1).forEach(layer => layer.remove());
        networkLayersRef.current = focusedMarker ? [focusedMarker] : [];
        
        // Get paper collaborators if enabled
        const paperCollaborators = networkTypes.papers ? (paperNetworkData[focusedResearcher] || []) : [];
        // Get project collaborators if enabled
        const projectCollaborators = networkTypes.projects ? (projectNetworkData[focusedResearcher] || []) : [];

        // Draw paper collaboration edges and nodes (BLUE lines)
        paperCollaborators.forEach(collab => {
            const target = researcherLocations[collab.id];
            if (!target) return;

            // Draw edge (blue dashed line for papers)
            const line = L.polyline(
                [[researcher.lat, researcher.lng], [target.lat, target.lng]],
                {
                    color: '#3b82f6',
                    weight: Math.min(collab.strength / 2, 6),
                    opacity: 0.7,
                    dashArray: '5, 10',
                }
            );
            
            line.on('mouseover', function() {
                this.setStyle({
                    weight: Math.min(collab.strength / 2, 6) + 2,
                    opacity: 1,
                });
            });
            
            line.on('mouseout', function() {
                this.setStyle({
                    weight: Math.min(collab.strength / 2, 6),
                    opacity: 0.7,
                });
            });
            
            line.bindTooltip(`📄 Paper collaboration: ${collab.strength} co-authored papers`, { 
                permanent: false,
                direction: 'center'
            });
            line.addTo(map);
            networkLayersRef.current.push(line);

            // Add collaborator node (blue circle)
            const collabMarker = L.circleMarker([target.lat, target.lng], {
                radius: 8,
                fillColor: '#3b82f6',
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            });

            collabMarker.bindPopup(`
                <div style="min-width: 150px;">
                    <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600;">${target.name}</h4>
                    <p style="margin: 0 0 2px 0; font-size: 11px; color: #666;">${target.university}</p>
                    <p style="margin: 0 0 8px 0; font-size: 11px; color: #3b82f6;">📄 ${collab.strength} co-authored papers</p>
                </div>
            `);
            
            collabMarker.addTo(map);
            networkLayersRef.current.push(collabMarker);
        });

        // Draw project collaboration edges and nodes (GREEN lines)
        projectCollaborators.forEach(collab => {
            const target = researcherLocations[collab.id];
            if (!target) return;

            // Draw edge (green dashed line for projects)
            const line = L.polyline(
                [[researcher.lat, researcher.lng], [target.lat, target.lng]],
                {
                    color: '#10b981',
                    weight: Math.min(collab.strength / 1.5, 6),
                    opacity: 0.7,
                    dashArray: '10, 5',
                }
            );
            
            line.on('mouseover', function() {
                this.setStyle({
                    weight: Math.min(collab.strength / 1.5, 6) + 2,
                    opacity: 1,
                });
            });
            
            line.on('mouseout', function() {
                this.setStyle({
                    weight: Math.min(collab.strength / 1.5, 6),
                    opacity: 0.7,
                });
            });
            
            line.bindTooltip(`🚀 Project collaboration: ${collab.strength} joint projects`, { 
                permanent: false,
                direction: 'center'
            });
            line.addTo(map);
            networkLayersRef.current.push(line);

            // Add collaborator node (green circle)
            const collabMarker = L.circleMarker([target.lat, target.lng], {
                radius: 8,
                fillColor: '#10b981',
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            });

            // Create project list HTML if projects exist
            const projectListHTML = collab.projects ? collab.projects.map(proj => 
                `<div style="padding: 4px 0; border-bottom: 1px solid #eee;">
                    <div style="font-weight: 500; font-size: 11px;">${proj.title}</div>
                    <div style="font-size: 10px; color: #999;">Year: ${proj.year}</div>
                </div>`
            ).join('') : '';

            collabMarker.bindPopup(`
                <div style="min-width: 200px; max-width: 280px;">
                    <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600;">${target.name}</h4>
                    <p style="margin: 0 0 2px 0; font-size: 11px; color: #666;">${target.university}</p>
                    <div style="margin: 8px 0; padding: 8px; background: #f0fdf4; border-radius: 4px;">
                        <p style="margin: 0 0 8px 0; font-size: 12px; color: #10b981; font-weight: 600;">🚀 ${collab.strength} Joint Projects:</p>
                        <div style="max-height: 200px; overflow-y: auto;">
                            ${projectListHTML}
                        </div>
                    </div>
                </div>
            `, { maxWidth: 300 });
            
            collabMarker.addTo(map);
            networkLayersRef.current.push(collabMarker);
        });

    }, [mode, showNetwork, focusedResearcher, networkTypes, paperNetworkData, projectNetworkData, researcherLocations]);

    // Handle show network event from popup
    useEffect(() => {
        const handleShowNetwork = () => {
            onShowNetwork?.();
        };

        window.addEventListener('show-network', handleShowNetwork);
        return () => window.removeEventListener('show-network', handleShowNetwork);
    }, [onShowNetwork]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative w-full h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
            {/* Map Container */}
            <div 
                ref={mapRef} 
                className="w-full h-[600px] bg-gray-100 dark:bg-gray-900"
            />

            {/* Legend - only show in overview mode */}
            {mode === 'overview' && (
                <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-4 py-3 rounded-lg text-xs border border-gray-200 dark:border-gray-700 shadow-lg">
                    <div className="font-semibold mb-2 text-gray-900 dark:text-white">Map Legend</div>
                    <div className="space-y-2">
                    <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-blue-500"></div>
                            <span className="text-gray-700 dark:text-gray-300">Universities</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <span className="text-gray-700 dark:text-gray-300">Community Projects</span>
                    </div>
                    <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-purple-600"></div>
                            <span className="text-gray-700 dark:text-gray-300">Industry Partners</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Network Legend */}
            {mode === 'network' && showNetwork && (
                <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-4 py-3 rounded-lg text-xs border border-gray-200 dark:border-gray-700 shadow-lg">
                    <div className="font-semibold mb-2 text-gray-900 dark:text-white">Network Legend</div>
                    <div className="space-y-2">
                    <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-gray-700 dark:text-gray-300">Focused Researcher</span>
                        </div>
                        {networkTypes.papers && (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-0.5 bg-blue-500"></div>
                                <span className="text-gray-700 dark:text-gray-300">Paper Collab</span>
                            </div>
                        )}
                        {networkTypes.projects && (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-0.5 bg-green-500"></div>
                                <span className="text-gray-700 dark:text-gray-300">Project Collab</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
