<?php

use App\Models\UserBadge;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table((new UserBadge)->getTable(), function (Blueprint $table) {
            $table->boolean('is_new')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table((new UserBadge)->getTable(), function (Blueprint $table) {
            $table->dropColumn('is_new');
        });
    }
};