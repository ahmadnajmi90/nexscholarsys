<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Skipping migration of existing skills data as it's dummy/test data
        // The old JSON skills columns will be removed in a separate migration
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No action needed since we didn't migrate any data
    }
};
