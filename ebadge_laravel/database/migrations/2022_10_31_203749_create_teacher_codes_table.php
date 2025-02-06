<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration pour la création de la table teacher_code
 */
class CreateTeacherCodesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('teacher_code', function (Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->foreignId('user_id')->nullable()->constrained('user');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('teacher_codes');
    }
}
