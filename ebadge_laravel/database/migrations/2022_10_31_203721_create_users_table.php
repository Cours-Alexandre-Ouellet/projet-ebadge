<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration pour la création de la table user
 */
class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 50);
            $table->string('last_name', 50);
            $table->string('username', 50)->unique();
            $table->string('email', 125)->unique();
            $table->string('password', 60);
            $table->string('salt', 60);
            $table->foreignId('role_id')->constrained('role');
            $table->boolean('privacy')->default(0);
            $table->string('avatarImagePath', 2048)->nullable();
            $table->string('backgroundImagePath', 2048)->nullable();
            $table->foreignId('organisation_id')->constrained('organisation');
            $table->foreignId('program_id')->constrained('program');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user');
    }
}
