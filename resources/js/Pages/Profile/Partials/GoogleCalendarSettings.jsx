import React, { useState } from 'react';
import { useGoogleCalendar } from '@/Hooks/useGoogleCalendar';
import { Calendar, Check, RefreshCw, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Switch } from '@/Components/ui/switch';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/Components/ui/collapsible';
import { format } from 'date-fns';

export default function GoogleCalendarSettings({ className = '' }) {
  const { 
    isConnected, 
    isEnabled, 
    isLoading, 
    tokenExpiresAt,
    connect, 
    disconnect, 
    syncFromGoogle 
  } = useGoogleCalendar();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleToggle = async (checked) => {
    if (checked && !isConnected) {
      await connect();
    } else if (!checked && isConnected) {
      if (confirm('Are you sure you want to disconnect Google Calendar?')) {
        await disconnect();
      }
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncFromGoogle();
    } finally {
      setIsSyncing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPp');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Toggle Section */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-medium text-gray-900">
                Google Calendar Sync
              </h3>
              {isConnected && (
                <Badge variant="success" className="text-xs">
                  <Check className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Automatically sync your supervision meetings to Google Calendar
            </p>
          </div>
        </div>
        
        <Switch
          checked={isConnected}
          onCheckedChange={handleToggle}
          disabled={isLoading}
          className="flex-shrink-0 ml-4"
        />
      </div>

      {/* Expandable Details */}
      {isConnected && (
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide details
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show details
              </>
            )}
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-4 space-y-4">
            {/* Connection Details */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status</span>
                <span className="font-medium text-gray-900">Active</span>
              </div>
              {tokenExpiresAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Token Expires</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(tokenExpiresAt)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sync Enabled</span>
                <span className="font-medium text-gray-900">
                  {isEnabled ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={isSyncing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm('Are you sure you want to disconnect Google Calendar?')) {
                    disconnect();
                  }
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Disconnect
              </Button>
            </div>

            {/* Info Note */}
            <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-md">
              <p>
                <strong>Note:</strong> When you schedule a meeting through the supervision system, 
                you'll be prompted to add it to your Google Calendar automatically.
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Connect Prompt */}
      {!isConnected && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900">
                Connect Google Calendar
              </h4>
              <p className="mt-1 text-sm text-blue-700">
                Meetings will be automatically added to your calendar when scheduled. 
                Sync your supervision meetings seamlessly across all your devices.
              </p>
              <Button
                variant="link"
                size="sm"
                onClick={connect}
                className="mt-2 text-blue-600 hover:text-blue-700 p-0 h-auto font-medium flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" />
                Connect Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

