<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class InsertRoles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('Role')->insert([
            ['name' => 'Administrateur'],
            ['name' => 'Étudiant'],
            ['name' => 'Enseignant']
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('Role')->whereIn('name', ['Administrateur', 'Étudiant', 'Enseignant'])->delete();
    }
}
