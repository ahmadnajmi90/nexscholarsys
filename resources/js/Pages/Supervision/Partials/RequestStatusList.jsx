import React, { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { format, formatDistanceToNow } from 'date-fns';
import { logError } from '@/Utils/logError';
import { getRejectionReasonLabel } from '@/Utils/supervisionConstants';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { User2 } from 'lucide-react';
import { Separator } from '@/Components/ui/separator';
import UnifiedRequestDetailCard from './UnifiedRequestDetailCard';
import ConfirmationModal from '@/Components/ConfirmationModal';
import {
  Clock3,
  FileText,
  MessageCircle,
  XCircle,
  CheckCircle2,
  Loader2,
  Lightbulb
} from 'lucide-react';

const STATUS_BADGE_VARIANTS = {
  pending: { variant: 'secondary', className: 'bg-amber-50 text-amber-700 border-none' },
  accepted: { variant: 'success', className: 'bg-emerald-50 text-emerald-700 border-none' },
  rejected: { variant: 'destructive', className: 'bg-rose-50 text-rose-700 border-none' },
  auto_cancelled: { variant: 'outline', className: 'bg-slate-100 text-slate-600 border-none' },
  cancelled: { variant: 'outline', className: 'bg-slate-100 text-slate-600 border-none' }
};

const STATUS_COPY = {
  pending: 'Awaiting supervisor review',
  accepted: 'Accepted — next steps available',
  rejected: 'Rejected — see feedback in details',
  auto_cancelled: 'Automatically cancelled after another acceptance',
  cancelled: 'Cancelled by student'
};

export default function RequestStatusList({ requests = [], reload, onOpenDetail }) {
  const [cancellingId, setCancellingId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState(null);

  const handleCancelClick = (request) => {
    setRequestToCancel(request);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!requestToCancel?.id) return;
    setCancellingId(requestToCancel.id);
    setShowCancelModal(false);
    try {
      await axios.post(route('supervision.requests.cancel', requestToCancel.id));
      toast.success('Proposal withdrawn');
      reload?.();
    } catch (error) {
      logError(error, 'RequestStatusList handleCancel');
      const message = error?.response?.data?.message || 'Unable to cancel your request right now';
      toast.error(message);
    } finally {
      setCancellingId(null);
      setRequestToCancel(null);
    }
  };

  const isEmpty = !Array.isArray(requests) || requests.length === 0;

  // Sort requests: cancelled/auto_cancelled at the bottom
  const sortedRequests = useMemo(() => {
    if (!Array.isArray(requests)) return [];
    return [...requests].sort((a, b) => {
      const aCancelled = ['cancelled', 'auto_cancelled'].includes(a.status);
      const bCancelled = ['cancelled', 'auto_cancelled'].includes(b.status);
      if (aCancelled && !bCancelled) return 1;
      if (!aCancelled && bCancelled) return -1;
      return 0;
    });
  }, [requests]);

  if (isEmpty) {
    return (
      <Card className="border-dashed border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">You haven\'t sent any proposals yet</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Move supervisors from your shortlist into active proposals. Once you submit a request, progress and messaging will appear here.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {sortedRequests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            onCancel={handleCancelClick}
            onOpenDetail={(req) => setSelectedRequest(req)}
            isCancelling={cancellingId === request.id}
          />
        ))}
      </div>

      {/* Request Detail Card Modal */}
      {selectedRequest && (
        <UnifiedRequestDetailCard
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdated={reload}
          userRole="student"
        />
      )}

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        show={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setRequestToCancel(null);
        }}
        onConfirm={handleConfirmCancel}
        title="Cancel Supervision Request"
        message={`Are you sure you want to withdraw your supervision request${requestToCancel?.academician?.full_name ? ` to ${requestToCancel.academician.full_name}` : ''}? This action cannot be undone.`}
        confirmButtonText="Yes, Cancel Request"
      />
    </>
  );
}

