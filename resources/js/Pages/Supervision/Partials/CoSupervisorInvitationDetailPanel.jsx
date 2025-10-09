import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, User, Users, Calendar, FileText, CheckCircle2, 
    XCircle, AlertCircle, Clock, MessageSquare, Download, File,
    FolderOpen, ChevronDown, ChevronRight, History, Eye
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/Components/ui/tabs';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Textarea } from '@/Components/ui/textarea';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { OVERLAY_ANIMATION, SLIDE_PANEL_ANIMATION } from '@/Utils/modalAnimations';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'sonner';
import DocumentPreviewModal from '@/Pages/Supervision/Partials/DocumentPreviewModal';
import Modal from '@/Components/Modal';
import { usePage } from '@inertiajs/react';

/**
 * Co-Supervisor Invitation Detail Panel
 * Similar to UnifiedRequestDetailCard but for co-supervisor invitations
 */
export default function CoSupervisorInvitationDetailPanel({ invitation, onClose, onUpdated }) {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState('overview');
    const [responding, setResponding] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [documentsByFolder, setDocumentsByFolder] = useState({});
    const [availableFolders, setAvailableFolders] = useState([]);
    const [expandedFolders, setExpandedFolders] = useState({});
    const [loadingDocuments, setLoadingDocuments] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showVersionHistory, setShowVersionHistory] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);

    // Maximum size for previewing files (15MB)
    const MAX_PREVIEW_SIZE = 15 * 1024 * 1024;

    // Debug logging
    console.log('🔍 CoSupervisorInvitationDetailPanel - Full invitation:', invitation);
    console.log('👤 Auth user:', auth.user);
    console.log('📋 Student:', invitation.relationship?.student);
    console.log('🏫 University:', invitation.relationship?.student?.university);
    console.log('🏛️ Faculty:', invitation.relationship?.student?.faculty);
    console.log('📝 Supervision request:', invitation.relationship?.supervisionRequest || invitation.relationship?.supervision_request);
    console.log('🔗 Relationship ID:', invitation.relationship?.id);

    if (!invitation) return null;

    const student = invitation.relationship?.student;
    const mainSupervisor = invitation.relationship?.academician;
    const cosupervisor = invitation.cosupervisor;
    // supervisionRequest is camelCase in backend relationship
    const supervisionRequest = invitation.relationship?.supervisionRequest || 
                              invitation.relationship?.supervision_request;
    const relationshipId = invitation.relationship?.id;

    // Determine user's role in this invitation based on authenticated user
    const getUserRole = () => {
        const userId = auth.user?.unique_id;
        
        // Check if user is the invited co-supervisor
        if (userId === invitation.cosupervisor_academician_id) {
            return 'cosupervisor';
        }
        
        // Check if user is the main supervisor (who needs to approve if student initiated)
        if (userId === invitation.relationship?.academician_id && invitation.initiated_by === 'student') {
            return 'main_supervisor';
        }
        
        // Check if user is the student (who needs to approve if main supervisor initiated)
        if (userId === invitation.relationship?.student_id && invitation.initiated_by === 'main_supervisor') {
            return 'student';
        }
        
        // Otherwise they're just viewing (e.g., student viewing their own initiated invitation)
        return 'viewer';
    };

    const userRole = getUserRole();
    
    console.log('👥 Determined user role:', userRole);

    const handlePreview = (version, fileName) => {
        // Check if file is previewable (image or PDF under 15MB)
        const fileExtension = fileName.split('.').pop().toLowerCase();
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension);
        const isPdf = fileExtension === 'pdf';
        const isPreviewable = (isImage || isPdf) && version.size < MAX_PREVIEW_SIZE;

        if (isPreviewable) {
            // Use preview route for inline display, download route for downloading
            const previewUrl = route('supervision.document-versions.preview', version.id);
            const downloadUrl = route('supervision.document-versions.download', version.id);
            
            setPreviewFile({
                preview_url: previewUrl,
                download_url: downloadUrl,
                original_name: fileName,
                mime_type: isPdf ? 'application/pdf' : `image/${fileExtension}`,
                size: version.size,
                size_formatted: version.size_formatted || `${(version.size / 1024).toFixed(1)} KB`,
                created_at: version.created_at,
            });
        } else {
            // For non-previewable files, download directly
            window.open(route('supervision.document-versions.download', version.id), '_blank', 'noopener,noreferrer');
        }
    };

    const canRespondAsCosupervisor = userRole === 'cosupervisor' && 
        invitation.cosupervisor_status === 'pending' && 
        !invitation.cancelled_at;

    const canApprove = userRole !== 'cosupervisor' && 
        invitation.cosupervisor_status === 'accepted' && 
        invitation.approver_status === 'pending' &&
        !invitation.cancelled_at;

    const handleCosupervisorResponse = async (response) => {
        if (response === 'rejected' && !rejectionReason.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        setResponding(true);
        try {
            const res = await axios.post(
                `/api/v1/app/supervision/cosupervisor-invitations/${invitation.id}/respond`,
                {
                    response,
                    rejection_reason: response === 'rejected' ? rejectionReason : null
                }
            );
            
            // Show toast message
            toast.success(response === 'accepted' ? 'Invitation accepted! Waiting for approval.' : 'Invitation rejected');
            
            // Delay update and close to allow toast to be visible
            setTimeout(() => {
                onUpdated?.(res.data.invitation);
                onClose?.(); // Close panel for both accepted and rejected
            }, 1500);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to respond');
        } finally {
            setResponding(false);
            setShowRejectForm(false);
            setRejectionReason('');
        }
    };

    const handleApproverResponse = async (response) => {
        if (response === 'rejected' && !rejectionReason.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        setResponding(true);
        try {
            const res = await axios.post(
                `/api/v1/app/supervision/cosupervisor-invitations/${invitation.id}/approve`,
                {
                    response,
                    rejection_reason: response === 'rejected' ? rejectionReason : null
                }
            );
            
            // Show toast message
            toast.success(response === 'accepted' ? 'Co-supervisor approved!' : 'Co-supervisor invitation declined');
            
            // Delay update and close to allow toast to be visible
            setTimeout(() => {
                onUpdated?.(res.data.invitation);
                onClose?.();
            }, 1500);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to respond');
        } finally {
            setResponding(false);
            setShowRejectForm(false);
            setRejectionReason('');
        }
    };

    const getStatusInfo = () => {
        if (invitation.cancelled_at) {
            return { text: 'Cancelled', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: XCircle };
        }
        if (invitation.cosupervisor_status === 'rejected') {
            return { text: 'Rejected by Co-supervisor', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle };
        }
        if (invitation.approver_status === 'rejected') {
            return { text: 'Not Approved', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle };
        }
        if (invitation.completed_at) {
            return { text: 'Completed', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2 };
        }
        if (invitation.cosupervisor_status === 'accepted' && invitation.approver_status === 'pending') {
            return { text: 'Awaiting Approval', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock };
        }
        return { text: 'Pending Response', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: AlertCircle };
    };

    const statusInfo = getStatusInfo();
    const StatusIcon = statusInfo.icon;

    const studentName = student?.full_name || student?.user?.name || 'Student';
    const studentAvatarUrl = student?.profile_picture ? `/storage/${student.profile_picture}` : null;
    const studentInitials = studentName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    
    // universityDetails is the relationship name in backend
    const universityName = student?.universityDetails?.name || 
                          student?.universityDetails?.full_name || 
                          student?.university_details?.name || 
                          student?.university_details?.full_name || 
                          null;

    return (
        <>
            <AnimatePresence>
                <motion.div 
                    {...OVERLAY_ANIMATION}
                    className="fixed inset-0 z-40 flex items-center justify-end bg-black/50" 
                    onClick={onClose}
                >
                    <motion.div 
                        {...SLIDE_PANEL_ANIMATION}
                        className="w-full max-w-3xl h-full bg-white shadow-xl overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Section */}
                        <div className="p-6 border-b">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    <Avatar className="h-12 w-12">
                                        {studentAvatarUrl ? (
                                            <img src={studentAvatarUrl} alt={studentName} className="h-full w-full object-cover" />
                                        ) : (
                                            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-sm font-semibold">
                                                {studentInitials}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold text-slate-900">{studentName}</h2>
                                        <p className="text-sm text-slate-600">
                                            {universityName || 'Student'}
                                        </p>
                                        <div className="mt-2 flex items-center gap-3 flex-wrap">
                                            <Badge className={`${statusInfo.color} border flex items-center gap-1`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {statusInfo.text}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X className="h-5 w-5 text-slate-500" />
                                </button>
                            </div>
                        </div>

                    {/* Action Buttons */}
                    <div className="px-6 py-4 border-b bg-slate-50">
                        {canRespondAsCosupervisor && !showRejectForm && (
                            <div className="flex gap-3">
                                <Button
                                    onClick={() => handleCosupervisorResponse('accepted')}
                                    disabled={responding}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Accept Invitation
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowRejectForm(true)}
                                    disabled={responding}
                                    className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Decline
                                </Button>
                            </div>
                        )}

                        {canApprove && !showRejectForm && (
                            <>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2 mb-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-yellow-900">Your Approval Required</p>
                                        <p className="text-xs text-yellow-700 mt-1">
                                            {cosupervisor?.full_name || cosupervisor?.user?.name || 'The co-supervisor'} has accepted the invitation to be a co-supervisor.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => handleApproverResponse('accepted')}
                                        disabled={responding}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Approve Co-Supervisor
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowRejectForm(true)}
                                        disabled={responding}
                                        className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Reject
                                    </Button>
                                </div>
                            </>
                        )}

                        {showRejectForm && (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reason for {canApprove ? 'Rejection' : 'Declining'} <span className="text-red-500">*</span>
                                    </label>
                                    <Textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder="Please provide a reason..."
                                        className="min-h-[80px]"
                                        maxLength={500}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{rejectionReason.length}/500</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowRejectForm(false);
                                            setRejectionReason('');
                                        }}
                                        disabled={responding}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            if (canRespondAsCosupervisor) {
                                                handleCosupervisorResponse('rejected');
                                            } else if (canApprove) {
                                                handleApproverResponse('rejected');
                                            }
                                        }}
                                        disabled={responding || !rejectionReason.trim()}
                                        className="flex-1"
                                    >
                                        {responding ? 'Processing...' : 'Confirm'}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {!canRespondAsCosupervisor && !canApprove && invitation.cosupervisor_status === 'accepted' && invitation.approver_status === 'pending' && (
                            <div className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded p-3 text-center">
                                Waiting for {invitation.initiated_by === 'student' ? 'main supervisor' : 'student'} approval
                            </div>
                        )}

                        {!canRespondAsCosupervisor && !canApprove && invitation.completed_at && (
                            <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded p-3 text-center">
                                ✓ Invitation accepted and approved - Co-supervisor relationship is active
                            </div>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="flex-1 overflow-hidden">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                            <TabsList className="px-6 bg-gray-100 w-full justify-start rounded-none h-auto p-0 gap-0">
                                <TabsTrigger 
                                    value="overview"
                                    className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=inactive]:bg-transparent rounded-none px-6 py-3"
                                >
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="documents"
                                    className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=inactive]:bg-transparent rounded-none px-6 py-3"
                                >
                                    Documents
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="message"
                                    className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=inactive]:bg-transparent rounded-none px-6 py-3"
                                >
                                    Message
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="timeline"
                                    className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=inactive]:bg-transparent rounded-none px-6 py-3"
                                >
                                    Timeline
                                </TabsTrigger>
                            </TabsList>

                            <div className="flex-1 overflow-auto">
                                <TabsContent value="overview" className="mt-0 h-full">
                                    <ScrollArea className="h-full">
                                        <OverviewTab 
                                            invitation={invitation}
                                            student={student}
                                            mainSupervisor={mainSupervisor}
                                            cosupervisor={cosupervisor}
                                        />
                                    </ScrollArea>
                                </TabsContent>

                                <TabsContent value="documents" className="mt-0 h-full">
                                    <ScrollArea className="h-full">
                                        <DocumentsTab 
                                            relationshipId={relationshipId}
                                            documentsByFolder={documentsByFolder}
                                            availableFolders={availableFolders}
                                            expandedFolders={expandedFolders}
                                            loading={loadingDocuments}
                                            onLoad={(docs, folders) => {
                                                setDocumentsByFolder(docs);
                                                setAvailableFolders(folders);
                                                // Expand all folders by default
                                                const expanded = {};
                                                folders.forEach(folder => {
                                                    expanded[folder] = true;
                                                });
                                                setExpandedFolders(expanded);
                                            }}
                                            onLoadingChange={(loading) => setLoadingDocuments(loading)}
                                            onToggleFolder={(folderName) => {
                                                setExpandedFolders({
                                                    ...expandedFolders,
                                                    [folderName]: !expandedFolders[folderName],
                                                });
                                            }}
                                            onViewVersions={(doc) => {
                                                setSelectedDocument(doc);
                                                setShowVersionHistory(true);
                                            }}
                                            onPreview={(version, fileName) => {
                                                handlePreview(version, fileName);
                                            }}
                                        />
                                    </ScrollArea>
                                </TabsContent>

                                <TabsContent value="message" className="mt-0 h-full">
                                    <ScrollArea className="h-full">
                                        <MessageTab invitation={invitation} />
                                    </ScrollArea>
                                </TabsContent>

                                <TabsContent value="timeline" className="mt-0 h-full">
                                    <ScrollArea className="h-full">
                                        <TimelineTab invitation={invitation} />
                                    </ScrollArea>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </motion.div>
            </motion.div>
            </AnimatePresence>

            {/* Version History Modal */}
            {selectedDocument && (
                <Modal 
                    show={showVersionHistory} 
                    onClose={() => {
                        setShowVersionHistory(false);
                        setSelectedDocument(null);
                    }} 
                    maxWidth="2xl"
                >
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">
                            Version History: {selectedDocument.name}
                        </h2>

                        <div className="space-y-3">
                            {selectedDocument.versions?.map((version) => {
                                const isCurrent = version.id === selectedDocument.current_version_id;
                                
                                return (
                                    <div
                                        key={version.id}
                                        className={`p-4 rounded-lg border ${
                                            isCurrent ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-semibold text-slate-900">
                                                        Version {version.version_number}
                                                    </span>
                                                    {isCurrent && (
                                                        <Badge className="bg-indigo-600 text-white">Current</Badge>
                                                    )}
                                                </div>
                                                
                                                <div className="text-sm text-slate-600 space-y-1">
                                                    <p>Uploaded by: {version.uploader?.full_name || version.uploader?.name || 'Unknown'}</p>
                                                    <p>Date: {format(new Date(version.created_at), 'dd/MM/yyyy HH:mm')}</p>
                                                    <p>Size: {version.size_formatted || `${(version.size / 1024).toFixed(1)} KB`}</p>
                                                    {version.notes && (
                                                        <p className="mt-2 text-slate-700">
                                                            <span className="font-medium">Notes:</span> {version.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handlePreview(version, version.original_name)}
                                                    title="Preview document"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Modal>
            )}

            {/* Document Preview Modal */}
            <DocumentPreviewModal
                file={previewFile}
                onClose={() => setPreviewFile(null)}
            />
        </>
    );
}

// Overview Tab
function OverviewTab({ invitation, student, mainSupervisor, cosupervisor }) {
    const studentName = student?.full_name || student?.user?.name || 'Student';
    const mainSupervisorName = mainSupervisor?.full_name || mainSupervisor?.user?.name || 'Main Supervisor';
    const cosupervisorName = cosupervisor?.full_name || cosupervisor?.user?.name || 'Co-supervisor';

    // Proper data extraction for university and faculty
    // universityDetails is the relationship name loaded from backend
    const universityNameOverview = student?.universityDetails?.name || 
                                   student?.universityDetails?.full_name || 
                                   student?.university_details?.name || 
                                   student?.university_details?.full_name || 
                                   '—';
    
    const facultyName = student?.faculty?.name || 
                       student?.faculty?.full_name || 
                       '—';

    return (
        <div className="p-6 space-y-6">
            {/* Student Profile */}
            <section className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Student Information</h3>
                <div className="space-y-3">
                    <InfoItem label="Full Name" value={studentName} />
                    <InfoItem label="Email" value={student?.user?.email || student?.email || '—'} />
                    <InfoItem label="University" value={universityNameOverview} />
                    <InfoItem label="Faculty" value={facultyName} />
                </div>
            </section>

            {/* Invitation Details */}
            <section className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Invitation Details</h3>
                <div className="space-y-3">
                    <InfoItem label="Main Supervisor" value={mainSupervisorName} />
                    <InfoItem label="Invited Co-supervisor" value={cosupervisorName} />
                    <InfoItem 
                        label="Initiated by" 
                        value={invitation.initiated_by === 'student' ? `${studentName} (Student)` : `${mainSupervisorName} (Main Supervisor)`} 
                    />
                    <InfoItem 
                        label="Sent" 
                        value={invitation.created_at ? format(new Date(invitation.created_at), 'PPp') : '—'} 
                    />
                </div>
            </section>

            {/* Progress */}
            {!invitation.cancelled_at && !invitation.completed_at && (
                <section className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Approval Progress</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                invitation.cosupervisor_status === 'accepted' 
                                    ? 'bg-green-100 text-green-700' 
                                    : invitation.cosupervisor_status === 'rejected'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-gray-100 text-gray-500'
                            }`}>
                                {invitation.cosupervisor_status === 'accepted' ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-900">Co-supervisor Response</p>
                                <p className="text-sm text-slate-500">
                                    {invitation.cosupervisor_status === 'accepted' ? 'Accepted' : 
                                     invitation.cosupervisor_status === 'rejected' ? 'Rejected' : 'Pending'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                invitation.approver_status === 'accepted' 
                                    ? 'bg-green-100 text-green-700' 
                                    : invitation.approver_status === 'rejected'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-gray-100 text-gray-500'
                            }`}>
                                {invitation.approver_status === 'accepted' ? <CheckCircle2 className="w-5 h-5" /> : '2'}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-900">
                                    {invitation.initiated_by === 'student' ? 'Main Supervisor' : 'Student'} Approval
                                </p>
                                <p className="text-sm text-slate-500">
                                    {invitation.approver_status === 'accepted' ? 'Approved' : 
                                     invitation.approver_status === 'rejected' ? 'Rejected' : 'Pending'}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

// Documents Tab - Fetches and displays relationship documents with folder organization (Read-only for co-supervisors)
const FOLDER_COLORS = {
    'Drafts': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Final Papers': 'bg-green-50 text-green-700 border-green-200',
    'Meeting Notes': 'bg-blue-50 text-blue-700 border-blue-200',
    'Literature': 'bg-purple-50 text-purple-700 border-purple-200',
    'Data': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'General': 'bg-slate-50 text-slate-700 border-slate-200',
};

function DocumentsTab({ 
    relationshipId, 
    documentsByFolder, 
    availableFolders, 
    expandedFolders,
    loading, 
    onLoad, 
    onLoadingChange,
    onToggleFolder,
    onViewVersions,
    onPreview
}) {
    useEffect(() => {
        const fetchDocuments = async () => {
            if (!relationshipId) return;
            
            onLoadingChange(true);
            try {
                const response = await axios.get(`/api/v1/app/supervision/relationships/${relationshipId}/documents`);
                console.log('📁 Documents API response:', response.data);
                
                // Documents are grouped by folder
                const documentsByFolder = response.data.data?.documents_by_folder || {};
                const availableFolders = response.data.data?.available_folders || Object.keys(documentsByFolder);
                
                console.log('📄 Documents by folder:', documentsByFolder);
                console.log('📂 Available folders:', availableFolders);
                onLoad(documentsByFolder, availableFolders);
            } catch (error) {
                console.error('❌ Error fetching documents:', error);
                toast.error(error.response?.data?.message || 'Failed to load documents');
                onLoad({}, []);
            } finally {
                onLoadingChange(false);
            }
        };

        fetchDocuments();
    }, [relationshipId]);

    if (loading) {
        return (
            <div className="p-6">
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="border border-slate-200 rounded-lg p-4 animate-pulse">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-200 rounded" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!relationshipId) {
        return (
            <div className="p-6">
                <div className="text-center text-slate-500 py-12">
                    <File className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No relationship information available</p>
                </div>
            </div>
        );
    }

    const totalDocuments = Object.values(documentsByFolder).reduce((sum, docs) => sum + docs.length, 0);

    if (totalDocuments === 0) {
        return (
            <div className="p-6">
                <div className="text-center text-slate-500 py-12">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="font-medium text-slate-700">No documents yet</p>
                    <p className="text-sm mt-1">Documents uploaded to this supervision will appear here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-semibold text-slate-900">Supervision Documents</h2>
                <p className="text-sm text-slate-600 mt-1">
                    {totalDocuments} document{totalDocuments !== 1 ? 's' : ''} across {Object.keys(documentsByFolder).length} folder{Object.keys(documentsByFolder).length !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-indigo-600 mt-2">
                    📖 Read-only view - Documents shared between the student and main supervisor
                </p>
            </div>

            {/* Folders with Documents */}
            <div className="space-y-4">
                {availableFolders.map((folderName) => {
                    const folderDocs = documentsByFolder[folderName] || [];
                    if (folderDocs.length === 0) return null;

                    const isExpanded = expandedFolders[folderName];
                    const folderColor = FOLDER_COLORS[folderName] || FOLDER_COLORS['General'];

                    return (
                        <div key={folderName} className="border border-slate-200 rounded-lg bg-white shadow-sm">
                            {/* Folder Header */}
                            <button
                                onClick={() => onToggleFolder(folderName)}
                                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    {isExpanded ? (
                                        <ChevronDown className="h-5 w-5 text-slate-400" />
                                    ) : (
                                        <ChevronRight className="h-5 w-5 text-slate-400" />
                                    )}
                                    <FolderOpen className="h-5 w-5 text-slate-600" />
                                    <span className="font-semibold text-slate-900">{folderName}</span>
                                    <Badge variant="outline" className={folderColor}>
                                        {folderDocs.length} file{folderDocs.length !== 1 ? 's' : ''}
                                    </Badge>
                                </div>
                            </button>

                            {/* Documents List */}
                            {isExpanded && (
                                <div className="border-t border-slate-200 p-4 space-y-3">
                                    {folderDocs.map((doc) => (
                                        <ReadOnlyDocumentCard
                                            key={doc.id}
                                            document={doc}
                                            onPreview={onPreview}
                                            onViewVersions={onViewVersions}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Read-only Document Card for co-supervisors
function ReadOnlyDocumentCard({ document, onPreview, onViewVersions }) {
    const currentVersion = document.current_version || document.currentVersion;
    const versionCount = document.versions?.length || 0;

    return (
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors">
            <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="p-2 bg-white rounded-md border border-slate-200">
                    <FileText className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-900 truncate">{document.name}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span>v{currentVersion?.version_number || 1}</span>
                        <span>•</span>
                        <span>{currentVersion?.uploader?.full_name || currentVersion?.uploader?.name || 'Unknown'}</span>
                        <span>•</span>
                        <span>{currentVersion?.created_at ? format(new Date(currentVersion.created_at), 'dd/MM/yyyy') : '—'}</span>
                    </div>
                    {document.notes && (
                        <p className="text-sm text-slate-600 mt-2 line-clamp-2">{document.notes}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onPreview(currentVersion, currentVersion?.original_name)}
                    title="Preview document"
                >
                    <Eye className="h-4 w-4" />
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onViewVersions(document)}
                    title="View version history"
                >
                    <History className="h-4 w-4" />
                    {versionCount > 1 && (
                        <span className="ml-1 text-xs">{versionCount}</span>
                    )}
                </Button>
            </div>
        </div>
    );
}

// Message Tab
function MessageTab({ invitation }) {
    return (
        <div className="p-6 space-y-6">
            <section className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Personal Invitation Message</h3>
                </div>

                {invitation.invitation_message ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900 leading-relaxed whitespace-pre-line italic">
                            "{invitation.invitation_message}"
                        </p>
                    </div>
                ) : (
                    <p className="text-sm text-slate-500">No personal message provided</p>
                )}

                {invitation.rejection_reason && (
                    <div className="mt-4">
                        <h4 className="text-sm font-semibold text-slate-700 mb-2">Rejection Reason</h4>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm text-red-900 leading-relaxed whitespace-pre-line">
                                "{invitation.rejection_reason}"
                            </p>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}

// Timeline Tab
function TimelineTab({ invitation }) {
    const timeline = [];

    // Created
    if (invitation.created_at) {
        timeline.push({
            id: 1,
            title: 'Invitation Sent',
            date: invitation.created_at,
            status: 'completed',
        });
    }

    // Co-supervisor responded
    if (invitation.cosupervisor_responded_at) {
        timeline.push({
            id: 2,
            title: invitation.cosupervisor_status === 'accepted' ? 'Co-supervisor Accepted' : 'Co-supervisor Declined',
            date: invitation.cosupervisor_responded_at,
            status: 'completed',
        });
    }

    // Approver responded
    if (invitation.approver_responded_at) {
        timeline.push({
            id: 3,
            title: invitation.approver_status === 'accepted' ? 'Approved' : 'Not Approved',
            date: invitation.approver_responded_at,
            status: 'completed',
        });
    }

    // Completed
    if (invitation.completed_at) {
        timeline.push({
            id: 4,
            title: 'Invitation Completed',
            date: invitation.completed_at,
            status: 'completed',
        });
    }

    // Cancelled
    if (invitation.cancelled_at) {
        timeline.push({
            id: 5,
            title: 'Invitation Cancelled',
            date: invitation.cancelled_at,
            status: 'cancelled',
        });
    }

    return (
        <div className="p-6">
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Timeline</h3>

                {timeline.length === 0 ? (
                    <div className="text-sm text-slate-500 text-center py-8">
                        No timeline events yet
                    </div>
                ) : (
                    <div className="space-y-4">
                        {timeline.map((event, index) => (
                            <div key={event.id} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className={`w-2 h-2 rounded-full ${
                                        event.status === 'completed' ? 'bg-green-500' : 
                                        event.status === 'cancelled' ? 'bg-red-500' : 
                                        'bg-slate-300'
                                    }`} />
                                    {index < timeline.length - 1 && (
                                        <div className="w-0.5 h-full bg-slate-200 mt-2" />
                                    )}
                                </div>
                                <div className="flex-1 pb-8">
                                    <h4 className="font-medium text-slate-900">{event.title}</h4>
                                    <p className="text-sm text-slate-500">
                                        {event.date ? format(new Date(event.date), 'PPp') : 'TBD'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

// InfoItem component
function InfoItem({ label, value }) {
    return (
        <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
            <div className="text-sm text-slate-700">{value || '—'}</div>
        </div>
    );
}
