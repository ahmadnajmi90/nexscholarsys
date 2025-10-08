import React from 'react';
import { motion } from 'framer-motion';
import Modal from '@/Components/Modal';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { PartyPopper, XCircle, ArrowRight, CheckCircle, X, AlertCircle, Lightbulb } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { logError } from '@/Utils/logError';
import { getRejectionReasonLabel } from '@/Utils/supervisionConstants';
import { SCALE_ANIMATION, ICON_BOUNCE_ANIMATION, SLIDE_IN_LEFT_ANIMATION } from '@/Utils/modalAnimations';

/**
 * Unified Notification Modal
 * Handles three types of notifications:
 * 1. 'rejection' - Student rejection notifications
 * 2. 'offer' - Student offer notifications  
 * 3. 'response' - Supervisor response notifications (acceptances + rejections)
 */
export default function UnifiedNotificationModal({ 
  type, // 'rejection' | 'offer' | 'response'
  data, // For 'response' type: { acceptances: [], rejections: [] }, otherwise: array of items
  isOpen, 
  onClose, 
  onNavigate 
}) {
  // Normalize data structure
  const items = type === 'response' 
    ? [...(data?.acceptances || []), ...(data?.rejections || [])]
    : (data || []);
  
  const acceptances = type === 'response' ? (data?.acceptances || []) : [];
  const rejections = type === 'response' ? (data?.rejections || []) : [];

  // Configuration based on type
  const config = getConfig(type, items, acceptances, rejections);

  // Handle acknowledgment
  const handleAcknowledge = async () => {
    try {
      const requestIds = items.map(item => item.id);
      
      if (requestIds.length === 0) {
        onClose?.();
        return;
      }

      await axios.post(config.acknowledgeRoute, {
        request_ids: requestIds,
      });

      onNavigate?.();
      onClose?.();
    } catch (error) {
      logError(error, `UnifiedNotificationModal ${type} acknowledge`);
      toast.error(config.errorMessage);
    }
  };

  // Handle close without navigation
  const handleClose = async () => {
    try {
      const requestIds = items.map(item => item.id);
      
      if (requestIds.length > 0) {
        await axios.post(config.acknowledgeRoute, {
          request_ids: requestIds,
        });
      }
      
      onClose?.();
    } catch (error) {
      logError(error, `UnifiedNotificationModal ${type} close`);
    }
  };

  if (!isOpen || items.length === 0) return null;

  return (
    <Modal show={isOpen} onClose={onClose} maxWidth="xl" closeable={false}>
      <motion.div {...SCALE_ANIMATION} className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            {...(config.animateIcon ? ICON_BOUNCE_ANIMATION : {})}
            className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${config.iconBgColor} mb-4`}
          >
            <config.Icon className={`h-10 w-10 ${config.iconColor}`} />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {config.title}
          </h2>
          <p className="text-sm text-slate-600">
            {config.description}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
          {type === 'response' ? (
            // Special handling for response type (split into acceptances and rejections)
            <>
              {acceptances.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Accepted Offers ({acceptances.length})
                  </h3>
                  <div className="space-y-2">
                    {acceptances.map((item, index) => (
                      <NotificationItem 
                        key={item.id}
                        item={item}
                        type="acceptance"
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              )}

              {rejections.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <X className="h-4 w-4" />
                    Declined Offers ({rejections.length})
                  </h3>
                  <div className="space-y-2">
                    {rejections.map((item, index) => (
                      <NotificationItem 
                        key={item.id}
                        item={item}
                        type="declined"
                        index={acceptances.length + index}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            // Standard list for rejection and offer types
            <div className="space-y-3">
              {items.map((item, index) => (
                <NotificationItem 
                  key={item.id}
                  item={item}
                  type={type}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info Alert */}
        {config.showAlert && config.alertContent}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            {config.closeButtonLabel}
          </Button>
          <Button
            onClick={handleAcknowledge}
            className={`flex-1 ${config.primaryButtonClass}`}
          >
            {config.primaryButtonLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
}

/**
 * Individual notification item component
 */
function NotificationItem({ item, type, index }) {
  const itemConfig = getItemConfig(type, item);

  return (
    <motion.div
      {...SLIDE_IN_LEFT_ANIMATION(index * 0.1)}
      className={`p-4 rounded-lg border ${itemConfig.borderColor} ${itemConfig.bgColor}`}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          {itemConfig.person?.profile_picture ? (
            <img 
              src={`/storage/${itemConfig.person.profile_picture}`} 
              alt={itemConfig.person.full_name} 
              className="h-full w-full object-cover" 
            />
          ) : (
            <AvatarFallback className={`${itemConfig.avatarBgColor} ${itemConfig.avatarTextColor} text-xs`}>
              {itemConfig.person?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || itemConfig.fallbackInitials}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1 min-w-0">
          {itemConfig.content}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Get configuration based on notification type
 */
function getConfig(type, items, acceptances, rejections) {
  const count = items.length;
  
  switch (type) {
    case 'rejection': {
      const hasRecommendations = items.some(r => r.recommended_supervisors && r.recommended_supervisors.length > 0);
      
      return {
        Icon: XCircle,
        iconColor: 'text-red-600',
        iconBgColor: 'bg-red-100',
        animateIcon: false,
        title: 'Supervision Request Update',
        description: count === 1 
          ? 'Your supervision request was not accepted' 
          : `${count} supervision requests were not accepted`,
        acknowledgeRoute: route('supervision.acknowledge.rejections'),
        errorMessage: 'Failed to acknowledge rejections',
        closeButtonLabel: 'Close',
        primaryButtonLabel: hasRecommendations ? 'View Recommendations' : 'View Status',
        primaryButtonClass: 'bg-indigo-600 hover:bg-indigo-700',
        showAlert: hasRecommendations,
        alertContent: hasRecommendations ? (
          <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-indigo-900">
                <p className="font-semibold mb-1">Alternative Supervisors Available</p>
                <p>Some supervisors have kindly recommended colleagues who might be a better fit for your research. View their suggestions in the Proposal Status tab.</p>
              </div>
            </div>
          </div>
        ) : null,
      };
    }
    
    case 'offer': {
      return {
        Icon: PartyPopper,
        iconColor: 'text-green-600',
        iconBgColor: 'bg-green-100',
        animateIcon: true,
        title: '🎉 Great News!',
        description: count === 1 
          ? 'You have received a supervision offer' 
          : `You have received ${count} supervision offers`,
        acknowledgeRoute: route('supervision.acknowledge.offers'),
        errorMessage: 'Failed to acknowledge offers',
        closeButtonLabel: 'I\'ll Review Later',
        primaryButtonLabel: 'View Offers & Make Decision',
        primaryButtonClass: 'bg-green-600 hover:bg-green-700',
        showAlert: count > 1,
        alertContent: count > 1 ? (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-900">
                <p className="font-semibold mb-1">Important Notice</p>
                <p>You have multiple offers. Accepting one will automatically cancel your other pending requests. Review each offer carefully before making your decision.</p>
              </div>
            </div>
          </div>
        ) : null,
      };
    }
    
    case 'response': {
      return {
        Icon: acceptances.length > 0 ? PartyPopper : XCircle,
        iconColor: acceptances.length > 0 ? 'text-green-600' : 'text-slate-600',
        iconBgColor: acceptances.length > 0 ? 'bg-green-100' : 'bg-slate-100',
        animateIcon: true,
        title: 'Student Response Updates',
        description: count === 1 
          ? 'You have 1 student response to your supervision offer' 
          : `You have ${count} student responses to your supervision offers`,
        acknowledgeRoute: route('supervision.acknowledge.student-responses'),
        errorMessage: 'Failed to acknowledge notifications',
        closeButtonLabel: 'I\'ll Review Later',
        primaryButtonLabel: acceptances.length > 0 ? 'View My Students' : 'View Updates',
        primaryButtonClass: acceptances.length > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-700 hover:bg-slate-800',
        showAlert: acceptances.length > 0,
        alertContent: acceptances.length > 0 ? (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-900">
                <p className="font-semibold mb-1">Supervision Relationships Active</p>
                <p>Your new supervision relationships are now active. You can manage students, schedule meetings, and collaborate via ScholarLab.</p>
              </div>
            </div>
          </div>
        ) : null,
      };
    }
    
    default:
      return {};
  }
}

/**
 * Get item-specific configuration
 */
function getItemConfig(type, item) {
  switch (type) {
    case 'rejection':
      return {
        person: item.academician,
        fallbackInitials: 'SV',
        borderColor: 'border-red-200',
        bgColor: 'bg-red-50',
        avatarBgColor: 'bg-red-100',
        avatarTextColor: 'text-red-700',
        content: (
          <>
            <div className="font-semibold text-slate-900 mb-1">
              {item.academician?.full_name || 'Supervisor'}
            </div>
            <div className="text-sm text-slate-700 mb-2">
              Proposal: <span className="font-medium">{item.proposal_title}</span>
            </div>
            {item.cancel_reason && (
              <div className="text-xs text-slate-600 mb-2">
                <span className="font-semibold">Reason:</span> {getRejectionReasonLabel(item.cancel_reason)}
              </div>
            )}
            {item.recommended_supervisors && item.recommended_supervisors.length > 0 && (
              <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                <Lightbulb className="h-3 w-3 mr-1" />
                {item.recommended_supervisors.length} supervisor(s) recommended
              </Badge>
            )}
          </>
        ),
      };
    
    case 'offer':
      return {
        person: item.academician,
        fallbackInitials: 'SV',
        borderColor: 'border-green-200',
        bgColor: 'bg-green-50',
        avatarBgColor: 'bg-green-100',
        avatarTextColor: 'text-green-700',
        content: (
          <>
            <div className="flex items-center gap-2 mb-1">
              <div className="font-semibold text-slate-900">
                {item.academician?.full_name || 'Supervisor'}
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Offer Available
              </Badge>
            </div>
            <div className="text-sm text-slate-700 mb-1">
              {item.academician?.department && (
                <div>{item.academician.department}</div>
              )}
            </div>
            <div className="text-xs text-slate-600">
              Proposal: <span className="font-medium">{item.proposal_title}</span>
            </div>
            {item.offer_details?.cohort_start_term && (
              <div className="text-xs text-slate-600 mt-1">
                Starting: {item.offer_details.cohort_start_term}
              </div>
            )}
          </>
        ),
      };
    
    case 'acceptance':
      return {
        person: item.student,
        fallbackInitials: 'ST',
        borderColor: 'border-green-200',
        bgColor: 'bg-green-50',
        avatarBgColor: 'bg-green-100',
        avatarTextColor: 'text-green-700',
        content: (
          <>
            <div className="font-semibold text-slate-900 mb-1">
              {item.student?.full_name || 'Student'}
            </div>
            <div className="text-sm text-slate-700">
              Research: <span className="font-medium">{item.proposal_title}</span>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-200 mt-2">
              ✓ Supervision Active
            </Badge>
          </>
        ),
      };
    
    case 'declined':
      return {
        person: item.student,
        fallbackInitials: 'ST',
        borderColor: 'border-slate-200',
        bgColor: 'bg-slate-50',
        avatarBgColor: 'bg-slate-100',
        avatarTextColor: 'text-slate-700',
        content: (
          <>
            <div className="font-semibold text-slate-900 mb-1">
              {item.student?.full_name || 'Student'}
            </div>
            <div className="text-sm text-slate-700">
              Research: <span className="font-medium">{item.proposal_title}</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              The student may have accepted another supervisor's offer
            </div>
          </>
        ),
      };
    
    default:
      return {
        person: null,
        fallbackInitials: 'N/A',
        borderColor: 'border-slate-200',
        bgColor: 'bg-slate-50',
        avatarBgColor: 'bg-slate-100',
        avatarTextColor: 'text-slate-700',
        content: <div>Unknown notification type</div>,
      };
  }
}

