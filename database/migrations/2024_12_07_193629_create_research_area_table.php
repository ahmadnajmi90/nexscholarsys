<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateResearchAreaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('research_area', function (Blueprint $table) {
            $table->id(); // Auto-increment ID
            $table->string('name'); // Name of the research area
            $table->foreignId('field_of_research_id') // Foreign key to Field of Research table
                  ->constrained('field_of_research')
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
        Schema::dropIfExists('research_area');
    }
}
