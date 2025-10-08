import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Separator } from '@/Components/ui/separator';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import {
  CalendarClock,
  MessageCircle,
  GaugeCircle,
  ExternalLink,
  User2,
  Upload,
  FileText,
  Settings,
  Info
} from 'lucide-react';
import { logError } from '@/Utils/logError';
import StudentRelationshipDetailModal from '@/Pages/Supervision/Partials/StudentRelationshipDetailModal';
import UniversityLetterUploadModal from '@/Pages/Supervision/Partials/UniversityLetterUploadModal';
import ScheduleMeetingDialog from '@/Pages/Supervision/Partials/ScheduleMeetingDialog';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ManageSupervisorPanel({ relationships = [], reload, onOpenDetail, onOpenMeetings }) {
  const [selectedRelationship, setSelectedRelationship] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false);

  const activeRelationships = useMemo(
    () => (Array.isArray(relationships) ? relationships.filter(rel => rel.status === 'active') : []),
    [relationships]
  );

  const handleOpenModal = (relationship, tab = 'overview') => {
    setSelectedRelationship(relationship);
    setSelectedTab(tab);
  };

  const handleCloseModal = () => {
    setSelectedRelationship(null);
    setSelectedTab('overview');
  };

  const handleUpdated = () => {
    reload?.();
  };

  const handleScheduleMeetingClose = () => {
    setIsScheduleMeetingOpen(false);
  };

  const handleScheduleMeetingSuccess = () => {
    setIsScheduleMeetingOpen(false);
    setSelectedRelationship(null);
    reload?.();
  };

  if (!activeRelationships.length) {
    return (
      <Card className="border-dashed border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">You do not have an active supervisor yet</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Once a supervisor accepts your proposal, their details will appear here and the management tools will unlock.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Relationship Cards - 2 per row */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {activeRelationships.map((relationship) => (
          <ActiveRelationshipCard
            key={relationship.id}
            relationship={relationship}
            onOpenDetail={handleOpenModal}
            onOpenMeetings={onOpenMeetings}
            reload={reload}
          />
        ))}
      </div>

      {/* Relationship Detail Modal */}
      {selectedRelationship && (
        <StudentRelationshipDetailModal
          relationship={selectedRelationship}
          onClose={handleCloseModal}
          onUpdated={handleUpdated}
          defaultTab={selectedTab}
        />
      )}

      {/* Schedule Meeting Dialog */}
      {isScheduleMeetingOpen && selectedRelationship && (
        <ScheduleMeetingDialog
          relationship={selectedRelationship}
          onClose={handleScheduleMeetingClose}
          onScheduled={handleScheduleMeetingSuccess}
          userRole="student"
        />
      )}
    </>
  );
}

