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
        Schema::dropIfExists('click_trackings');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This is a destructive migration, so we can't easily reverse it.
        // If you need to restore the table, use the original migration.
        Schema::create('click_trackings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('entity_type'); // E.g., 'grant', 'project', 'event'
            $table->unsignedBigInteger('entity_id'); // ID of the clicked entity
            $table->string('action'); // E.g., 'click', 'view', 'like'
            $table->timestamp('created_at')->useCurrent(); // When the action occurred
        });
    }
};
