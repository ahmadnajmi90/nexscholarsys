# Critical Fixes - Implementation Guide

This guide shows **exactly** what code to write for the 6 critical issues.

---

## 🔴 Critical Fix #1: Create Authorization Policies

### Step 1: Create SupervisionPolicy

```bash
php artisan make:policy SupervisionPolicy --model=SupervisionRequest
```

**File:** `app/Policies/SupervisionPolicy.php`

```php
<?php

namespace App\Policies;

use App\Models\SupervisionRequest;
use App\Models\User;

class SupervisionPolicy
{
    /**
     * Determine if user can view the request
     */
    public function view(User $user, SupervisionRequest $request): bool
    {
        // Student who made the request or supervisor who received it
        return ($user->postgraduate && $user->postgraduate->postgraduate_id === $request->student_id)
            || ($user->academician && $user->academician->academician_id === $request->academician_id);
    }

    /**
     * Determine if user can cancel the request
     */
    public function cancel(User $user, SupervisionRequest $request): bool
    {
        // Only student who made the request
        return $user->postgraduate 
            && $user->postgraduate->postgraduate_id === $request->student_id
            && $request->status === SupervisionRequest::STATUS_PENDING;
    }

    /**
     * Determine if user can accept the request (send offer)
     */
    public function accept(User $user, SupervisionRequest $request): bool
    {
        // Only supervisor who received the request
        return $user->academician 
            && $user->academician->academician_id === $request->academician_id
            && $request->status === SupervisionRequest::STATUS_PENDING;
    }

    /**
     * Determine if user can reject the request
     */
    public function reject(User $user, SupervisionRequest $request): bool
    {
        // Only supervisor who received the request
        return $user->academician 
            && $user->academician->academician_id === $request->academician_id
            && $request->status === SupervisionRequest::STATUS_PENDING;
    }

    /**
     * Determine if user can accept the offer (student accepting supervisor's offer)
     */
    public function acceptOffer(User $user, SupervisionRequest $request): bool
    {
        // Only student who received the offer
        return $user->postgraduate 
            && $user->postgraduate->postgraduate_id === $request->student_id
            && $request->status === SupervisionRequest::STATUS_PENDING_STUDENT_ACCEPTANCE;
    }

    /**
     * Determine if user can reject the offer (student rejecting supervisor's offer)
     */
    public function rejectOffer(User $user, SupervisionRequest $request): bool
    {
        // Only student who received the offer
        return $user->postgraduate 
            && $user->postgraduate->postgraduate_id === $request->student_id
            && $request->status === SupervisionRequest::STATUS_PENDING_STUDENT_ACCEPTANCE;
    }
}
```

### Step 2: Create SupervisionRelationshipPolicy

```bash
php artisan make:policy SupervisionRelationshipPolicy --model=SupervisionRelationship
```

**File:** `app/Policies/SupervisionRelationshipPolicy.php`

```php
<?php

namespace App\Policies;

use App\Models\SupervisionRelationship;
use App\Models\User;

class SupervisionRelationshipPolicy
{
    /**
     * Determine if user can view the relationship
     */
    public function view(User $user, SupervisionRelationship $relationship): bool
    {
        return ($user->postgraduate && $user->postgraduate->postgraduate_id === $relationship->student_id)
            || ($user->academician && $user->academician->academician_id === $relationship->academician_id);
    }

    /**
     * Determine if user can initiate unbind
     */
    public function initiateUnbind(User $user, SupervisionRelationship $relationship): bool
    {
        // Both student and supervisor can initiate
        return $relationship->status === SupervisionRelationship::STATUS_ACTIVE
            && (
                ($user->postgraduate && $user->postgraduate->postgraduate_id === $relationship->student_id)
                || ($user->academician && $user->academician->academician_id === $relationship->academician_id)
            );
    }

    /**
     * Determine if user can invite co-supervisor
     */
    public function inviteCoSupervisor(User $user, SupervisionRelationship $relationship): bool
    {
        // Only main supervisor or student can invite
        return $relationship->status === SupervisionRelationship::STATUS_ACTIVE
            && $relationship->role === SupervisionRelationship::ROLE_MAIN
            && (
                ($user->postgraduate && $user->postgraduate->postgraduate_id === $relationship->student_id)
                || ($user->academician && $user->academician->academician_id === $relationship->academician_id)
            );
    }

    /**
     * Determine if user can schedule meeting
     */
    public function scheduleMeeting(User $user, SupervisionRelationship $relationship): bool
    {
        // Both parties can schedule
        return $relationship->status === SupervisionRelationship::STATUS_ACTIVE
            && (
                ($user->postgraduate && $user->postgraduate->postgraduate_id === $relationship->student_id)
                || ($user->academician && $user->academician->academician_id === $relationship->academician_id)
            );
    }
}
```

