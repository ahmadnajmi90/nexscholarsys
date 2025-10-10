# Test Data Setup Guide

Guide for setting up and managing test data for supervision feature testing.

---

## Existing Test Accounts

These accounts already exist in your system:

**Student Account:**
- Email: yitkhee0117@gmail.com
- Password: password
- Role: Postgraduate
- Has: 2 supervisors in potential supervisor list

**Supervisor Accounts:**
1. Email: ahmadnajmi.an@utm.my
   - Password: password
   - Role: Academician
   - Status: Accepting students

2. Email: seahcs@utm.my
   - Password: password
   - Role: Academician
   - Status: Accepting students

---

## Create New Test Users

If you need to create additional test users, use the TestUserSeeder:

```bash
# Run the test user seeder
php artisan db:seed --class=TestUserSeeder
```

Or manually via Tinker:

```bash
php artisan tinker
```

### Create Test Student

```php
// Create user account
$user = User::create([
    'name' => 'Test Student',
    'email' => 'teststudent@test.com',
    'password' => Hash::make('password'),
    'unique_id' => 'TST' . now()->timestamp,
    'is_profile_complete' => true,
    'agreed_to_terms' => true,
    'has_seen_tutorial' => true,
    'email_verified_at' => now(),
]);

// Create postgraduate profile
$postgrad = Postgraduate::create([
    'postgraduate_id' => $user->unique_id,
    'unique_id' => $user->unique_id,
    'full_name' => 'Test Student',
    'email' => 'teststudent@test.com',
    'university' => 'Universiti Teknologi Malaysia',
    'current_postgraduate_status' => 'Current PhD Student',
]);

// Assign role
$user->assign('postgraduate');

// Create motivation (so they bypass "Why Nexscholar" page)
UserMotivation::create([
    'user_id' => $user->id,
    'main_reason' => 'research',
    'features_interested' => ['ai_matching', 'supervision'],
]);

echo "Student created: {$user->email}";
```

### Create Test Supervisor

```php
// Create user account
$user = User::create([
    'name' => 'Test Supervisor',
    'email' => 'testsupervisor@test.com',
    'password' => Hash::make('password'),
    'unique_id' => 'TSV' . now()->timestamp,
    'is_profile_complete' => true,
    'agreed_to_terms' => true,
    'has_seen_tutorial' => true,
    'email_verified_at' => now(),
]);

// Create academician profile
$academician = Academician::create([
    'academician_id' => $user->unique_id,
    'unique_id' => $user->unique_id,
    'full_name' => 'Test Supervisor',
    'email' => 'testsupervisor@test.com',
    'current_position' => 'Senior Lecturer',
    'university' => 'Universiti Teknologi Malaysia',
    'department' => 'Computer Science',
    'availability_as_supervisor' => true,
]);

// Assign role
$user->assign('academician');

// Create motivation
UserMotivation::create([
    'user_id' => $user->id,
    'main_reason' => 'mentorship',
    'features_interested' => ['supervision', 'networking'],
]);

echo "Supervisor created: {$user->email}";
```

---

## Add Supervisors to Student's Potential List

To add supervisors to a student's potential supervisor list:

```php
php artisan tinker
```

```php
// Get student
$student = User::where('email', 'yitkhee0117@gmail.com')->first()->postgraduate;

// Get supervisors
$supervisor1 = Academician::where('email', 'ahmadnajmi.an@utm.my')->first();
$supervisor2 = Academician::where('email', 'seahcs@utm.my')->first();

// Add to potential supervisor list (assuming there's a relationship or pivot table)
// The exact method depends on your implementation
// Example if using potential_supervisor_list table:
DB::table('potential_supervisor_list')->insert([
    ['postgraduate_id' => $student->postgraduate_id, 'academician_id' => $supervisor1->academician_id, 'created_at' => now(), 'updated_at' => now()],
    ['postgraduate_id' => $student->postgraduate_id, 'academician_id' => $supervisor2->academician_id, 'created_at' => now(), 'updated_at' => now()],
]);

// Or if using a method:
$student->potentialSupervisors()->attach([$supervisor1->academician_id, $supervisor2->academician_id]);

echo "Supervisors added to potential list";
```

---

## Create Specific Test States

### Create Pending Request

```php
$student = Postgraduate::where('email', 'yitkhee0117@gmail.com')->first();
$supervisor = Academician::where('email', 'ahmadnajmi.an@utm.my')->first();

$request = SupervisionRequest::create([
    'student_id' => $student->postgraduate_id,
    'academician_id' => $supervisor->academician_id,
    'proposal_title' => 'Test Research Proposal',
    'motivation' => 'This is a test motivation for automated testing purposes.',
    'status' => 'pending',
    'created_at' => now(),
    'updated_at' => now(),
]);

echo "Pending request created: ID {$request->id}";
```

### Create Accepted Request (Offer Sent)

