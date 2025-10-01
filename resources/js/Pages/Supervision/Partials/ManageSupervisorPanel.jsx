import React, { useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Separator } from '@/Components/ui/separator';
import {
  CalendarClock,
  MessageCircle,
  GaugeCircle,
  ExternalLink,
  User2
} from 'lucide-react';
import { logError } from '@/Utils/logError';

export default function ManageSupervisorPanel({ relationships = [], reload, onOpenDetail, onOpenMeetings }) {
  const activeRelationships = useMemo(
    () => (Array.isArray(relationships) ? relationships.filter(rel => rel.status === 'active') : []),
    [relationships]
  );

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
    <div className="space-y-4">
      {activeRelationships.map((relationship) => (
        <ActiveRelationshipCard
          key={relationship.id}
          relationship={relationship}
          onOpenDetail={onOpenDetail}
          onOpenMeetings={onOpenMeetings}
          reload={reload}
        />
      ))}
    </div>
  );
}

function ActiveRelationshipCard({ relationship, onOpenDetail, onOpenMeetings }) {
  const academician = relationship?.academician ?? {};
  const profilePicture = academician.profile_picture ? `/storage/${academician.profile_picture}` : null;
  const fullName = academician.full_name ?? 'Supervisor';
  const role = relationship?.role === 'main' ? 'Main Supervisor' : 'Co-supervisor';
  const cadence = relationship?.meeting_cadence ?? 'No meeting cadence set';
  const scholarLabBoard = relationship?.scholarlab_board_id;

  return (
    <Card className="shadow-sm lg:grid lg:grid-cols-[2fr_1fr] lg:gap-6">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14">
              {profilePicture ? (
                <img src={profilePicture} alt={fullName} className="h-full w-full object-cover" />
              ) : (
                <AvatarFallback className="bg-indigo-50 text-indigo-600">
                  <User2 className="h-5 w-5" />
                </AvatarFallback>
              )}
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold text-slate-900">{fullName}</CardTitle>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <Badge variant="outline" className="border-indigo-200 text-indigo-600">{role}</Badge>
                {relationship?.accepted_at && (
                  <Badge variant="outline" className="border-slate-200 text-slate-600">
                    Accepted {new Date(relationship.accepted_at).toLocaleDateString()}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenDetail?.({ ...relationship, preferred_tab: 'overview' })}>
              <GaugeCircle className="mr-2 h-4 w-4" />
              View overview
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-slate-600">
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoColumn icon={MessageCircle} label="Conversation" value="Open the messaging tab to continue your discussions." />
          <InfoColumn icon={CalendarClock} label="Meeting cadence" value={cadence} />
        </div>
        {scholarLabBoard && (
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div>
              <div className="font-medium text-slate-800">ScholarLab workspace</div>
              <p className="text-xs text-slate-500">A collaborative board was created for this supervision. Use it to track milestones and meetings.</p>
            </div>
            <Button variant="link" className="text-indigo-600" onClick={() => onOpenDetail?.({ ...relationship, preferred_tab: 'scholarlab' })}>
              Open board
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={() => onOpenDetail?.({ ...relationship, preferred_tab: 'chat' })}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Open chat
        </Button>
        <Button onClick={() => onOpenMeetings?.({ ...relationship, preferred_tab: 'meetings' })}>
          <CalendarClock className="mr-2 h-4 w-4" />
          View meetings
        </Button>
      </CardFooter>
      <Separator className="hidden lg:block" orientation="vertical" />
    </Card>
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

