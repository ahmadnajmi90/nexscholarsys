import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Badge } from '@/Components/ui/badge';
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';
import { Calendar, CalendarClock, Video, MapPin, Loader2 } from 'lucide-react';
import axios from 'axios';
import { logError } from '@/Utils/logError';

export default function UpcomingMeetingsPanel({ userRole, triggerReload = 0 }) {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMeetings = async () => {
    try {
      const response = await axios.get(route('supervision.activity.upcoming-meetings'));
      setMeetings(response.data.data || []);
    } catch (error) {
      logError(error, 'UpcomingMeetingsPanel loadMeetings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, [triggerReload]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-slate-700" />
          <CardTitle className="text-base font-semibold text-slate-900">
            Upcoming Meetings
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          </div>
        ) : meetings.length === 0 ? (
          <div className="py-8 text-center">
            <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No upcoming meetings</p>
            <p className="text-xs text-slate-400 mt-1">
              Schedule your first meeting to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {meetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MeetingCard({ meeting }) {
  const otherPerson = meeting.other_person?.name || 'Unknown';
  const profilePicture = meeting.other_person?.profile_picture;
  const scheduledDate = new Date(meeting.scheduled_for);
  
  const initials = otherPerson
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Determine date label
  const getDateLabel = () => {
    if (isToday(scheduledDate)) {
      return `Today ${format(scheduledDate, 'h:mm a')}`;
    }
    if (isTomorrow(scheduledDate)) {
      return `Tomorrow ${format(scheduledDate, 'h:mm a')}`;
    }
    if (isThisWeek(scheduledDate)) {
      return format(scheduledDate, 'EEEE h:mm a');
    }
    return format(scheduledDate, 'MMM d, h:mm a');
  };

  const dateLabel = getDateLabel();
  const hasJoinLink = Boolean(meeting.location_link);

  const handleClick = () => {
    if (hasJoinLink) {
      window.open(meeting.location_link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className={`p-3 bg-slate-50 rounded-lg transition-all ${
        hasJoinLink ? 'hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer' : ''
      } border border-transparent`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-9 w-9">
          {profilePicture ? (
            <img 
              src={`/storage/${profilePicture}`} 
              alt={otherPerson} 
              className="h-full w-full object-cover" 
            />
          ) : (
            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-900 text-sm truncate">
            {otherPerson}
          </div>
          <div className={`text-sm mt-0.5 ${isToday(scheduledDate) || isTomorrow(scheduledDate) ? 'text-indigo-600 font-medium' : 'text-slate-600'}`}>
            {dateLabel}
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            {meeting.location_type === 'Online' || hasJoinLink ? (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Video className="h-3 w-3" />
                <span>Online</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="h-3 w-3" />
                <span>Physical</span>
              </div>
            )}
            {(isToday(scheduledDate) || isTomorrow(scheduledDate)) && (
              <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                Soon
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