```php
$request = SupervisionRequest::find([request_id]); // Use actual request ID

$request->update([
    'status' => 'accepted',
    'offer_role' => 'main',
    'offer_start_date' => now()->addDays(30),
    'offer_cohort' => 'Fall 2025',
    'offer_meeting_cadence' => 'Weekly',
    'offer_message' => 'I am pleased to accept your supervision request.',
    'responded_at' => now(),
]);

echo "Offer sent for request ID {$request->id}";
```

### Create Active Relationship

```php
$student = Postgraduate::where('email', 'yitkhee0117@gmail.com')->first();
$supervisor = Academician::where('email', 'ahmadnajmi.an@utm.my')->first();

// Assuming there's a request
$request = SupervisionRequest::where('student_id', $student->postgraduate_id)
    ->where('academician_id', $supervisor->academician_id)
    ->first();

$relationship = SupervisionRelationship::create([
    'request_id' => $request->id,
    'student_id' => $student->postgraduate_id,
    'academician_id' => $supervisor->academician_id,
    'role' => 'main',
    'status' => 'active',
    'start_date' => now(),
    'created_at' => now(),
    'updated_at' => now(),
]);

// Update request
$request->update(['status' => 'pending_student_acceptance']);

echo "Active relationship created: ID {$relationship->id}";
```

### Create Unbind Request (With Attempts)

```php
$relationship = SupervisionRelationship::find([relationship_id]); // Use actual ID

// First unbind attempt (rejected)
$unbind1 = SupervisionRelationshipUnbindRequest::create([
    'supervision_relationship_id' => $relationship->id,
    'initiator_type' => 'student',
    'initiator_id' => $relationship->student_id,
    'reason' => 'Research interests changed',
    'explanation' => 'Test unbind attempt 1',
    'status' => 'rejected',
    'rejection_reason' => 'Let us discuss this first',
    'attempt_number' => 1,
    'created_at' => now()->subDays(10),
    'updated_at' => now()->subDays(10),
    'responded_at' => now()->subDays(10),
]);

// Second unbind attempt (rejected)
$unbind2 = SupervisionRelationshipUnbindRequest::create([
    'supervision_relationship_id' => $relationship->id,
    'initiator_type' => 'student',
    'initiator_id' => $relationship->student_id,
    'reason' => 'Research interests changed',
    'explanation' => 'Test unbind attempt 2',
    'status' => 'rejected',
    'rejection_reason' => 'Still need more discussion',
    'attempt_number' => 2,
    'created_at' => now()->subDays(3),
    'updated_at' => now()->subDays(3),
    'responded_at' => now()->subDays(3),
]);

echo "Unbind attempts created for relationship ID {$relationship->id}";
```

---

## Reset Test Data

### Cancel All Pending Requests for a Student

```php
$student = User::where('email', 'yitkhee0117@gmail.com')->first()->postgraduate;

SupervisionRequest::where('student_id', $student->postgraduate_id)
    ->where('status', 'pending')
    ->update(['status' => 'cancelled', 'updated_at' => now()]);

echo "All pending requests cancelled";
```

### Terminate All Active Relationships

```php
$student = User::where('email', 'yitkhee0117@gmail.com')->first()->postgraduate;

SupervisionRelationship::where('student_id', $student->postgraduate_id)
    ->where('status', 'active')
    ->update(['status' => 'terminated', 'end_date' => now(), 'updated_at' => now()]);

echo "All active relationships terminated";
```

### Delete All Test Data for a Student

```php
$student = User::where('email', 'yitkhee0117@gmail.com')->first()->postgraduate;

// Delete relationships
SupervisionRelationship::where('student_id', $student->postgraduate_id)->delete();

// Delete requests
SupervisionRequest::where('student_id', $student->postgraduate_id)->delete();

// Delete meetings
SupervisionMeeting::whereHas('relationship', function($q) use ($student) {
    $q->where('student_id', $student->postgraduate_id);
})->delete();

echo "All test data deleted for student";
```

### Complete Database Reset

```bash
# WARNING: This will delete ALL data
php artisan migrate:fresh --seed
```

---

## Check Current Test Data State

### View Student's Current State

```php
$student = User::where('email', 'yitkhee0117@gmail.com')->first()->postgraduate;

// Pending requests
$pendingCount = SupervisionRequest::where('student_id', $student->postgraduate_id)
    ->where('status', 'pending')
    ->count();
echo "Pending requests: {$pendingCount}\n";

// Active relationships
$activeCount = SupervisionRelationship::where('student_id', $student->postgraduate_id)
    ->where('status', 'active')
    ->count();
echo "Active relationships: {$activeCount}\n";

// All requests
$requests = SupervisionRequest::where('student_id', $student->postgraduate_id)->get();
foreach($requests as $req) {
    echo "Request #{$req->id}: Status = {$req->status}\n";
}

// All relationships
$relationships = SupervisionRelationship::where('student_id', $student->postgraduate_id)->get();
foreach($relationships as $rel) {
    echo "Relationship #{$rel->id}: Status = {$rel->status}, Role = {$rel->role}\n";
}
```

