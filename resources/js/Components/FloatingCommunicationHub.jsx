import React, { useState, useEffect, useRef, useCallback } from 'react';
import Draggable from 'react-draggable';
import NotificationBell from './Notifications/NotificationBell';
import MessagingBell from './Messaging/MessagingBell';
import Dropdown from './Dropdown';
import { Settings, User2, LogOut, GripVertical } from 'lucide-react';

const FloatingCommunicationHub = ({ auth, getProfilePicture, showProfile = false }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [edgePosition, setEdgePosition] = useState('top-right'); // top-right, top-left, bottom-right, bottom-left
    const [isPanelOpen, setIsPanelOpen] = useState(false); // Track if any panel is open
    const [isDragging, setIsDragging] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
    const nodeRef = useRef(null);
    const collapseTimeoutRef = useRef(null);
    const collapsedWidth = 60;
    const expandedWidth = showProfile ? 220 : 160; // Width when expanded (with/without profile)

    // Calculate expansion state early (before useEffect hooks that use it)
    const shouldBeExpanded = isExpanded || isPanelOpen;
    
    // Check if there are any unread items
    const hasUnread = unreadMessageCount > 0 || unreadNotificationCount > 0;
    const totalUnread = unreadMessageCount + unreadNotificationCount;

    // Detect touch device on mount
    useEffect(() => {
        const checkTouch = () => {
            const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            setIsTouchDevice(hasTouch);
            // On touch devices, keep expanded by default
            if (hasTouch) {
                setIsExpanded(true);
            }
        };
        checkTouch();
    }, []);

    // Calculate position coordinates from edge
    const calculatePositionFromEdge = useCallback((edge, expanded = false) => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const offset = 16; // 1rem padding from edge
        const currentWidth = expanded ? expandedWidth : collapsedWidth;

        let newX = 0, newY = 0;

        switch (edge) {
            case 'top-right':
                newX = windowWidth - offset - currentWidth;
                newY = offset;
                break;
            case 'top-left':
                newX = offset;
                newY = offset;
                break;
            case 'bottom-right':
                newX = windowWidth - offset - currentWidth;
                newY = windowHeight - offset - 60; // 60px = approx height
                break;
            case 'bottom-left':
                newX = offset;
                newY = windowHeight - offset - 60;
                break;
        }

        setPosition({ x: newX, y: newY });
    }, [collapsedWidth, expandedWidth]);

    // Load saved position from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('commsHubEdge');
        const initialEdge = saved || 'top-right';
        setEdgePosition(initialEdge);
        calculatePositionFromEdge(initialEdge);
    }, [calculatePositionFromEdge]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            calculatePositionFromEdge(edgePosition, shouldBeExpanded);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [edgePosition, shouldBeExpanded, calculatePositionFromEdge]);

    // Adjust position when expansion state changes to prevent overflow
    useEffect(() => {
        if (!isDragging) {
            calculatePositionFromEdge(edgePosition, shouldBeExpanded);
        }
    }, [shouldBeExpanded, edgePosition, isDragging, calculatePositionFromEdge]);

    // Snap to nearest edge when drag stops
    const handleDragStop = (e, data) => {
        // Mark as dragged (to hide hint)
        localStorage.setItem('commsHubDragged', 'true');
        setIsDragging(false);
        
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const centerX = data.x + (shouldBeExpanded ? expandedWidth : collapsedWidth) / 2;
        const centerY = data.y + 30; // approx half height

        // Determine closest edge
        const distToTop = centerY;
        const distToBottom = windowHeight - centerY;
        const distToLeft = centerX;
        const distToRight = windowWidth - centerX;

        const minDist = Math.min(distToTop, distToBottom, distToLeft, distToRight);

        let newEdge;
        if (minDist === distToTop) {
            newEdge = centerX < windowWidth / 2 ? 'top-left' : 'top-right';
        } else if (minDist === distToBottom) {
            newEdge = centerX < windowWidth / 2 ? 'bottom-left' : 'bottom-right';
        } else if (minDist === distToLeft) {
            newEdge = centerY < windowHeight / 2 ? 'top-left' : 'bottom-left';
        } else {
            newEdge = centerY < windowHeight / 2 ? 'top-right' : 'bottom-right';
        }

        setEdgePosition(newEdge);
        localStorage.setItem('commsHubEdge', newEdge);
        calculatePositionFromEdge(newEdge, shouldBeExpanded);
    };

    // Determine dropdown/panel alignment based on edge position
    const getDropdownAlignment = () => {
        if (edgePosition.includes('right')) return 'right';
        return 'left';
    };

    const getDropdownDirection = () => {
        if (edgePosition.includes('bottom')) return 'up';
        return 'down';
    };

    // Handle mouse enter with immediate expansion (skip on touch devices)
    const handleMouseEnter = () => {
        if (!isDragging && !isTouchDevice) {
            // Clear any pending collapse
            if (collapseTimeoutRef.current) {
                clearTimeout(collapseTimeoutRef.current);
                collapseTimeoutRef.current = null;
            }
            setIsExpanded(true);
        }
    };

    // Handle mouse leave with delayed collapse to prevent flickering (skip on touch devices)
    const handleMouseLeave = () => {
        if (!isDragging && !isPanelOpen && !isTouchDevice) {
            // Add a small delay before collapsing to prevent sensitivity issues
            collapseTimeoutRef.current = setTimeout(() => {
                setIsExpanded(false);
            }, 200); // 200ms delay
        }
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (collapseTimeoutRef.current) {
                clearTimeout(collapseTimeoutRef.current);
            }
        };
    }, []);

    return (
        <Draggable
            nodeRef={nodeRef}
            position={position}
            onStart={() => setIsDragging(true)}
            onStop={handleDragStop}
            onDrag={(e, data) => setPosition({ x: data.x, y: data.y })}
            cancel="button, a, img, .no-drag"
            bounds="parent"
            scale={1}
        >
            <div
                ref={nodeRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`fixed z-50 ${isDragging ? '' : 'transition-all duration-300'} ${
                    shouldBeExpanded ? 'opacity-100' : 'opacity-60'
                } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} p-2 -m-2`}
            >
                {/* Drag Handle - always visible on hover */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-400 rounded-full px-2 py-0.5 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <GripVertical className="h-3 w-3 text-white" />
                </div>

                {/* Main Hub Container */}
                <div className={`flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 ${
                    isDragging ? '' : 'transition-all duration-300'
                } ${shouldBeExpanded ? 'scale-100' : 'scale-90'} relative`}>
                    {/* Combined Unread Badge - only show when collapsed and has unread */}
                    {!shouldBeExpanded && hasUnread && (
                        <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse z-10">
                            {totalUnread > 9 ? '9+' : totalUnread}
                        </div>
                    )}
                    
                    {/* Messaging Bell */}
                    <div className="relative h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors no-drag">
                        <MessagingBell 
                            dropdownAlign={getDropdownAlignment()} 
                            dropdownDirection={getDropdownDirection()}
                            onPanelToggle={setIsPanelOpen}
                            onUnreadCountChange={setUnreadMessageCount}
                        />
                    </div>
                    
                    {/* Divider - only show when expanded */}
                    {shouldBeExpanded && (
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
                    )}
                    
                    {/* Notification Bell - only show when expanded */}
                    {shouldBeExpanded && (
                        <div className="relative h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors no-drag">
                            <NotificationBell 
                                dropdownAlign={getDropdownAlignment()} 
                                dropdownDirection={getDropdownDirection()}
                                onPanelToggle={setIsPanelOpen}
                                onUnreadCountChange={setUnreadNotificationCount}
                            />
                        </div>
                    )}
                    
                    {/* Profile Dropdown - Only shown when header is hidden and expanded */}
                    {showProfile && shouldBeExpanded && (
                        <>
                            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
                            
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <img
                                        src={getProfilePicture(auth.user)}
                                        alt="Profile"
                                        className="h-9 w-9 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-indigo-400 transition no-drag"
                                    />
                                </Dropdown.Trigger>
                                <Dropdown.Content align={getDropdownAlignment()} width="48">
                                    <div className="px-4 py-3">
                                        <span className="block text-sm font-medium text-gray-900 truncate">{auth.user.full_name}</span>
                                        <span className="block text-sm text-gray-500 truncate">{auth.user.email}</span>
                                    </div>
                                    <div className="border-t border-gray-200"></div>
                                    <Dropdown.Link href={route('profile.edit')}>
                                        <Settings className="w-4 h-4 mr-2" />
                                        General Account Setting
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('role.edit')}>
                                        <User2 className="w-4 h-4 mr-2" />
                                        Personal Information
                                    </Dropdown.Link>
                                    <div className="border-t border-gray-200"></div>
                                    <Dropdown.Link href={route('logout')} method="post" as="button" className="w-full text-left text-red-600 hover:bg-red-50">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </>
                    )}
                </div>

                {/* Hint for first-time users */}
                {!localStorage.getItem('commsHubDragged') && !isTouchDevice && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-2 py-1 rounded animate-pulse whitespace-nowrap pointer-events-none">
                        💡 Drag me to any edge!
                    </div>
                )}
                {/* Touch device hint */}
                {!localStorage.getItem('commsHubDragged') && isTouchDevice && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-2 py-1 rounded animate-pulse whitespace-nowrap pointer-events-none">
                        💡 Touch & drag to move!
                    </div>
                )}
            </div>
        </Draggable>
    );
};

export default FloatingCommunicationHub;

