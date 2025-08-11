<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImportPhDProgramsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // admin via middleware
    }

    public function rules(): array
    {
        return [
            'file' => 'required|file|mimes:xlsx,csv,txt',
        ];
    }
}

