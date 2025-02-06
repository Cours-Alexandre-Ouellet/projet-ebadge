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
                'nom' => 'Apprentissage',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Participation',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Excellence',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Engagement',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Créativité',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
