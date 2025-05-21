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
                'badge_id' => 1,
                'category_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'badge_id' => 2,
                'category_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'badge_id' => 3,
                'category_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'badge_id' => 4,
                'category_id' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'badge_id' => 5,
                'category_id' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }
}