### Step 3: Register Policies

**File:** `app/Providers/AuthServiceProvider.php`

```php
protected $policies = [
    // ... existing policies
    \App\Models\SupervisionRequest::class => \App\Policies\SupervisionPolicy::class,
    \App\Models\SupervisionRelationship::class => \App\Policies\SupervisionRelationshipPolicy::class,
];
```

### Step 4: Update Controllers to Use Policies

**File:** `app/Http/Controllers/Api/V1/Supervision/DecisionController.php`

```php
public function accept(Request $request, SupervisionRequest $supervisionRequest = null)
{
    if (!$supervisionRequest) {
        abort(404, 'Supervision request not found.');
    }
    
    // Replace manual checks with policy
    $this->authorize('accept', $supervisionRequest);

    $data = $request->validate([
        // ... validation rules
    ]);

    // ... rest of method
}

public function reject(Request $request, SupervisionRequest $supervisionRequest)
{
    $this->authorize('reject', $supervisionRequest);
    
    // ... rest of method
}

public function studentAccept(Request $request, SupervisionRequest $supervisionRequest)
{
    $this->authorize('acceptOffer', $supervisionRequest);
    
    // ... rest of method
}

public function studentReject(Request $request, SupervisionRequest $supervisionRequest)
{
    $this->authorize('rejectOffer', $supervisionRequest);
    
    // ... rest of method
}
```

**File:** `app/Http/Controllers/Api/V1/Supervision/RequestController.php`

```php
public function cancel(Request $request, $requestId)
{
    $supervisionRequest = SupervisionRequest::findOrFail($requestId);
    
    // Replace manual check with policy
    $this->authorize('cancel', $supervisionRequest);

    // ... rest of method (remove old if statements)
}
```

**File:** `app/Http/Controllers/Api/V1/Supervision/UnbindRequestController.php`

```php
public function initiate(Request $request, SupervisionRelationship $relationship)
{
    $this->authorize('initiateUnbind', $relationship);

    $data = $request->validate([
        'reason' => ['required', 'string', 'min:10', 'max:1000'],
    ]);

    // ... rest of method (remove manual auth checks)
}
```

---

## 🔴 Critical Fix #2: Fix Auto-Cancel Logic

**File:** `app/Services/Supervision/SupervisionRelationshipService.php`

### Change #1: Line 65-75 (acceptRequest method)

**Before:**
```php
SupervisionRequest::where('student_id', $student->postgraduate_id)
    ->where('status', SupervisionRequest::STATUS_PENDING)
    ->where('id', '!=', $request->id)
    ->each(function ($pending) {
        // ...
    });
```

**After:**
```php
SupervisionRequest::where('student_id', $student->postgraduate_id)
    ->whereIn('status', [
        SupervisionRequest::STATUS_PENDING,
        SupervisionRequest::STATUS_PENDING_STUDENT_ACCEPTANCE,
    ])
    ->where('id', '!=', $request->id)
    ->each(function ($pending) {
        $pending->update([
            'status' => SupervisionRequest::STATUS_AUTO_CANCELLED,
            'decision_at' => now(),
            'cancel_reason' => 'accepted_elsewhere',
        ]);
        // Note: Will fix notification in Critical Fix #4
        $pending->academician?->user?->notify(new SupervisionRequestAutoCancelled($pending));
    });
```

### Change #2: Line 165-175 (createRelationshipFromOffer method)

**Before:**
```php
SupervisionRequest::where('student_id', $student->postgraduate_id)
    ->where('status', SupervisionRequest::STATUS_PENDING)
    ->where('id', '!=', $request->id)
    ->each(function ($pending) {
        // ...
    });
```