### View Supervisor's Current State

```php
$supervisor = Academician::where('email', 'ahmadnajmi.an@utm.my')->first();

// Pending requests
$pendingRequests = SupervisionRequest::where('academician_id', $supervisor->academician_id)
    ->where('status', 'pending')
    ->count();
echo "Pending requests: {$pendingRequests}\n";

// Active students
$activeStudents = SupervisionRelationship::where('academician_id', $supervisor->academician_id)
    ->where('status', 'active')
    ->count();
echo "Active students: {$activeStudents}\n";
```

---

## Quick Setup Scripts

### Setup for Request Testing

```php
// Ensure student has no pending requests
$student = User::where('email', 'yitkhee0117@gmail.com')->first()->postgraduate;
SupervisionRequest::where('student_id', $student->postgraduate_id)
    ->where('status', 'pending')
    ->update(['status' => 'cancelled']);

echo "Ready for request testing";
```

### Setup for Relationship Testing

```php
// Create active relationship if none exists
$student = User::where('email', 'yitkhee0117@gmail.com')->first()->postgraduate;
$supervisor = Academician::where('email', 'ahmadnajmi.an@utm.my')->first();

$existing = SupervisionRelationship::where('student_id', $student->postgraduate_id)
    ->where('status', 'active')
    ->first();

if (!$existing) {
    // Create request first
    $request = SupervisionRequest::create([
        'student_id' => $student->postgraduate_id,
        'academician_id' => $supervisor->academician_id,
        'proposal_title' => 'Test Proposal',
        'motivation' => 'Test motivation',
        'status' => 'accepted',
    ]);
    
    // Create relationship
    $relationship = SupervisionRelationship::create([
        'request_id' => $request->id,
        'student_id' => $student->postgraduate_id,
        'academician_id' => $supervisor->academician_id,
        'role' => 'main',
        'status' => 'active',
        'start_date' => now(),
    ]);
    
    echo "Active relationship created: ID {$relationship->id}";
} else {
    echo "Active relationship already exists: ID {$existing->id}";
}
```

### Setup for Unbind Testing

```php
// Ensure relationship has 2 rejected unbind attempts
$relationship = SupervisionRelationship::where('student_id', $student->postgraduate_id)
    ->where('status', 'active')
    ->first();

if ($relationship) {
    // Clear existing unbind requests
    SupervisionRelationshipUnbindRequest::where('supervision_relationship_id', $relationship->id)
        ->delete();
    
    // Create 2 rejected attempts
    for ($i = 1; $i <= 2; $i++) {
        SupervisionRelationshipUnbindRequest::create([
            'supervision_relationship_id' => $relationship->id,
            'initiator_type' => 'student',
            'initiator_id' => $relationship->student_id,
            'reason' => 'Test reason',
            'explanation' => "Test attempt {$i}",
            'status' => 'rejected',
            'rejection_reason' => 'Test rejection',
            'attempt_number' => $i,
            'created_at' => now()->subDays(10 - ($i * 3)),
            'updated_at' => now()->subDays(10 - ($i * 3)),
            'responded_at' => now()->subDays(10 - ($i * 3)),
        ]);
    }
    
    echo "Ready for unbind testing (2 attempts already rejected)";
}
```

---

## Troubleshooting

### Issue: Can't login with test accounts
```php
// Reset password
$user = User::where('email', 'yitkhee0117@gmail.com')->first();
$user->password = Hash::make('password');
$user->save();
echo "Password reset to 'password'";
```

### Issue: Student has too many pending requests
```php
// Cancel all but 2
$student = User::where('email', 'yitkhee0117@gmail.com')->first()->postgraduate;
$requests = SupervisionRequest::where('student_id', $student->postgraduate_id)
    ->where('status', 'pending')
    ->get();

$requests->skip(2)->each(function($req) {
    $req->update(['status' => 'cancelled']);
});
echo "Cancelled excess pending requests";
```

### Issue: Student redirected to "Why Nexscholar" page
```php
// Add motivation
$user = User::where('email', 'yitkhee0117@gmail.com')->first();
UserMotivation::updateOrCreate(
    ['user_id' => $user->id],
    ['main_reason' => 'research', 'features_interested' => ['supervision']]
);
echo "Motivation added";
```

---

## Daily Testing Routine

**Before Testing:**
1. Check current state
2. Reset if needed
3. Setup specific test scenario

**After Testing:**
1. Document any data issues
2. Reset for next test session
3. Keep 1-2 clean test accounts for quick testing

**Weekly:**
1. Full database refresh
2. Run TestUserSeeder
3. Verify all test accounts working

