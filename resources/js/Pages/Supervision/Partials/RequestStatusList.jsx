import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { format, formatDistanceToNow } from 'date-fns';
import { logError } from '@/Utils/logError';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Separator } from '@/Components/ui/separator';
import RequestDetailCard from './RequestDetailCard';
import {
  Clock3,
  FileText,
  MessageCircle,
  XCircle,
  CheckCircle2,
  Loader2
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

  const handleCancel = async (request) => {
    if (!request?.id) return;
    setCancellingId(request.id);
    try {
      await axios.post(route('supervision.requests.cancel', request.id));
      toast.success('Proposal withdrawn');
      reload?.();
    } catch (error) {
      logError(error, 'RequestStatusList handleCancel');
      const message = error?.response?.data?.message || 'Unable to cancel your request right now';
      toast.error(message);
    } finally {
      setCancellingId(null);
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
      <div className="grid gap-4 sm:grid-cols-2">
        {sortedRequests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            onCancel={handleCancel}
            onOpenDetail={(req) => setSelectedRequest(req)}
            isCancelling={cancellingId === request.id}
          />
        ))}
      </div>

      {/* Request Detail Card Modal */}
      {selectedRequest && (
        <RequestDetailCard
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdated={reload}
        />
      )}
    </>
  );
}

function RequestCard({ request, onCancel, onOpenDetail, isCancelling }) {
  const academician = request?.academician ?? {};
  const fullName = academician.full_name ?? 'Supervisor';
  const avatarUrl = academician.profile_picture ? `/storage/${academician.profile_picture}` : null;
  const statusVariant = STATUS_BADGE_VARIANTS[request?.status] ?? STATUS_BADGE_VARIANTS.pending;
  const statusCopy = STATUS_COPY[request?.status] ?? 'Pending supervisor response';
  const submittedAt = request?.submitted_at ? format(new Date(request.submitted_at), 'dd/MM/yyyy') : '—';
  const submittedAgo = request?.submitted_at
    ? formatDistanceToNow(new Date(request.submitted_at), { addSuffix: true })
    : null;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onOpenDetail(request)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10">
              {avatarUrl ? (
                <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" />
              ) : (
                <AvatarFallback className="bg-indigo-50 text-indigo-600">
                  {fullName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-slate-800">{fullName}</div>
              {submittedAgo && <div className="text-xs text-slate-500">Submitted {submittedAgo}</div>}
            </div>
          </div>
          <Badge className={statusVariant.className}>
            {(request?.status ?? 'pending').split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Badge>
        </div>
        <div className="mt-3">
          <CardTitle className="text-base font-semibold text-slate-900 line-clamp-2">{request?.proposal_title ?? 'Supervision request'}</CardTitle>
        </div>
        <div className="mt-2">
          <span className="text-xs text-slate-500">{statusCopy}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-slate-600">
        <Separator />
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoRow icon={Clock3} label="Submitted on" value={submittedAt} />
          <InfoRow icon={FileText} label="Motivation" value={truncate(request?.motivation, 100)} />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 text-xs text-slate-500">
          <Badge variant="outline" className="border-slate-200 text-slate-500">
            <MessageCircle className="mr-1 h-3.5 w-3.5" />
            Conversation ready
          </Badge>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="sm:w-32"
            disabled={request?.status !== 'pending' || isCancelling}
            onClick={(e) => {
              e.stopPropagation();
              onCancel?.(request);
            }}
          >
            {isCancelling ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="mr-2 h-4 w-4" />
            )}
            Cancel
          </Button>
          <Button className="sm:w-36" onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(request);
          }}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            View details
          </Button>
        </div>
      </CardFooter>
    </Card>
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

