<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNicheDomainTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('niche_domain', function (Blueprint $table) {
            $table->id(); // Auto-increment ID
            $table->string('name'); // Name of the niche domain
            $table->foreignId('research_area_id') // Foreign key to Research Area table
                  ->constrained('research_area')
                  ->onDelete('cascade');
            $table->timestamps(); // Created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('niche_domain');
    }
}
