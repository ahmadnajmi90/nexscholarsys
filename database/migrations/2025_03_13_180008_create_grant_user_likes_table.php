<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGrantUserLikesTable extends Migration
{
    public function up()
    {
        Schema::create('grant_user_likes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('grant_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();

            // Set foreign keys (adjust table names/columns if needed)
            $table->foreign('grant_id')->references('id')->on('post_grants')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // Ensure a user can only like a post once.
            $table->unique(['grant_id', 'user_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('grant_user_likes');
    }
}