function ActiveRelationshipCard({ relationship, onOpenDetail, onOpenMeetings, reload }) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  const academician = relationship?.academician ?? {};
  const profilePicture = academician.profile_picture ? `/storage/${academician.profile_picture}` : null;
  const fullName = academician.full_name ?? 'Supervisor';
  const university = academician.university?.name || academician.university?.full_name || '';
  const department = academician.department || '';
  
  // Get first research expertise only (research_domains is the cleaned-up name)
  const researchTopic = academician.research_domains?.[0] || '';
  
  const role = relationship?.role === 'main' ? 'Main' : 'Co-supervisor';
  const statusLabel = 'Accepted by Student';
  const cohort = relationship?.cohort || '';
  
  // Capitalize meeting cadence (e.g., "weekly" -> "Weekly")
  const cadence = relationship?.meeting_cadence 
    ? relationship.meeting_cadence.charAt(0).toUpperCase() + relationship.meeting_cadence.slice(1)
    : '';
  
  const hasUniversityLetter = !!relationship?.university_letter_path;
  
  // Get initials for avatar
  const initials = fullName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);

  // Calculate metrics
  const meetingsCount = relationship?.meetings?.length || 0;
  const tasksCount = relationship?.onboarding_checklist_items?.filter(item => !item.completed).length || 0;
  const documentsCount = relationship?.documents?.length || 0;

  const handleOpenChat = () => {
    if (relationship?.conversation_id) {
      onOpenDetail?.(relationship, 'chat');
    }
  };

  const handleScheduleMeeting = () => {
    // First open the modal
    onOpenDetail?.(relationship, 'overview');
    // Then open the schedule meeting dialog
    // We need to delay this slightly so the modal renders first
    setTimeout(() => {
      setIsUploadModalOpen(false); // Make sure upload modal is closed
      const event = new CustomEvent('open-schedule-meeting', { detail: { relationship } });
      window.dispatchEvent(event);
    }, 100);
  };

  const handleShareDocument = () => {
    onOpenDetail?.(relationship, 'documents');
  };

  const handleManage = () => {
    // Navigate to full-page view
    router.visit(route('supervision.relationships.show', relationship.id));
  };

  return (
    <>
      <Card 
        className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onOpenDetail?.(relationship, 'overview')}
      >
        {/* Header Section */}
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <Avatar className="h-12 w-12 border-2 border-slate-200">
                {profilePicture ? (
                  <img src={profilePicture} alt={fullName} className="h-full w-full object-cover" />
                ) : (
                  <AvatarFallback className="bg-indigo-100 text-indigo-700 font-semibold text-xs">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-slate-900 truncate mb-1">{fullName}</h3>
              <p className="text-sm text-slate-600 truncate">
                {university && department ? `${university} • ${department}` : (university || department || 'University')}
              </p>
              {researchTopic && (
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-1">{researchTopic}</p>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <Badge className="bg-slate-900 text-white border-none hover:bg-slate-800 px-2 py-0.5 text-xs">
                {role}
              </Badge>
              <Badge className="bg-green-50 text-green-700 border-green-200 border px-2 py-0.5 text-xs">
                {statusLabel}
              </Badge>
              {cohort && cadence && (
                <p className="text-xs text-slate-500 mt-0.5">{cohort} • {cadence}</p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pb-4">
          {/* University Letter Alert - Only show when NOT uploaded (reminder) */}
          {!hasUniversityLetter && (
            <Alert className="bg-blue-50 border-blue-200 py-2.5">
              <FileText className="h-3.5 w-3.5 text-blue-600" />
              <AlertDescription className="text-xs">
                <div className="space-y-2">
                  <div>
                    <p className="font-semibold text-blue-900">
                      University Letter
                    </p>
                    <p className="text-blue-700 text-xs mt-0.5">
                      Upload official letter to complete validation.
                    </p>
                  </div>
                  <div>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 h-7 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsUploadModalOpen(true);
                      }}
                    >
                      <Upload className="mr-1 h-3 w-3" />
                      Upload Letter
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Metrics Row */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg bg-slate-50">
              <div className="text-xl font-bold text-slate-900">{meetingsCount}</div>
              <div className="text-xs text-slate-600 mt-1">Meetings</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <div className="text-xl font-bold text-slate-900">{tasksCount}</div>
              <div className="text-xs text-slate-600 mt-1">Tasks</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <div className="text-xl font-bold text-slate-900">{documentsCount}</div>
              <div className="text-xs text-slate-600 mt-1">Documents</div>
            </div>
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="w-full h-8 text-xs" 
              onClick={(e) => {
                e.stopPropagation();
                handleScheduleMeeting();
              }}
            >
              <CalendarClock className="mr-1.5 h-3.5 w-3.5" />
              Schedule Meeting
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full h-8 text-xs" 
              onClick={(e) => {
                e.stopPropagation();
                handleOpenChat();
              }}
            >
              <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
              Chat
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full h-8 text-xs" 
              onClick={(e) => {
                e.stopPropagation();
                handleShareDocument();
              }}
            >
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              Share Document
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full h-8 text-xs" 
              onClick={(e) => {
                e.stopPropagation();
                handleManage();
              }}
            >
              <Settings className="mr-1.5 h-3.5 w-3.5" />
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* University Letter Upload Modal */}
      <UniversityLetterUploadModal
        isOpen={isUploadModalOpen}
        relationship={relationship}
        onClose={() => setIsUploadModalOpen(false)}
        onUploaded={() => {
          setIsUploadModalOpen(false);
          reload?.();
        }}
      />
    </>
  );
}

function InfoColumn({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 text-slate-400" />
      <div>
        <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
        <div className="text-sm text-slate-700">{value}</div>
      </div>
    </div>
  );
}

