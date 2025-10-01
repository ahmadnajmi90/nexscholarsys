<?php

namespace App\Services\Supervision;

use App\Models\PotentialSupervisor;
use App\Models\Academician;
use App\Models\Postgraduate;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SupervisionShortlistService
{
    public function addToShortlist(Postgraduate $student, Academician $academician, ?int $programId = null): PotentialSupervisor
    {
        return DB::transaction(function () use ($student, $academician, $programId) {
            $existing = PotentialSupervisor::where('student_id', $student->postgraduate_id)
                ->where('academician_id', $academician->academician_id)
                ->first();

            if ($existing) {
                return $existing;
            }

            $count = PotentialSupervisor::where('student_id', $student->postgraduate_id)->count();
            if ($count >= 20) {
                throw ValidationException::withMessages([
                    'academician_id' => __('You have reached the maximum number of potential supervisors.'),
                ]);
            }

            return PotentialSupervisor::create([
                'student_id' => $student->postgraduate_id,
                'academician_id' => $academician->academician_id,
                'postgraduate_program_id' => $programId,
            ]);
        });
    }

    public function removeFromShortlist(Postgraduate $student, Academician $academician): void
    {
        PotentialSupervisor::where('student_id', $student->postgraduate_id)
            ->where('academician_id', $academician->academician_id)
            ->delete();
    }
}