**After:**
```php
SupervisionRequest::where('student_id', $student->postgraduate_id)
    ->whereIn('status', [
        SupervisionRequest::STATUS_PENDING,
        SupervisionRequest::STATUS_PENDING_STUDENT_ACCEPTANCE,
    ])
    ->where('id', '!=', $request->id)
    ->each(function ($pending) {
        $pending->update([
            'status' => SupervisionRequest::STATUS_AUTO_CANCELLED,
            'decision_at' => now(),
            'cancel_reason' => 'accepted_elsewhere',
        ]);
        $pending->academician?->user?->notify(new SupervisionRequestAutoCancelled($pending));
    });
```

---

## 🔴 Critical Fix #3: Fix Request Count Validation

**File:** `app/Services/Supervision/SupervisionRequestService.php`

### Change: Line 27-36

**Before:**
```php
$pendingCount = SupervisionRequest::where('student_id', $student->postgraduate_id)
    ->whereIn('status', [
        SupervisionRequest::STATUS_PENDING,
        SupervisionRequest::STATUS_ACCEPTED,  // ❌ WRONG!
    ])->count();

if ($pendingCount >= 5) {
    throw ValidationException::withMessages([
        'academician_id' => __('You can only have up to five active supervision requests.'),
    ]);
}
```

**After:**
```php
$pendingCount = SupervisionRequest::where('student_id', $student->postgraduate_id)
    ->whereIn('status', [
        SupervisionRequest::STATUS_PENDING,
        SupervisionRequest::STATUS_PENDING_STUDENT_ACCEPTANCE,
    ])->count();

if ($pendingCount >= 5) {
    throw ValidationException::withMessages([
        'academician_id' => __('You can only have up to five pending supervision requests.'),
    ]);
}
```

---

## 🔴 Critical Fix #4: Create Form Request Classes

### Step 1: Create Request Files

```bash
php artisan make:request Supervision/AcceptSupervisionRequestRequest
php artisan make:request Supervision/SubmitSupervisionRequestRequest
php artisan make:request Supervision/InitiateUnbindRequest
```

### AcceptSupervisionRequestRequest

**File:** `app/Http/Requests/Supervision/AcceptSupervisionRequestRequest.php`

```php
<?php

namespace App\Http\Requests\Supervision;

use Illuminate\Foundation\Http\FormRequest;

class AcceptSupervisionRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('accept', $this->route('supervisionRequest'));
    }

    public function rules(): array
    {
        return [
            'cohort_start_term' => ['required', 'string', 'max:255'],
            'supervision_role' => ['required', 'in:main_supervisor,co_supervisor'],
            'meeting_cadence' => ['required', 'string', 'max:255'],
            'welcome_message' => ['nullable', 'string', 'max:1000'],
            'create_scholarlab' => ['nullable', 'boolean'],
            'onboarding_checklist' => ['nullable', 'array'],
            'onboarding_checklist.*.task' => ['required', 'string'],
            'onboarding_checklist.*.completed' => ['boolean'],
        ];
    }
}
```

### SubmitSupervisionRequestRequest

**File:** `app/Http/Requests/Supervision/SubmitSupervisionRequestRequest.php`

```php
<?php

namespace App\Http\Requests\Supervision;

use Illuminate\Foundation\Http\FormRequest;

class SubmitSupervisionRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->postgraduate !== null;
    }

    public function rules(): array
    {
        return [
            'academician_id' => ['required', 'string', 'exists:academicians,academician_id'],
            'postgraduate_program_id' => ['nullable', 'exists:postgraduate_programs,id'],
            'proposal_title' => ['required', 'string', 'max:255'],
            'motivation' => ['required', 'string', 'min:50', 'max:5000'],
            'attachments.proposal' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'attachments.transcript' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
            'attachments.background' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'attachments.portfolio' => ['nullable', 'file', 'max:10240'],
        ];
    }

    public function messages(): array
    {
        return [
            'motivation.min' => 'Please provide at least 50 characters explaining your motivation.',
            'attachments.proposal.required' => 'Research proposal document is required.',
        ];
    }
}
```

### Step 2: Update Controllers

**File:** `app/Http/Controllers/Api/V1/Supervision/DecisionController.php`

