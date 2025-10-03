import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { format, formatDistanceToNow, differenceInDays } from 'date-fns';
import { 
  User2, 
  Calendar, 
  XCircle, 
  FileText, 
  Clock,
  History
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import StudentRelationshipDetailModal from './StudentRelationshipDetailModal';

export default function TerminatedRelationshipsList({ relationships = [], reload, isLoading = false }) {
  const [selectedRelationship, setSelectedRelationship] = useState(null);

  const isEmpty = !isLoading && (!Array.isArray(relationships) || relationships.length === 0);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`terminated-skeleton-${index}`} className="border border-dashed rounded-xl p-5 bg-white shadow-sm animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-full bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-slate-200" />
                  <div className="h-3 w-24 rounded bg-slate-100" />
                </div>
              </div>
              <div className="h-6 w-24 rounded-full bg-slate-100" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-3 w-full rounded bg-slate-100" />
              <div className="h-3 w-3/4 rounded bg-slate-100" />
            </div>
            <div className="mt-4 h-10 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <Card className="border-dashed border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">No Terminated Relationships</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          You don't have any terminated supervision relationships. All past relationships will appear here.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {relationships.map((relationship) => (
          <TerminatedRelationshipCard
            key={relationship.id}
            relationship={relationship}
            onViewHistory={() => setSelectedRelationship(relationship)}
          />
        ))}
      </div>

      {/* Detail Modal for Read-Only View */}
      {selectedRelationship && (
        <StudentRelationshipDetailModal
          relationship={selectedRelationship}
          onClose={() => setSelectedRelationship(null)}
          onUpdated={reload}
          isReadOnly={true}
        />
      )}
    </>
  );
}

function TerminatedRelationshipCard({ relationship, onViewHistory }) {
  const supervisor = relationship?.academician ?? {};
  const fullName = supervisor.full_name ?? 'Supervisor';
  const avatarUrl = supervisor.profile_picture ? `/storage/${supervisor.profile_picture}` : null;
  const profileUrl = supervisor.url || null;
  
  const startDate = relationship?.accepted_at || relationship?.start_date;
  const endDate = relationship?.terminated_at;
  
  const formattedStartDate = startDate ? format(new Date(startDate), 'dd/MM/yyyy') : '—';
  const formattedEndDate = endDate ? format(new Date(endDate), 'dd/MM/yyyy') : '—';
  const terminatedAgo = endDate ? formatDistanceToNow(new Date(endDate), { addSuffix: true }) : null;
  
  // Calculate duration
  const duration = startDate && endDate 
    ? differenceInDays(new Date(endDate), new Date(startDate))
    : 0;
  
  const durationText = duration > 0 
    ? `${Math.floor(duration / 30)} months, ${duration % 30} days`
    : '—';

  // Get termination reason from the last unbind request
  const terminationReason = relationship?.unbind_requests?.length > 0
    ? relationship.unbind_requests[relationship.unbind_requests.length - 1]?.reason
    : 'No reason provided';

  const initials = fullName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);

  return (
    <div className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {profileUrl ? (
            <Link href={route('academicians.show', profileUrl)} className="flex-shrink-0">
              <Avatar className="h-10 w-10 border border-slate-200 hover:ring-2 hover:ring-slate-300 transition-all cursor-pointer">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" />
                ) : (
                  <AvatarFallback className="bg-slate-100 text-slate-600 text-sm">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
            </Link>
          ) : (
            <Avatar className="h-10 w-10 border border-slate-200">
              {avatarUrl ? (
                <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" />
              ) : (
                <AvatarFallback className="bg-slate-100 text-slate-600 text-sm">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
          )}
          <div className="min-w-0 flex-1">
            {profileUrl ? (
              <Link href={route('academicians.show', profileUrl)}>
                <h3 className="text-[1.05rem] font-semibold text-gray-900 leading-snug truncate hover:text-indigo-600 transition-colors cursor-pointer">
                  {fullName}
                </h3>
              </Link>
            ) : (
              <h3 className="text-[1.05rem] font-semibold text-gray-900 leading-snug truncate">{fullName}</h3>
            )}
            <p className="text-sm text-gray-600 truncate">
              {relationship.role === 'main' ? 'Main Supervisor' : 'Co-Supervisor'}
            </p>
            {terminatedAgo && <p className="text-xs text-slate-500 mt-0.5">Terminated {terminatedAgo}</p>}
          </div>
        </div>
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex-shrink-0">
          Terminated
        </Badge>
      </div>

      {/* Relationship Duration */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span>
            {formattedStartDate} → {formattedEndDate}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Clock className="h-4 w-4 text-slate-400" />
          <span>Duration: {durationText}</span>
        </div>
      </div>

      {/* Termination Reason */}
      {terminationReason && (
        <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
          <div className="flex items-start gap-2">
            <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-red-900 mb-1">Termination Reason:</p>
              <p className="text-xs text-red-800 line-clamp-2">{terminationReason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action */}
      <div className="mt-4 pt-4 border-t">
        <Button
          variant="outline"
          className="w-full"
          onClick={onViewHistory}
        >
          <History className="mr-2 h-4 w-4" />
          View History
        </Button>
      </div>
    </div>
  );
}

