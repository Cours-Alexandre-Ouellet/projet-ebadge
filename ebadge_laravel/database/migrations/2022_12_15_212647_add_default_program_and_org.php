<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Organisation;
use App\Models\Program;
use Illuminate\Support\Facades\DB;

class AddDefaultProgramAndOrg extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('organisation', function (Blueprint $table) {
            DB::statement('SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";');
        });

        $org = new Organisation();
        $org->id = 0;
        $org->name = "Organisation par défaut";
        $org->save();


        Schema::table('program', function (Blueprint $table) {
            DB::statement('SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";');
        });

        $program = new Program();
        $program->id = 0;
        $program->name = "Programme par défaut";
        $program->save();
    }

    public function down()
    {

        $program = Program::where('name', 'Programme par défaut')->first();
        $program->delete();

        $org = Organisation::where('name', 'Organisation par défaut')->first();
        $org->delete();
    }
}