```php
use App\Http\Requests\Supervision\AcceptSupervisionRequestRequest;

public function accept(AcceptSupervisionRequestRequest $request, SupervisionRequest $supervisionRequest = null)
{
    // No need for authorize() - already in FormRequest
    // No need for validate() - already in FormRequest
    
    $data = $request->validated();

    // Store offer details
    $supervisionRequest->update([
        'status' => SupervisionRequest::STATUS_PENDING_STUDENT_ACCEPTANCE,
        'welcome_message' => $data['welcome_message'] ?? null,
        'offer_details' => [
            'cohort_start_term' => $data['cohort_start_term'],
            'supervision_role' => $data['supervision_role'] === 'main_supervisor' ? 'main' : 'co',
            'meeting_cadence' => $data['meeting_cadence'],
            'create_scholarlab' => $data['create_scholarlab'] ?? false,
            'onboarding_checklist' => $data['onboarding_checklist'] ?? [],
        ],
    ]);

    // ... rest of method
}
```

**File:** `app/Http/Controllers/Api/V1/Supervision/RequestController.php`

```php
use App\Http\Requests\Supervision\SubmitSupervisionRequestRequest;

public function store(SubmitSupervisionRequestRequest $request)
{
    $data = $request->validated();
    $student = $request->user()->postgraduate;
    $academician = Academician::where('academician_id', $data['academician_id'])->firstOrFail();

    $supervisionRequest = $this->requestService->submitRequest($student, $academician, $data);

    return new SupervisionRequestResource($supervisionRequest->load(['attachments', 'academician.user']));
}
```

---

## 🔴 Critical Fix #5: Fix Permission Checks

**File:** `app/Http/Controllers/Api/V1/Supervision/CoSupervisorController.php`

### Change #1: Lines 34-40

**Before:**
```php
if ($relationship->student->postgraduate_id === $user->unique_id) {
    $initiatedBy = 'student';
} elseif ($relationship->academician->academician_id === $user->unique_id) {
    $initiatedBy = 'main_supervisor';
} else {
    return response()->json(['message' => 'Unauthorized'], 403);
}
```

**After:**
```php
if ($user->postgraduate && $relationship->student_id === $user->postgraduate->postgraduate_id) {
    $initiatedBy = 'student';
} elseif ($user->academician && $relationship->academician_id === $user->academician->academician_id) {
    $initiatedBy = 'main_supervisor';
} else {
    return response()->json(['message' => 'Unauthorized'], 403);
}
```

### Change #2: Line 74

**Before:**
```php
if ($invitation->cosupervisor->academician_id !== $user->unique_id) {
```

**After:**
```php
if (!$user->academician || $invitation->cosupervisor->academician_id !== $user->academician->academician_id) {
```

### Change #3: Lines 120-124

**Before:**
```php
if ($invitation->initiated_by === 'student' && $relationship->academician->academician_id === $user->unique_id) {
    $isApprover = true;
} elseif ($invitation->initiated_by === 'main_supervisor' && $relationship->student->postgraduate_id === $user->unique_id) {
    $isApprover = true;
}
```

**After:**
```php
if ($invitation->initiated_by === 'student' && $user->academician && $relationship->academician_id === $user->academician->academician_id) {
    $isApprover = true;
} elseif ($invitation->initiated_by === 'main_supervisor' && $user->postgraduate && $relationship->student_id === $user->postgraduate->postgraduate_id) {
    $isApprover = true;
}
```

### Apply same pattern to all other occurrences (lines 167, 169, 199, 223-224, 255, 257, 313)

---

## 🔴 Critical Fix #6: Transaction Error Handling

**File:** `app/Services/Supervision/SupervisionRelationshipService.php`

### Change: Lines 113-191 (createRelationshipFromOffer method)

**Before:**
```php
public function createRelationshipFromOffer(SupervisionRequest $request, array $offerDetails): SupervisionRelationship
{
    return DB::transaction(function () use ($request, $offerDetails) {
        // ... create relationship
        // ... update request
        // ... auto-cancel others
        // ... ensure connection
        
        if (!empty($offerDetails['create_scholarlab'])) {
            $this->scholarLabService->createSupervisionWorkspace($relationship, $student, $academician, $offerDetails);
        }

        $student->user?->notify(new SupervisionRequestAccepted($relationship));
        $academician->user?->notify(new StudentAcceptedOffer($relationship));

        return $relationship;
    });
}
```

