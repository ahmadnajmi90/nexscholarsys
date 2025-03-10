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
        Schema::table('post_events', function (Blueprint $table) {
            $table->string('url')->nullable()->after('event_name');
        });

        Schema::table('post_grants', function (Blueprint $table) {
            $table->string('url')->nullable()->after('title');
        });

        Schema::table('post_projects', function (Blueprint $table) {
            $table->string('url')->nullable()->after('title');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('post_events', function (Blueprint $table) {
            $table->dropColumn('url');
        });

        Schema::table('post_grants', function (Blueprint $table) {
            $table->dropColumn('url');
        });

        Schema::table('post_projects', function (Blueprint $table) {
            $table->dropColumn('url');
        });
    }
};
