<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatisticsToUploadablesTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Update posts table
        Schema::table('create-posts', function (Blueprint $table) {
            $table->unsignedBigInteger('total_views')->default(0);
            $table->unsignedBigInteger('total_likes')->default(0);
            $table->unsignedBigInteger('total_shares')->default(0);
        });

        // Update events table
        Schema::table('post_events', function (Blueprint $table) {
            $table->unsignedBigInteger('total_views')->default(0);
            $table->unsignedBigInteger('total_likes')->default(0);
            $table->unsignedBigInteger('total_shares')->default(0);
        });

        // Update projects table
        Schema::table('post_projects', function (Blueprint $table) {
            $table->unsignedBigInteger('total_views')->default(0);
            $table->unsignedBigInteger('total_likes')->default(0);
            $table->unsignedBigInteger('total_shares')->default(0);
        });

        // Update grants table
        Schema::table('post_grants', function (Blueprint $table) {
            $table->unsignedBigInteger('total_views')->default(0);
            $table->unsignedBigInteger('total_likes')->default(0);
            $table->unsignedBigInteger('total_shares')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Rollback changes in posts table
        Schema::table('create-posts', function (Blueprint $table) {
            $table->dropColumn(['total_views', 'total_likes', 'total_shares']);
        });

        // Rollback changes in events table
        Schema::table('post_events', function (Blueprint $table) {
            $table->dropColumn(['total_views', 'total_likes', 'total_shares']);
        });

        // Rollback changes in projects table
        Schema::table('post_projects', function (Blueprint $table) {
            $table->dropColumn(['total_views', 'total_likes', 'total_shares']);
        });

        // Rollback changes in grants table
        Schema::table('post_grants', function (Blueprint $table) {
            $table->dropColumn(['total_views', 'total_likes', 'total_shares']);
        });
    }
}
