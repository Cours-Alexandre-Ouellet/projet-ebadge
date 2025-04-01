<?php

use App\Models\Role;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
/**
 * Migration pour la création de la table role
 */
class CreateRolesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('role', function (Blueprint $table) {
            $table->id();
            $table->string('name', 45);
            $table->timestamps();
        });

        // Insertion des rôles
        DB::table('role')->insert([
            ['name' => Role::ADMIN],
            ['name' => Role::ADMIN_CONTACT],
            ['name' => Role::ENSEIGNANT],
            ['name' => Role::ETUDIANT],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('role');
    }
}