function RequestCard({ request, onCancel, onOpenDetail, isCancelling }) {
  const academician = request?.academician ?? {};
  const university = academician.university?.name ?? null;
  const fullName = academician.full_name ?? 'Supervisor';
  const avatarUrl = academician.profile_picture ? `/storage/${academician.profile_picture}` : null;
  const profileUrl = academician.url || null;
  const statusVariant = STATUS_BADGE_VARIANTS[request?.status] ?? STATUS_BADGE_VARIANTS.pending;
  const statusCopy = STATUS_COPY[request?.status] ?? 'Pending supervisor response';
  const submittedAt = request?.submitted_at ? format(new Date(request.submitted_at), 'dd/MM/yyyy') : '—';
  const submittedAgo = request?.submitted_at
    ? formatDistanceToNow(new Date(request.submitted_at), { addSuffix: true })
    : null;

  return (
    <div 
      className="border rounded-xl p-4 sm:p-5 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer min-h-[300px] sm:min-h-[320px] flex flex-col"
      onClick={() => onOpenDetail(request)}
    >
      {/* Card Content - Grows to fill space */}
      <div className="flex-1">
        {/* Header: Supervisor Info + Status Badge */}
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {profileUrl ? (
              <Link 
                href={route('academicians.show', profileUrl)} 
                className="flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-indigo-300 transition-all cursor-pointer">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <User2 className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
              </Link>
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <User2 className="w-5 h-5 text-indigo-600" />
                )}
              </div>
            )}
            <div className="min-w-0 flex-1">
              {profileUrl ? (
                <Link 
                  href={route('academicians.show', profileUrl)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-sm sm:text-[1.05rem] font-semibold text-gray-900 leading-snug truncate hover:text-indigo-600 transition-colors cursor-pointer">{fullName}</h3>
                </Link>
              ) : (
                <h3 className="text-sm sm:text-[1.05rem] font-semibold text-gray-900 leading-snug truncate">{fullName}</h3>
              )}
              {university && <p className="text-xs sm:text-sm text-gray-600 truncate font-normal">{university}</p>}
              {submittedAgo && <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{submittedAgo}</p>}
            </div>
          </div>
          <Badge className={`${statusVariant.className} flex-shrink-0 text-[10px] sm:text-xs`}>
            {(request?.status ?? 'pending').split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Badge>
        </div>

        {/* Proposal Title - More Prominent */}
        <div className="mt-3 sm:mt-4">
          <h4 className="text-sm sm:text-base font-semibold text-slate-900 line-clamp-2 leading-snug">{request?.proposal_title ?? 'Supervision request'}</h4>
        </div>

        {/* Status-specific Information Section - Always present for consistent height */}
        <div className="mt-2 min-h-[60px] sm:min-h-[72px] space-y-2">
          {/* REJECTED Status */}
          {request?.status === 'rejected' && (
            <>
              {request?.cancel_reason && (
                <div className="p-2 rounded-md bg-red-50 border border-red-100">
                  <div className="text-xs text-red-900">
                    <span className="font-semibold">Reason:</span> {getRejectionReasonLabel(request.cancel_reason)}
                  </div>
                </div>
              )}
              {request?.recommended_supervisors && request.recommended_supervisors.length > 0 && (
                <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                  <Lightbulb className="h-3 w-3 mr-1" />
                  {request.recommended_supervisors.length} supervisor(s) recommended
                </Badge>
              )}
            </>
          )}

          {/* PENDING Status - Two elements for balance */}
          {request?.status === 'pending' && (
            <>
              <div className="p-2 rounded-md bg-amber-50 border border-amber-100">
                <div className="text-xs text-amber-900 flex items-center gap-1.5">
                  <Clock3 className="w-3.5 h-3.5" />
                  <span>{statusCopy}</span>
                </div>
              </div>
              <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                <MessageCircle className="h-3 w-3 mr-1" />
                You can message the supervisor while waiting
              </Badge>
            </>
          )}

          {/* PENDING STUDENT ACCEPTANCE - Two elements for balance */}
          {request?.status === 'pending_student_acceptance' && (
            <>
              <div className="p-2 rounded-md bg-blue-50 border border-blue-100">
                <div className="text-xs text-blue-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="font-medium">Offer received! Review and respond to this supervisor&apos;s offer.</span>
                </div>
              </div>
              <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                <Clock3 className="h-3 w-3 mr-1" />
                Action required - respond to offer
              </Badge>
            </>
          )}

          {/* ACCEPTED Status - Two elements for balance */}
          {request?.status === 'accepted' && (
            <>
              <div className="p-2 rounded-md bg-green-50 border border-green-100">
                <div className="text-xs text-green-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{statusCopy}</span>
                </div>
              </div>
              <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200">
                <FileText className="h-3 w-3 mr-1" />
                View full supervision details
              </Badge>
            </>
          )}

          {/* CANCELLED Status - Two elements for balance */}
          {request?.status === 'cancelled' && (
            <>
              <div className="p-2 rounded-md bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-600 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{statusCopy}</span>
                </div>
              </div>
              <Badge className="bg-slate-100 text-slate-600 border-slate-200">
                You can submit a new request to this supervisor
              </Badge>
            </>
          )}

          {/* AUTO-CANCELLED Status - Two elements for balance */}
          {request?.status === 'auto_cancelled' && (
            <>
              <div className="p-2 rounded-md bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-600 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{statusCopy}</span>
                </div>
              </div>
              <Badge className="bg-slate-100 text-slate-600 border-slate-200">
                Cancelled when you accepted another supervisor
              </Badge>
            </>
          )}
        </div>

        {/* Quick Info Bar - Clean Inline Display */}
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock3 className="w-3.5 h-3.5" />
            <span>{submittedAt}</span>
          </div>
          {request?.attachments && request.attachments.length > 0 && (
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>{request.attachments.length} file{request.attachments.length !== 1 ? 's' : ''}</span>
            </div>
          )}
          {request?.conversation_id && (
            <div className="flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Conversation active</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions - Always at bottom */}
      <div className="mt-3 sm:mt-4 flex items-center gap-2 pt-3 sm:pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs sm:text-sm"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(request);
          }}
        >
          <CheckCircle2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          View Details
        </Button>
        {request?.status === 'pending' && (
          <Button
            variant="outline"
            size="sm"
            disabled={isCancelling}
            onClick={(e) => {
              e.stopPropagation();
              onCancel?.(request);
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            {isCancelling ? (
              <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
            ) : (
              <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 text-slate-400" />
      <div>
        <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
        <div className="text-sm text-slate-700">{value || '—'}</div>
      </div>
    </div>
  );
}

function truncate(text, limit) {
  if (!text || text.length <= limit) return text;
  return `${text.slice(0, limit)}…`;
}

