<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Class CategorySeeder
 *
 * Seeder pour insérer des catégories de badges par défaut dans la base de données.
 *
 * Les données de ce fichier ont été générées automatiquement avec ChatGPT.
 * Source : https://chat.openai.com/
 */
class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('category')->insert([
            [
                'name' => 'Apprentissage',
                'color' => '#FF5733',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Participation',
                'color' => '#33FF57',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Excellence',
                'color' => '#3357FF',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Engagement',
                'color' => '#FF33A1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Créativité',
                'color' => '#A133FF',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
