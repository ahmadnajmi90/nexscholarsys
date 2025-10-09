import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { Loader2, UserCheck, UserX, Users, AlertCircle } from 'lucide-react';
import { logError } from '@/Utils/logError';

/**
 * RelationshipHistoryTab - Timeline for supervision relationship
 * Shared component used by both student and supervisor views
 * 
 * @param {Object} relationship - The supervision relationship
 */
export default function RelationshipHistoryTab({ relationship }) {
  const [loading, setLoading] = useState(true);
  const [unbindRequests, setUnbindRequests] = useState([]);
  const [coSupervisorEvents, setCoSupervisorEvents] = useState([]);

  useEffect(() => {
    if (relationship?.id) {
      loadActivityData();
    }
  }, [relationship?.id]);

  const loadActivityData = async () => {
    setLoading(true);
    try {
      // Fetch full relationship details including unbind requests
      const relResponse = await axios.get(`/api/v1/app/supervision/relationships/${relationship.id}`);
      const relData = relResponse.data.data;
      setUnbindRequests(relData.unbindRequests || []);

      // Fetch co-supervisor invitations for this relationship
      if (relationship.student_id) {
        try {
          const coSupResponse = await axios.get('/api/v1/app/supervision/cosupervisor-invitations/my-invitations');
          const allInvitations = [
            ...(coSupResponse.data.as_cosupervisor || []),
            ...(coSupResponse.data.to_approve || []),
            ...(coSupResponse.data.as_initiator || [])
          ];
          
          // Filter invitations related to this student
          const relevantInvitations = allInvitations.filter(inv => 
            inv.relationship?.student_id === relationship.student_id
          );
          setCoSupervisorEvents(relevantInvitations);
        } catch (error) {
          console.log('Could not load co-supervisor events', error);
          setCoSupervisorEvents([]);
        }
      }
    } catch (error) {
      logError(error, 'RelationshipHistoryTab loadActivityData');
    } finally {
      setLoading(false);
    }
  };

  const timeline = [
    {
      id: 'rel-start',
      title: 'Relationship Started',
      date: relationship?.accepted_at,
      status: 'completed',
      icon: UserCheck,
      color: 'green',
    },
  ];

  // Add unbind request events
  unbindRequests.forEach((request, idx) => {
    if (request.status === 'pending') {
      timeline.push({
        id: `unbind-${idx}`,
        title: 'Unbind Request Pending',
        description: `Initiated by ${request.initiated_by}`,
        date: request.created_at,
        status: 'pending',
        icon: AlertCircle,
        color: 'yellow',
      });
    } else if (request.status === 'approved') {
      timeline.push({
        id: `unbind-${idx}`,
        title: 'Unbind Request Approved',
        description: `Relationship terminated`,
        date: request.responded_at || request.updated_at,
        status: 'completed',
        icon: UserX,
        color: 'red',
      });
    } else if (request.status === 'rejected') {
      timeline.push({
        id: `unbind-${idx}`,
        title: 'Unbind Request Rejected',
        date: request.responded_at || request.updated_at,
        status: 'completed',
        icon: UserX,
        color: 'gray',
      });
    }
  });

  // Add co-supervisor invitation events
  coSupervisorEvents.forEach((invitation, idx) => {
    const cosupName = invitation.cosupervisor?.full_name || invitation.cosupervisor?.user?.name || 'Co-Supervisor';
    
    if (invitation.completed_at) {
      timeline.push({
        id: `cosup-${idx}`,
        title: `Co-Supervisor Added: ${cosupName}`,
        description: `Initiated by ${invitation.initiated_by === 'student' ? 'Student' : 'Main Supervisor'}`,
        date: invitation.completed_at,
        status: 'completed',
        icon: Users,
        color: 'blue',
      });
    } else if (invitation.cosupervisor_status === 'rejected' || invitation.approver_status === 'rejected') {
      timeline.push({
        id: `cosup-${idx}`,
        title: `Co-Supervisor Invitation Rejected`,
        description: cosupName,
        date: invitation.updated_at,
        status: 'completed',
        icon: UserX,
        color: 'gray',
      });
    } else if (invitation.cancelled_at) {
      timeline.push({
        id: `cosup-${idx}`,
        title: `Co-Supervisor Invitation Cancelled`,
        description: cosupName,
        date: invitation.cancelled_at,
        status: 'completed',
        icon: UserX,
        color: 'gray',
      });
    } else {
      timeline.push({
        id: `cosup-${idx}`,
        title: `Co-Supervisor Invitation Pending`,
        description: cosupName,
        date: invitation.created_at,
        status: 'pending',
        icon: Users,
        color: 'yellow',
      });
    }
  });

  // Add current status
  if (relationship?.status === 'active' && !relationship?.terminated_at) {
    timeline.push({
      id: 'rel-active',
      title: 'Active Supervision',
      date: relationship?.accepted_at,
      status: 'current',
      icon: UserCheck,
      color: 'blue',
    });
  }

  if (relationship?.terminated_at) {
    timeline.push({
      id: 'rel-terminated',
      title: 'Relationship Terminated',
      date: relationship.terminated_at,
      status: 'completed',
      icon: UserX,
      color: 'red',
    });
  }

  // Sort timeline by date (newest first)
  const sortedTimeline = timeline
    .filter(event => event.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const getStatusColor = (color) => {
    switch (color) {
      case 'green':
        return 'bg-green-500';
      case 'blue':
        return 'bg-blue-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'red':
        return 'bg-red-500';
      case 'gray':
        return 'bg-slate-400';
      default:
        return 'bg-slate-300';
    }
  };

  const getIconBgColor = (color) => {
    switch (color) {
      case 'green':
        return 'bg-green-100 text-green-600';
      case 'blue':
        return 'bg-blue-100 text-blue-600';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-600';
      case 'red':
        return 'bg-red-100 text-red-600';
      case 'gray':
        return 'bg-slate-100 text-slate-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Recent Activity ({sortedTimeline.length})</h3>

        {sortedTimeline.length === 0 ? (
          <div className="border border-slate-200 rounded-lg p-8 bg-slate-50 text-center">
            <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No activity recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedTimeline.map((event, index) => {
              const Icon = event.icon || UserCheck;
              return (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getIconBgColor(event.color)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {index < sortedTimeline.length - 1 && (
                      <div className="w-0.5 flex-1 bg-slate-200 mt-2" style={{ minHeight: '40px' }} />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <h4 className="font-medium text-slate-900">{event.title}</h4>
                    {event.description && (
                      <p className="text-sm text-slate-600 mt-1">{event.description}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      {format(new Date(event.date), 'dd MMM yyyy, HH:mm')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

