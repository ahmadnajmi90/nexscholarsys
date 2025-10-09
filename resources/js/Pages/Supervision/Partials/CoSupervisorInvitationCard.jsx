import React from 'react';
import { Calendar, User, Users, FileText, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/card';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { usePage } from '@inertiajs/react';

/**
 * Co-Supervisor Invitation Card (Enhanced with progress bar and message preview)
 * Smart profile display: Shows student to co-supervisor, shows co-supervisor to others
 */
const CoSupervisorInvitationCard = ({ invitation, onClick }) => {
    const { auth } = usePage().props;
    
    const student = invitation.relationship?.student;
    const mainSupervisor = invitation.relationship?.academician;
    const cosupervisor = invitation.cosupervisor;
    
    // supervisionRequest is camelCase in backend relationship
    const proposalTitle = invitation.relationship?.supervisionRequest?.proposal_title || 
                         invitation.relationship?.supervision_request?.proposal_title;

    // Determine if current user is the co-supervisor being invited
    const isCoSupervisorView = auth.user?.unique_id === invitation.cosupervisor_academician_id;

    // Smart profile display logic
    let displayName, displayAvatarUrl, displayUniversity, displayInitials;
    
    if (isCoSupervisorView) {
        // Show STUDENT profile to co-supervisor
        displayName = student?.full_name || student?.user?.name || 'Student';
        displayAvatarUrl = student?.profile_picture ? `/storage/${student.profile_picture}` : null;
        displayUniversity = student?.universityDetails?.name || 
                          student?.universityDetails?.full_name || 
                          student?.university_details?.name || 
                          student?.university_details?.full_name || 
                          null;
        displayInitials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    } else {
        // Show CO-SUPERVISOR profile to everyone else (student, main supervisor, approver)
        displayName = cosupervisor?.full_name || cosupervisor?.user?.name || 'Co-Supervisor';
        displayAvatarUrl = cosupervisor?.profile_picture ? `/storage/${cosupervisor.profile_picture}` : null;
        // Try multiple paths for university data
        displayUniversity = cosupervisor?.universityDetails?.name || 
                          cosupervisor?.universityDetails?.full_name ||
                          cosupervisor?.university?.name || 
                          cosupervisor?.university?.full_name ||
                          cosupervisor?.university_details?.name ||
                          cosupervisor?.university_details?.full_name ||
                          null;
        displayInitials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    }

    const studentName = student?.full_name || student?.user?.name || 'Student';

    const mainSupervisorName = mainSupervisor?.full_name || mainSupervisor?.user?.name || 'Main Supervisor';
    const invitedByName = invitation.initiated_by === 'student' 
        ? studentName 
        : mainSupervisorName;

    const sentAgo = invitation.created_at
        ? formatDistanceToNow(new Date(invitation.created_at), { addSuffix: true })
        : null;

    const getStatusBadge = () => {
        if (invitation.cancelled_at) {
            return { text: 'Cancelled', className: 'bg-gray-100 text-gray-700' };
        }
        if (invitation.cosupervisor_status === 'rejected') {
            return { text: 'Rejected', className: 'bg-red-100 text-red-700' };
        }
        if (invitation.approver_status === 'rejected') {
            return { text: 'Not Approved', className: 'bg-red-100 text-red-700' };
        }
        if (invitation.completed_at) {
            return { text: 'Completed', className: 'bg-green-100 text-green-700' };
        }
        if (invitation.cosupervisor_status === 'accepted' && invitation.approver_status === 'pending') {
            return { text: 'Awaiting Approval', className: 'bg-yellow-100 text-yellow-700' };
        }
        if (invitation.cosupervisor_status === 'pending') {
            return { text: 'Pending Response', className: 'bg-blue-100 text-blue-700' };
        }
        return { text: 'Pending', className: 'bg-blue-100 text-blue-700' };
    };

    const status = getStatusBadge();

    // Progress calculation
    const getProgress = () => {
        if (invitation.completed_at || invitation.approver_status === 'accepted') return 100;
        if (invitation.cosupervisor_status === 'accepted') return 50;
        return 0;
    };

    const progress = getProgress();

    return (
        <Card 
            className="hover:shadow-lg transition-all cursor-pointer border border-gray-200"
            onClick={onClick}
        >
            <CardContent className="p-5">
                {/* Header: Profile Info + Status Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                        {/* Avatar - 10x10 to match standard */}
                        <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {displayAvatarUrl ? (
                                <img src={displayAvatarUrl} alt={displayName} className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <div className="bg-indigo-100 text-indigo-700 w-full h-full flex items-center justify-center text-xs font-semibold">
                                    {displayInitials}
                                </div>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-[1.05rem] font-semibold text-gray-900 leading-snug truncate">{displayName}</h3>
                            {displayUniversity && <p className="text-sm text-gray-600 truncate font-normal">{displayUniversity}</p>}
                            {sentAgo && <p className="text-xs text-slate-500 mt-0.5">{sentAgo}</p>}
                        </div>
                    </div>
                    <Badge className={`${status.className} flex-shrink-0`}>
                        {status.text}
                    </Badge>
                </div>

                {/* Proposal Title */}
                {proposalTitle && (
                    <div className="mb-4">
                        <h4 className="text-base font-semibold text-slate-900 line-clamp-2 leading-snug">{proposalTitle}</h4>
                    </div>
                )}

                {/* Quick Info */}
                <div className="space-y-2 mb-4">
                    {isCoSupervisorView ? (
                        // Co-supervisor sees student and main supervisor info
                        <>
                            <div className="flex items-center gap-2 text-sm">
                                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-500">Student:</span>
                                <span className="text-gray-900 font-medium truncate flex-1">{studentName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-500">Main Supervisor:</span>
                                <span className="text-gray-900 font-medium truncate flex-1">{mainSupervisorName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-500">Invited by:</span>
                                <span className="text-gray-900 font-medium truncate flex-1">{invitedByName}</span>
                            </div>
                        </>
                    ) : (
                        // Others see co-supervisor, main supervisor, and who invited
                        <>
                            <div className="flex items-center gap-2 text-sm">
                                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-500">Co-Supervisor:</span>
                                <span className="text-gray-900 font-medium truncate flex-1">{cosupervisor?.full_name || cosupervisor?.user?.name || 'Co-Supervisor'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-500">Main Supervisor:</span>
                                <span className="text-gray-900 font-medium truncate flex-1">{mainSupervisorName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-500">Invited by:</span>
                                <span className="text-gray-900 font-medium truncate flex-1">{invitedByName}</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Progress Bar */}
                {!invitation.cancelled_at && (invitation.cosupervisor_status === 'pending' || invitation.approver_status === 'pending') && (
                    <div className="mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                            <span>Approval Progress</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-300 ${
                                    progress === 100 ? 'bg-green-500' :
                                    progress === 50 ? 'bg-yellow-500' :
                                    'bg-blue-500'
                                }`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs">
                            <div className="flex items-center gap-1">
                                {invitation.cosupervisor_status === 'accepted' ? (
                                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                                ) : (
                                    <Clock className="w-3 h-3 text-gray-400" />
                                )}
                                <span className={invitation.cosupervisor_status === 'accepted' ? 'text-green-700' : 'text-gray-500'}>
                                    Co-supervisor
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                {invitation.approver_status === 'accepted' ? (
                                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                                ) : (
                                    <Clock className="w-3 h-3 text-gray-400" />
                                )}
                                <span className={invitation.approver_status === 'accepted' ? 'text-green-700' : 'text-gray-500'}>
                                    Approver
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Personal Message Preview */}
                {invitation.invitation_message && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs font-medium text-blue-900 mb-1">Personal Message:</p>
                        <p className="text-sm text-blue-800 italic line-clamp-2">
                            "{invitation.invitation_message}"
                        </p>
                    </div>
                )}

                {/* Rejection Reason (if any) */}
                {invitation.rejection_reason && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-xs font-medium text-red-900 mb-1">Rejection Reason:</p>
                        <p className="text-sm text-red-800 line-clamp-2">
                            "{invitation.rejection_reason}"
                        </p>
                    </div>
                )}

                {/* View Details Button - Always show at bottom */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs sm:text-sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick?.();
                        }}
                    >
                        <CheckCircle2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        View Details
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default CoSupervisorInvitationCard;