**After:**
```php
public function createRelationshipFromOffer(SupervisionRequest $request, array $offerDetails): SupervisionRelationship
{
    $relationship = DB::transaction(function () use ($request, $offerDetails) {
        $student = Postgraduate::where('postgraduate_id', $request->student_id)->firstOrFail();
        $academician = Academician::where('academician_id', $request->academician_id)->firstOrFail();

        $role = $offerDetails['supervision_role'] ?? SupervisionRelationship::ROLE_MAIN;
        
        $existingMain = SupervisionRelationship::where('student_id', $student->postgraduate_id)
            ->where('role', SupervisionRelationship::ROLE_MAIN)
            ->where('status', SupervisionRelationship::STATUS_ACTIVE)
            ->first();

        if ($role === SupervisionRelationship::ROLE_MAIN && $existingMain) {
            throw ValidationException::withMessages([
                'role' => __('Student already has a main supervisor'),
            ]);
        }

        $relationship = SupervisionRelationship::create([
            'student_id' => $student->postgraduate_id,
            'academician_id' => $academician->academician_id,
            'role' => $role,
            'status' => SupervisionRelationship::STATUS_ACTIVE,
            'start_date' => now()->toDateString(),
            'cohort' => $offerDetails['cohort_start_term'] ?? null,
            'meeting_cadence' => $offerDetails['meeting_cadence'] ?? null,
            'conversation_id' => $request->conversation_id,
            'accepted_at' => now(),
        ]);

        if (!empty($offerDetails['onboarding_checklist'])) {
            foreach ($offerDetails['onboarding_checklist'] as $index => $item) {
                \App\Models\SupervisionOnboardingChecklistItem::create([
                    'supervision_relationship_id' => $relationship->id,
                    'task' => $item['task'],
                    'completed' => false,
                    'order' => $index,
                ]);
            }
        }

        $request->update([
            'status' => SupervisionRequest::STATUS_ACCEPTED,
            'decision_at' => now(),
        ]);

        SupervisionRequest::where('student_id', $student->postgraduate_id)
            ->whereIn('status', [
                SupervisionRequest::STATUS_PENDING,
                SupervisionRequest::STATUS_PENDING_STUDENT_ACCEPTANCE,
            ])
            ->where('id', '!=', $request->id)
            ->each(function ($pending) {
                $pending->update([
                    'status' => SupervisionRequest::STATUS_AUTO_CANCELLED,
                    'decision_at' => now(),
                    'cancel_reason' => 'accepted_elsewhere',
                ]);
                $pending->academician?->user?->notify(new SupervisionRequestAutoCancelled($pending));
            });

        $this->ensureConnection($student->user->id, $academician->user->id);

        return $relationship;
    });

    // Handle ScholarLab creation outside transaction
    if (!empty($offerDetails['create_scholarlab'])) {
        try {
            $student = $relationship->student;
            $academician = $relationship->academician;
            $this->scholarLabService->createSupervisionWorkspace($relationship, $student, $academician, $offerDetails);
        } catch (\Exception $e) {
            \Log::error('ScholarLab creation failed but relationship created successfully', [
                'relationship_id' => $relationship->id,
                'error' => $e->getMessage(),
            ]);
            // Could queue a job to retry ScholarLab creation
            // dispatch(new CreateScholarLabWorkspace($relationship, $offerDetails));
        }
    }

    // Send notifications
    $relationship->student->user?->notify(new SupervisionRequestAccepted($relationship));
    $relationship->academician->user?->notify(new StudentAcceptedOffer($relationship));

    return $relationship;
}
```

---

## ✅ Verification Checklist

After implementing all fixes:

- [ ] All policies created and registered
- [ ] All controllers use `$this->authorize()`
- [ ] All FormRequest classes created
- [ ] Controllers use FormRequest instead of inline validation
- [ ] Auto-cancel includes `pending_student_acceptance` status
- [ ] Request count validation uses correct statuses
- [ ] All `$user->unique_id` replaced with proper IDs
- [ ] ScholarLab creation moved outside transaction
- [ ] Run tests: `php artisan test`
- [ ] Check linter: `php artisan pint` or `./vendor/bin/phpstan`
- [ ] Test manually with Postman/frontend

---

## 🧪 Testing the Fixes

### Test Policy Fix
```php
// Test in Tinker
$user = User::find(1);
$request = SupervisionRequest::find(1);
Gate::allows('accept', [$request]); // Should return true/false based on user
```

### Test Auto-Cancel Fix
```php
// Create 2 pending requests for a student
// Accept one
// Verify the other is auto-cancelled with correct status
```

### Test Request Count Fix
```php
// Create 5 pending requests
// Try to create 6th - should fail
// Accept one request
// Should be able to create new request now
```

---

**Next:** After implementing these 6 critical fixes, move to high-priority fixes in the checklist.

