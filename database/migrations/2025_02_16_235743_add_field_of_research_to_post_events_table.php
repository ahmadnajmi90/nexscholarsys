<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('post_events', function (Blueprint $table) {
            $table->json('field_of_research')->nullable()->after('country');
        });
    }

    public function down()
    {
        Schema::table('post_events', function (Blueprint $table) {
            $table->dropColumn('field_of_research');
        });
    }

};
