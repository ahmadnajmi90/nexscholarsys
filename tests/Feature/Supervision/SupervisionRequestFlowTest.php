<?php

namespace Tests\Feature\Supervision;

use App\Models\Academician;
use App\Models\SupervisionRequest;
use App\Models\SupervisionRelationship;
use App\Models\User;
use App\Models\Postgraduate;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class SupervisionRequestFlowTest extends TestCase
{
    public function test_student_can_submit_request_and_conversation_created(): void
    {
        Notification::fake();

        $studentUser = User::factory()->create();
        $student = Postgraduate::factory()->create([
            'postgraduate_id' => $studentUser->unique_id ?? $studentUser->id,
        ]);

        $supervisorUser = User::factory()->create();
        $academician = Academician::factory()->create([
            'academician_id' => $supervisorUser->id,
            'user_id' => $supervisorUser->id,
        ]);

        $this->actingAs($studentUser);

        $response = $this->postJson(route('api.app.supervision.requests.store'), [
            'academician_id' => $academician->academician_id,
            'proposal_title' => 'Research on AI',
            'motivation' => 'I would like to collaborate on AI research.',
        ]);

        $response->assertCreated();

        $request = SupervisionRequest::first();
        $this->assertNotNull($request);
        $this->assertNotNull($request->conversation_id);
    }

    public function test_supervisor_can_accept_request(): void
    {
        Notification::fake();

        $studentUser = User::factory()->create();
        $student = Postgraduate::factory()->create([
            'postgraduate_id' => $studentUser->unique_id ?? $studentUser->id,
        ]);

        $supervisorUser = User::factory()->create();
        $academician = Academician::factory()->create([
            'academician_id' => $supervisorUser->id,
            'user_id' => $supervisorUser->id,
        ]);

        $request = SupervisionRequest::factory()->create([
            'student_id' => $student->postgraduate_id,
            'academician_id' => $academician->academician_id,
        ]);

        $this->actingAs($supervisorUser);

        $response = $this->postJson(route('api.app.supervision.requests.accept', $request), [
            'role' => SupervisionRelationship::ROLE_MAIN,
            'meeting_cadence' => 'Weekly',
        ]);

        $response->assertOk();

        $relationship = SupervisionRelationship::first();
        $this->assertNotNull($relationship);
        $this->assertEquals(SupervisionRelationship::STATUS_ACTIVE, $relationship->status);
    }
}

