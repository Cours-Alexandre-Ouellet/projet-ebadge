<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorieBadgeSeeder extends Seeder
{

    public function run(): void
    {
        DB::table('categorie_badge')->insert([
            [
                'idBadge' => 1,
                'idCategorie' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'idBadge' => 2,
                'idCategorie' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'idBadge' => 3,
                'idCategorie' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'idBadge' => 4,
                'idCategorie' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'idBadge' => 5,
                'idCategorie' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }
}
