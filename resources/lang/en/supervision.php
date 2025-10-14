<?php

return [
    // General messages
    'unauthorized' => 'You are not authorized to perform this action.',
    'not_found' => 'The requested resource was not found.',
    
    // Request messages
    'request' => [
        'not_student' => 'Only postgraduates can submit supervision requests.',
        'pending_limit' => 'You have reached the maximum of :limit pending requests. Please wait for responses or cancel existing requests.',
        'already_has_main' => 'You already have an active main supervisor.',
        'duplicate_request' => 'You already have a pending request to this academician.',
        'cancelled' => 'Only pending requests can be cancelled.',
        'cancel_permission' => 'You do not have permission to cancel this request.',
        'submitted' => 'Supervision request submitted successfully.',
        'already_responded' => 'This request has already been responded to.',
        'not_pending' => 'Only pending requests can be accepted or rejected.',
    ],
    
    // Decision messages
    'decision' => [
        'unauthorized_student' => 'Only the student can accept or reject an offer.',
        'unauthorized_supervisor' => 'Only the academician can accept or reject this request.',
        'not_pending_acceptance' => 'This offer is not pending student acceptance.',
        'accepted' => 'Supervision offer accepted successfully.',
        'rejected' => 'Supervision offer rejected successfully.',
        'request_accepted' => 'Supervision request accepted successfully.',
        'request_rejected' => 'Supervision request rejected successfully.',
    ],
    
    // Relationship messages
    'relationship' => [
        'student_has_main' => 'Student already has a main supervisor.',
        'not_active' => 'Cannot unbind a relationship that is not active.',
        'created' => 'Supervision relationship created successfully.',
        'not_found' => 'Supervision relationship not found.',
        'access_denied' => 'You do not have access to this supervision relationship.',
    ],
    
    // Unbind messages
    'unbind' => [
        'unauthorized' => 'You are not authorized to initiate an unbind request.',
        'cooldown' => 'You must wait until :date before initiating another unbind request.',
        'already_pending' => 'There is already a pending unbind request for this relationship.',
        'not_pending' => 'This unbind request is not pending.',
        'unauthorized_approve' => 'You are not authorized to approve this unbind request.',
        'unauthorized_reject' => 'You are not authorized to reject this unbind request.',
        'initiated' => 'Unbind request initiated successfully.',
        'approved' => 'Unbind request approved successfully.',
        'rejected' => 'Unbind request rejected successfully.',
        'force_unbind' => 'Maximum unbind attempts reached. Relationship terminated automatically.',
    ],
    
    // Co-supervisor messages
    'cosupervisor' => [
        'not_main' => 'Only the main supervisor can invite co-supervisors.',
        'relationship_not_active' => 'The supervision relationship must be active to invite co-supervisors.',
        'cannot_invite_self' => 'Cannot invite yourself as co-supervisor.',
        'max_limit' => 'Maximum number of co-supervisors (:limit) reached.',
        'already_supervisor' => 'This academician is already a supervisor for this student.',
        'pending_invitation' => 'There is already a pending invitation for this co-supervisor.',
        'unauthorized_respond' => 'You are not authorized to respond to this invitation.',
        'unauthorized_approve' => 'You are not authorized to approve this invitation.',
        'already_responded' => 'This invitation has already been responded to.',
        'must_accept_first' => 'Co-supervisor must accept before main supervisor can approve.',
        'invited' => 'Co-supervisor invitation sent successfully.',
        'accepted' => 'Co-supervisor invitation accepted successfully.',
        'rejected' => 'Co-supervisor invitation rejected successfully.',
        'approved' => 'Co-supervisor invitation approved successfully.',
        'cancelled' => 'Co-supervisor invitation cancelled successfully.',
        'removed' => 'Co-supervisor removed successfully.',
    ],
    
    // Meeting messages
    'meeting' => [
        'unauthorized' => 'You are not authorized to schedule meetings for this relationship.',
        'scheduled' => 'Meeting scheduled successfully.',
        'updated' => 'Meeting updated successfully.',
        'cancelled' => 'Meeting cancelled successfully.',
    ],
    
    // File upload messages
    'upload' => [
        'proposal_required' => 'A research proposal document is required.',
        'file_too_small' => 'The :attribute file is too small. Please upload a valid document.',
        'invalid_type' => 'The :attribute must be a :types file.',
        'too_large' => 'The :attribute file must not exceed :max.',
    ],
];

