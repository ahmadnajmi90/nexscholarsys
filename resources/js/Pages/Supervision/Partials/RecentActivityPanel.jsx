import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { 
  Clock, 
  MessageCircle, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  UserPlus, 
  Lightbulb,
  FileText,
  Loader2,
  UserMinus,
  AlertCircle,
  Users,
  CalendarX,
  CalendarClock
} from 'lucide-react';
import axios from 'axios';
import { logError } from '@/Utils/logError';

const ACTIVITY_ICONS = {
  request_rejected: XCircle,
  request_accepted: CheckCircle,
  meeting_scheduled: Calendar,
  meeting_rescheduled: CalendarClock,
  meeting_cancelled: CalendarX,
  request_submitted: UserPlus,
  offer_accepted: CheckCircle,
  message_received: MessageCircle,
  document_uploaded: FileText,
  recommendations_available: Lightbulb,
  unbind_approved: UserMinus,
  unbind_pending: AlertCircle,
  cosupervisor_added: Users,
  cosupervisor_pending_approval: AlertCircle,
  cosupervisor_invited: UserPlus,
  cosupervisor_invitation_received: Users,
};

const ACTIVITY_COLORS = {
  request_rejected: 'text-red-500',
  request_accepted: 'text-green-500',
  meeting_scheduled: 'text-blue-500',
  meeting_rescheduled: 'text-amber-500',
  meeting_cancelled: 'text-red-500',
  request_submitted: 'text-indigo-500',
  offer_accepted: 'text-green-500',
  message_received: 'text-purple-500',
  document_uploaded: 'text-amber-500',
  recommendations_available: 'text-indigo-500',
  unbind_approved: 'text-red-600',
  unbind_pending: 'text-orange-500',
  cosupervisor_added: 'text-emerald-500',
  cosupervisor_pending_approval: 'text-yellow-500',
  cosupervisor_invited: 'text-indigo-500',
  cosupervisor_invitation_received: 'text-purple-500',
};

export default function RecentActivityPanel({ userRole, triggerReload = 0 }) {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const loadActivities = async () => {
    try {
      const response = await axios.get(route('supervision.activity.recent'));
      setActivities(response.data.data || []);
    } catch (error) {
      logError(error, 'RecentActivityPanel loadActivities');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [triggerReload]);

  // Show 3 by default, 8 when expanded
  const displayedActivities = isExpanded ? activities.slice(0, 8) : activities.slice(0, 3);
  const hasMore = activities.length > 3;
  const hasHidden = activities.length > 8;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-slate-900">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          </div>
        ) : activities.length === 0 ? (
          <div className="py-8 text-center">
            <Clock className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No recent activity</p>
            <p className="text-xs text-slate-400 mt-1">
              Your supervision updates will appear here
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-0 divide-y divide-slate-100">
              {displayedActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
            
            {hasMore && (
              <div className="pt-3 mt-3 border-t border-slate-100">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  {isExpanded ? 'Show Less' : `View More (${Math.min(activities.length - 3, 5)} more)`}
                </button>
                {isExpanded && hasHidden && (
                  <p className="text-xs text-slate-400 text-center mt-1">
                    Showing latest 8 activities
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function ActivityItem({ activity }) {
  const Icon = ACTIVITY_ICONS[activity.type] || Clock;
  const iconColor = ACTIVITY_COLORS[activity.type] || 'text-slate-500';
  const timeAgo = activity.created_at 
    ? formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })
    : '';

  return (
    <div className="flex items-start gap-3 py-3 group cursor-pointer hover:bg-slate-50 -mx-3 px-3 rounded-md transition-colors">
      <div className="flex-shrink-0 mt-0.5">
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-900 leading-relaxed">
          {activity.description}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{timeAgo}</p>
      </div>
    </div>
  );
}

