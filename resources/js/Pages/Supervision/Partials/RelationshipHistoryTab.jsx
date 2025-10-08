import React from 'react';
import { format } from 'date-fns';

/**
 * RelationshipHistoryTab - Timeline for supervision relationship
 * Shared component used by both student and supervisor views
 * 
 * @param {Object} relationship - The supervision relationship
 */
export default function RelationshipHistoryTab({ relationship }) {
  const timeline = [
    {
      id: 1,
      title: 'Relationship Started',
      date: relationship?.accepted_at,
      status: 'completed',
    },
    {
      id: 2,
      title: 'Active Supervision',
      date: relationship?.accepted_at,
      status: relationship?.status === 'active' ? 'current' : 'completed',
    },
  ];

  if (relationship?.terminated_at) {
    timeline.push({
      id: 3,
      title: 'Relationship Terminated',
      date: relationship.terminated_at,
      status: 'completed',
    });
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'current':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-slate-300';
      default:
        return 'bg-slate-300';
    }
  };

  return (
    <div className="p-6">
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Timeline</h3>

        <div className="space-y-4">
          {timeline.map((event, index) => (
            <div key={event.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(event.status)}`} />
                {index < timeline.length - 1 && (
                  <div className="w-0.5 h-full bg-slate-200 mt-2" />
                )}
              </div>
              <div className="flex-1 pb-8">
                <h4 className="font-medium text-slate-900">{event.title}</h4>
                <p className="text-sm text-slate-500">
                  {event.date ? format(new Date(event.date), 'dd/MM/yyyy') : 'TBD'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

