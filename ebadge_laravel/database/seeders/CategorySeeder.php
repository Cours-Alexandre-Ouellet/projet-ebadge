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
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Participation',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Excellence',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Engagement',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Créativité',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
