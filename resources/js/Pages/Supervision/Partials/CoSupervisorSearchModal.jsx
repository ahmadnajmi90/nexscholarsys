import React, { useState, useEffect } from 'react';
import { X, Search, UserPlus, Users, Network, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/Components/ui/tabs';
import { Card, CardContent } from '@/Components/ui/card';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Badge } from '@/Components/ui/badge';
import { toast } from 'sonner';
import { usePage } from '@inertiajs/react';

const CoSupervisorSearchModal = ({ isOpen, onClose, relationship, onInvite }) => {
    const { auth } = usePage().props;
    const isStudent = auth.user?.postgraduate !== null;
    const [activeTab, setActiveTab] = useState(isStudent ? 'potential' : 'connections');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    // Data states
    const [potentialSupervisors, setPotentialSupervisors] = useState([]);
    const [connections, setConnections] = useState([]);
    const [allAcademicians, setAllAcademicians] = useState([]);
    const [excludedAcademicianIds, setExcludedAcademicianIds] = useState([]);

    // Invitation state
    const [selectedAcademician, setSelectedAcademician] = useState(null);
    const [invitationMessage, setInvitationMessage] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadExcludedAcademicians();
            if (isStudent) {
                loadPotentialSupervisors();
            }
            loadConnections();
        }
    }, [isOpen, isStudent]);

    const loadExcludedAcademicians = async () => {
        try {
            console.log('Loading excluded academicians for relationship:', relationship.id, 'student:', relationship.student_id);
            
            // Get co-supervisors directly from the relationship endpoint
            const relationshipDetailsRes = await axios.get(`/api/v1/app/supervision/relationships/${relationship.id}`);
            const relationshipData = relationshipDetailsRes.data.data || {};
            
            console.log('Relationship details:', relationshipData);

            // Get my invitations
            const invitationsRes = await axios.get('/api/v1/app/supervision/cosupervisor-invitations/my-invitations');
            const allInvitations = invitationsRes.data.as_initiator || [];
            
            console.log('My initiated invitations:', allInvitations);

            // Collect academician IDs to exclude
            const excludedIds = new Set();

            // Exclude main supervisor
            if (relationship.academician_id) {
                excludedIds.add(relationship.academician_id);
                console.log('Excluding main supervisor:', relationship.academician_id);
            }

            // Exclude active co-supervisors (from relationship details)
            const coSupervisors = relationshipData.cosupervisors || [];
            console.log('Co-supervisors from relationship:', coSupervisors);
            
            coSupervisors.forEach(coSup => {
                if (coSup.academician_id) {
                    excludedIds.add(coSup.academician_id);
                    console.log('Excluding active co-supervisor:', coSup.academician_id);
                }
            });

            // Exclude co-supervisors with pending/accepted invitations for this relationship
            const pendingInvitationsForThisRel = allInvitations.filter(inv => 
                inv.relationship_id === relationship.id &&
                !inv.cancelled_at && 
                inv.cosupervisor_status !== 'rejected' && 
                inv.approver_status !== 'rejected'
            );
            
            console.log('Pending invitations for this relationship:', pendingInvitationsForThisRel);
            
            pendingInvitationsForThisRel.forEach(inv => {
                excludedIds.add(inv.cosupervisor_academician_id);
                console.log('Excluding pending invitation to:', inv.cosupervisor_academician_id);
            });

            const finalExcluded = Array.from(excludedIds);
            console.log('Final excluded academician IDs:', finalExcluded);
            setExcludedAcademicianIds(finalExcluded);
        } catch (error) {
            console.error('Error loading excluded academicians:', error);
            setExcludedAcademicianIds([]);
        }
    };

    const loadPotentialSupervisors = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/v1/app/supervision/shortlist');
            // Shortlist returns: { data: [{ id, academician_id, academician: { academician_id, full_name, ... } }] }
            setPotentialSupervisors(response.data.data || []);
        } catch (error) {
            console.error('Error loading potential supervisors:', error);
            // If error (e.g., supervisor accessing this), just set empty
            setPotentialSupervisors([]);
        } finally {
            setLoading(false);
        }
    };

    const loadConnections = async () => {
        try {
            const response = await axios.get('/api/v1/app/supervision/recommendations/supervisor-connections');
            // Connections returns: { data: [{ id, name, expertise, profile_picture, ... }] }
            setConnections(response.data.data || []);
        } catch (error) {
            console.error('Error loading connections:', error);
            setConnections([]);
        }
    };

    const searchAllAcademicians = async (query) => {
        if (!query || query.length < 2) {
            setAllAcademicians([]);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get('/api/v1/app/supervision/recommendations/search-academicians', {
                params: { q: query }
            });
            // Search returns: { data: [{ id, name, expertise, profile_picture, ... }] }
            setAllAcademicians(response.data.data || []);
        } catch (error) {
            console.error('Error searching academicians:', error);
            setAllAcademicians([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'all' && searchQuery) {
            const delayDebounceFn = setTimeout(() => {
                searchAllAcademicians(searchQuery);
            }, 500);

            return () => clearTimeout(delayDebounceFn);
        }
    }, [searchQuery, activeTab]);

    const handleInvite = async (academician) => {
        if (!invitationMessage.trim()) {
            toast.error('Please add a personal message');
            return;
        }

        // Extract academician_id from different data structures
        // Shortlist: { academician: { academician_id: "ACAD-XXX" } }
        // Connections/Search: { id: "ACAD-XXX" }
        const academicianId = academician.academician?.academician_id || academician.id;

        if (!academicianId) {
            toast.error('Invalid academician selected');
            return;
        }

        setSending(true);
        try {
            const response = await axios.post(
                `/api/v1/app/supervision/relationships/${relationship.id}/cosupervisor/invite`,
                {
                    cosupervisor_academician_id: academicianId,
                    invitation_message: invitationMessage
                }
            );

            toast.success('Co-supervisor invitation sent successfully!');
            setSelectedAcademician(null);
            setInvitationMessage('');
            onInvite(response.data.invitation);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send invitation');
        } finally {
            setSending(false);
        }
    };

    const AcademicianCard = ({ academician, source }) => {
        // Handle different data structures:
        // Shortlist: { academician: { academician_id, full_name, profile_picture, university: {name}, faculty: {name}, research_domains: [], verified: bool, ... } }
        // Connections/Search: { id, name, profile_picture, expertise, university, faculty, department, verified: bool, ... }
        const academicianId = academician.academician?.academician_id || academician.id;
        const name = academician.academician?.full_name || academician.name;
        const profilePicture = academician.academician?.profile_picture || academician.profile_picture;
        const department = academician.academician?.department || academician.department;
        
        // Research expertise/domains
        let expertise = '';
        if (source === 'potential') {
            // Shortlist has research_domains array
            const domains = academician.academician?.research_domains || [];
            expertise = domains.length > 0 
                ? domains.slice(0, 3).join(', ') 
                : 'Research expertise not specified';
        } else {
            // Connections/Search have flat string
            expertise = academician.expertise || 'Research expertise not specified';
        }
        
        // Verified badge
        const verified = academician.academician?.verified || academician.verified;
        
        // Build institution path: university • faculty • department
        let institutionPath = [];
        if (source === 'potential') {
            // Shortlist has nested objects
            const university = academician.academician?.university?.name;
            const faculty = academician.academician?.faculty?.name;
            if (university) institutionPath.push(university);
            if (faculty) institutionPath.push(faculty);
            if (department) institutionPath.push(department);
        } else {
            // Connections/Search have flat strings
            const university = academician.university;
            const faculty = academician.faculty;
            if (university) institutionPath.push(university);
            if (faculty && faculty !== department) institutionPath.push(faculty);
            if (department) institutionPath.push(department);
        }
        const institutionText = institutionPath.join(' • ');
        
        const isSelected = selectedAcademician && 
            ((selectedAcademician.academician?.academician_id || selectedAcademician.id) === academicianId);

        const avatarUrl = profilePicture ? `/storage/${profilePicture}` : null;
        const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??';

        return (
            <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}
                onClick={() => setSelectedAcademician(academician)}
            >
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12 flex-shrink-0">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
                            ) : (
                                <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                    {initials}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-medium text-gray-900 truncate">{name}</h4>
                                {verified && (
                                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 flex-shrink-0">
                                        Verified
                                    </Badge>
                                )}
                            </div>
                            {expertise && (
                                <p className="text-sm text-gray-500 truncate mt-0.5">{expertise}</p>
                            )}
                            {institutionText && (
                                <p className="text-xs text-gray-400 mt-1 truncate">{institutionText}</p>
                            )}
                        </div>
                        {isSelected && (
                            <div className="flex-shrink-0">
                                <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    const filteredPotentialSupervisors = potentialSupervisors.filter(item => {
        // Get academician ID from nested structure
        const academicianId = item.academician?.academician_id;
        
        // Exclude if already invited or bound
        if (academicianId && excludedAcademicianIds.includes(academicianId)) {
            return false;
        }
        
        // Apply search filter
        const name = item.academician?.full_name || '';
        const dept = item.academician?.department || '';
        const query = searchQuery.toLowerCase();
        return name.toLowerCase().includes(query) || dept.toLowerCase().includes(query);
    });

    const filteredConnections = connections.filter(conn => {
        // Get academician ID
        const academicianId = conn.id;
        
        // Exclude if already invited or bound
        if (academicianId && excludedAcademicianIds.includes(academicianId)) {
            return false;
        }
        
        // Apply search filter
        const name = conn.name || '';
        const dept = conn.department || '';
        const expertise = conn.expertise || '';
        const query = searchQuery.toLowerCase();
        return name.toLowerCase().includes(query) || 
               dept.toLowerCase().includes(query) || 
               expertise.toLowerCase().includes(query);
    });

    const filteredAllAcademicians = allAcademicians.filter(acad => {
        // Get academician ID
        const academicianId = acad.id;
        
        // Exclude if already invited or bound
        if (academicianId && excludedAcademicianIds.includes(academicianId)) {
            return false;
        }
        
        return true; // Search query already applied in API call
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={onClose}
                    >
                        <div 
                            className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                                <div className="flex-1 min-w-0 pr-2">
                                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 flex-shrink-0" />
                                        <span className="truncate">Add Co-Supervisor</span>
                                    </h2>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">
                                        Search and invite a co-supervisor for {relationship.student?.user?.name}
                                    </p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-hidden flex flex-col">
                                {!selectedAcademician ? (
                                    <>
                                        {/* Search Bar */}
                                        <div className="p-4 sm:p-6 border-b">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                                <Input
                                                    placeholder="Search by name or email..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="pl-9 sm:pl-10 text-sm sm:text-base"
                                                />
                                            </div>
                                        </div>

                                        {/* Tabs */}
                                        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                                            <TabsList className={`mx-4 sm:mx-6 mt-4 flex-shrink-0 h-auto p-1.5 grid gap-1 ${isStudent ? 'grid-cols-3' : 'grid-cols-2'}`}>
                                                {isStudent && (
                                                    <TabsTrigger 
                                                        value="potential" 
                                                        className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm whitespace-nowrap"
                                                    >
                                                        <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                                        <span className="hidden xs:inline">Shortlist</span>
                                                        <span className="xs:hidden">Short</span>
                                                        <span className="hidden sm:inline">({filteredPotentialSupervisors.length})</span>
                                                    </TabsTrigger>
                                                )}
                                                <TabsTrigger 
                                                    value="connections" 
                                                    className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm whitespace-nowrap"
                                                >
                                                    <Network className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                                    <span className="hidden xs:inline">Connections</span>
                                                    <span className="xs:hidden">Conn</span>
                                                    <span className="hidden sm:inline">({filteredConnections.length})</span>
                                                </TabsTrigger>
                                                <TabsTrigger 
                                                    value="all" 
                                                    className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm whitespace-nowrap"
                                                >
                                                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                                    <span className="hidden xs:inline">All</span>
                                                    <span className="xs:hidden">All</span>
                                                    <span className="hidden sm:inline">Academicians</span>
                                                </TabsTrigger>
                                            </TabsList>

                                            {isStudent && (
                                                <TabsContent value="potential" className="flex-1 mt-0 overflow-y-auto">
                                                    <div className="px-4 sm:px-6 pt-4 pb-4 space-y-3">
                                                        {filteredPotentialSupervisors.length === 0 ? (
                                                            <div className="text-center py-12">
                                                                <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                                <p className="text-gray-500">No potential supervisors in your shortlist</p>
                                                            </div>
                                                        ) : (
                                                            filteredPotentialSupervisors.map((item) => (
                                                                <AcademicianCard 
                                                                    key={item.academician?.academician_id || item.id} 
                                                                    academician={item}
                                                                    source="potential"
                                                                />
                                                            ))
                                                        )}
                                                    </div>
                                                </TabsContent>
                                            )}

                                            <TabsContent value="connections" className="flex-1 mt-0 overflow-y-auto">
                                                <div className="px-4 sm:px-6 pt-4 pb-4 space-y-3">
                                                    {filteredConnections.length === 0 ? (
                                                        <div className="text-center py-12">
                                                            <Network className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                            <p className="text-gray-500">No connections found</p>
                                                        </div>
                                                    ) : (
                                                        filteredConnections.map((academician) => (
                                                            <AcademicianCard 
                                                                key={academician.id} 
                                                                academician={academician}
                                                                source="connections"
                                                            />
                                                        ))
                                                    )}
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="all" className="flex-1 mt-0 overflow-y-auto">
                                                <div className="px-4 sm:px-6 pt-4 pb-4 space-y-3">
                                                    {searchQuery.length < 2 ? (
                                                        <div className="text-center py-12">
                                                            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                            <p className="text-gray-500">Type at least 2 characters to search</p>
                                                        </div>
                                                    ) : loading ? (
                                                        <div className="text-center py-12">
                                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                                                            <p className="text-gray-500 mt-4">Searching...</p>
                                                        </div>
                                                    ) : filteredAllAcademicians.length === 0 ? (
                                                        <div className="text-center py-12">
                                                            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                            <p className="text-gray-500">No academicians found</p>
                                                        </div>
                                                    ) : (
                                                        filteredAllAcademicians.map((academician) => (
                                                            <AcademicianCard 
                                                                key={academician.id} 
                                                                academician={academician}
                                                                source="all"
                                                            />
                                                        ))
                                                    )}
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </>
                                ) : (
                                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
                                        <Button
                                            variant="ghost"
                                            onClick={() => setSelectedAcademician(null)}
                                            className="mb-2 sm:mb-4 text-sm sm:text-base"
                                        >
                                            ← Back to Search
                                        </Button>

                                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                            <p className="text-xs sm:text-sm text-gray-600 mb-3">Selected Co-Supervisor:</p>
                                            <div className="flex items-start gap-3">
                                                {(() => {
                                                    const name = selectedAcademician.academician?.full_name || selectedAcademician.name;
                                                    const profilePicture = selectedAcademician.academician?.profile_picture || selectedAcademician.profile_picture;
                                                    const department = selectedAcademician.academician?.department || selectedAcademician.department;
                                                    const verified = selectedAcademician.academician?.verified || selectedAcademician.verified;
                                                    
                                                    // Research expertise/domains
                                                    let expertise = '';
                                                    if (selectedAcademician.academician?.research_domains) {
                                                        // Shortlist has research_domains array
                                                        const domains = selectedAcademician.academician.research_domains || [];
                                                        expertise = domains.length > 0 
                                                            ? domains.slice(0, 3).join(', ') 
                                                            : 'Research expertise not specified';
                                                    } else {
                                                        // Connections/Search have flat string
                                                        expertise = selectedAcademician.expertise || 'Research expertise not specified';
                                                    }
                                                    
                                                    // Build institution path: university • faculty • department
                                                    let institutionPath = [];
                                                    if (selectedAcademician.academician) {
                                                        // Shortlist has nested objects
                                                        const university = selectedAcademician.academician?.university?.name;
                                                        const faculty = selectedAcademician.academician?.faculty?.name;
                                                        if (university) institutionPath.push(university);
                                                        if (faculty) institutionPath.push(faculty);
                                                        if (department) institutionPath.push(department);
                                                    } else {
                                                        // Connections/Search have flat strings
                                                        const university = selectedAcademician.university;
                                                        const faculty = selectedAcademician.faculty;
                                                        if (university) institutionPath.push(university);
                                                        if (faculty && faculty !== department) institutionPath.push(faculty);
                                                        if (department) institutionPath.push(department);
                                                    }
                                                    const institutionText = institutionPath.join(' • ');
                                                    
                                                    const avatarUrl = profilePicture ? `/storage/${profilePicture}` : null;
                                                    const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??';
                                                    
                                                    return (
                                                        <>
                                                            <Avatar className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0">
                                                                {avatarUrl ? (
                                                                    <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
                                                                ) : (
                                                                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-base sm:text-lg">
                                                                        {initials}
                                                                    </AvatarFallback>
                                                                )}
                                                            </Avatar>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{name}</h4>
                                                                    {verified && (
                                                                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 flex-shrink-0">
                                                                            Verified
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                {expertise && (
                                                                    <p className="text-xs sm:text-sm text-gray-600 mb-1">{expertise}</p>
                                                                )}
                                                                {institutionText && (
                                                                    <p className="text-xs text-gray-500">{institutionText}</p>
                                                                )}
                                                            </div>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                                Personal Message <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
                                                placeholder="Explain why you'd like this academician to be a co-supervisor..."
                                                value={invitationMessage}
                                                onChange={(e) => setInvitationMessage(e.target.value)}
                                                maxLength={1000}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                {invitationMessage.length}/1000 characters
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 sm:p-6 border-t bg-gray-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                                    {selectedAcademician ? (
                                        <span>Ready to send invitation</span>
                                    ) : (
                                        <span>Select an academician to continue</span>
                                    )}
                                </div>
                                <div className="flex gap-2 sm:gap-3">
                                    <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
                                        Cancel
                                    </Button>
                                    {selectedAcademician && (
                                        <Button
                                            onClick={() => handleInvite(selectedAcademician)}
                                            disabled={sending || !invitationMessage.trim()}
                                            className="flex-1 sm:flex-none"
                                        >
                                            {sending ? 'Sending...' : 'Send Invitation'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CoSupervisorSearchModal;

