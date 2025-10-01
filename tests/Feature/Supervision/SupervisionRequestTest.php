<?php

namespace Tests\Feature\Supervision;

use App\Models\SupervisionRequest;
use App\Models\User;
use App\Models\Postgraduate;
use App\Models\Academician;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SupervisionRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_cannot_exceed_request_limit(): void
    {
        $user = User::factory()->create();
        $postgrad = Postgraduate::factory()->create(['postgraduate_id' => 'PG-1', 'postgraduate_id' => 'PG-1']);
        $user->postgraduate()->save($postgrad);

        SupervisionRequest::factory()->count(5)->create([
            'student_id' => $postgrad->postgraduate_id,
        ]);

        $this->actingAs($user)
            ->postJson(route('api.app.supervision.requests.store'), [
                'academician_id' => 'AC-1',
                'proposal_title' => 'Test',
                'motivation' => 'Motivation text',
            ])->assertStatus(422);
    }
}

