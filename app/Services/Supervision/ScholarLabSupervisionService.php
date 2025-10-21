<?php

namespace App\Services\Supervision;

use App\Models\SupervisionRelationship;
use App\Models\Academician;
use App\Models\Postgraduate;
use App\Models\Workspace;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\Task;
use Illuminate\Support\Facades\DB;

class ScholarLabSupervisionService
{
    public function createSupervisionWorkspace(SupervisionRelationship $relationship, Postgraduate $student, Academician $academician, array $data): void
    {
        DB::transaction(function () use ($relationship, $student, $academician, $data) {
            $workspace = Workspace::create([
                'name' => $student->full_name . ' Supervision',
                'description' => __('Supervision workspace for :student', ['student' => $student->full_name]),
                'owner_id' => $academician->user->id,
            ]);

            $workspace->members()->attach($academician->user->id, ['role' => 'admin']);
            $workspace->members()->attach($student->user->id, ['role' => 'member']);

            $board = $workspace->boards()->create([
                'name' => __('Supervision Board'),
                'creator_id' => $academician->user->id,
            ]);

            $board->members()->syncWithoutDetaching([
                $academician->user->id,
                $student->user->id,
            ]);

            $lists = collect([
                __('Onboarding'),
                __('Meetings & Actions'),
                __('Research Milestones'),
            ])->map(function ($name, $index) use ($board) {
                return BoardList::create([
                    'board_id' => $board->id,
                    'name' => $name,
                    'order' => $index + 1,
                ]);
            });

            // Create tasks from onboarding checklist items
            $checklistItems = $relationship->onboardingChecklistItems;

            if ($checklistItems->isNotEmpty()) {
                foreach ($checklistItems as $index => $item) {
                    $task = Task::create([
                        'board_list_id' => $lists[0]->id, // Onboarding list
                        'title' => $item->task,
                        'description' => null,
                        'creator_id' => $academician->user->id,
                        'order' => $index + 1,
                    ]);

                    $task->assignees()->sync([
                        $student->user->id,
                    ]);
                }
            } else {
                // Fallback: Create default task if no checklist items exist
                $task = Task::create([
                    'board_list_id' => $lists[0]->id,
                    'title' => __('Complete onboarding checklist'),
                    'description' => __('Review program requirements, complete paperwork, and align expectations.'),
                    'creator_id' => $academician->user->id,
                    'order' => 1,
                ]);

                $task->assignees()->sync([
                    $student->user->id,
                ]);
            }

            $relationship->update([
                'scholarlab_workspace_id' => $workspace->id,
                'scholarlab_board_id' => $board->id,
            ]);
        });
    }
}

