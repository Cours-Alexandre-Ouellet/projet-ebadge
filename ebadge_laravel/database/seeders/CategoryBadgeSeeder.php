<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoryBadgeSeeder extends Seeder
{

    public function run(): void
    {
        DB::table('category_badge')->insert([
            [
                'idBadge' => 1,
                'idCategory' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'idBadge' => 2,
                'idCategory' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'idBadge' => 3,
                'idCategory' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'idBadge' => 4,
                'idCategory' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'idBadge' => 5,
                'idCategory' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }
}
