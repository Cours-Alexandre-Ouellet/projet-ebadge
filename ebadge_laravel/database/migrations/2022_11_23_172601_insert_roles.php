<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use App\Models\Role;
class InsertRoles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // DB::table('Role')->insert([
        //     ['name' => Role::ADMIN],
        //     ['name' => Role::ENSEIGNANT],
        //     ['name' => Role::ETUDIANT]
        // ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('Role')->whereIn('name', [Role::ADMIN, Role::ETUDIANT, Role::ENSEIGNANT])->delete();
    }
}
