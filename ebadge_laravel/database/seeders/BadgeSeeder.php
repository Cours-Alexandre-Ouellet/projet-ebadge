<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Class BadgeSeeder
 *
 * Seeder pour insérer des badges par défaut dans la base de données.
 *
 * Les données de ce fichier ont été générées automatiquement avec ChatGPT.
 * Source : https://chat.openai.com/
 */
class BadgeSeeder extends Seeder
{
    public function run(): void
    {  

        DB::table('badge')->insert([
            [
                'title' => 'Super Apprenant',
                'description' => 'Attribué aux élèves ayant complété 10 cours.',
                'imagePath' => 'https://www.cartoonbrew.com/wp-content/uploads/2024/07/shrek5.jpg',
                'teacher_id' => 2, 
                'created_at' => now(),
                'updated_at' => now(),
                'activated' => 1,
            ],
            [
                'title' => 'Maître de la Programmation',
                'description' => 'Décerné aux élèves ayant complété un projet en programmation.',
                'imagePath' => null,
                'teacher_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
                'activated' => 1,
            ],
            [
                'title' => 'Esprit d\'équipe',
                'description' => 'Pour les élèves qui ont collaboré sur au moins 3 projets de groupe.',
                'imagePath' => null,
                'teacher_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
                'activated' => 1,
            ],
            [
                'title' => 'Innovateur en Herbe',
                'description' => 'Attribué aux élèves ayant proposé une idée innovante.',
                'imagePath' => null,
                'teacher_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
                'activated' => 1,
            ],
            [
                'title' => 'Excellence Académique',
                'description' => 'Attribué aux élèves avec une moyenne supérieure à 90%.',
                'imagePath' => null,
                'teacher_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
                'activated' => 1,
            ],
            [
                'title' => 'Résolveur de Problèmes',
                'description' => 'Pour ceux ayant résolu plus de 50 exercices de mathématiques.',
                'imagePath' => null,
                'teacher_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
                'activated' => 1,
            ],
            [
                'title' => 'Passionné d\'Apprentissage',
                'description' => 'Attribué aux élèves qui suivent des cours extrascolaires.',
                'imagePath' => null,
                'teacher_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
                'activated' => 1,
            ],
            [
                'title' => 'Conférencier Junior',
                'description' => 'Pour ceux ayant présenté un projet en classe.',
                'imagePath' => null,
                'teacher_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
                'activated' => 1,
            ],
            [
                'title' => 'Expert en Numérique',
                'description' => 'Attribué aux élèves ayant maîtrisé un logiciel ou un langage.',
                'imagePath' => null,
                'teacher_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
                'activated' => 1,
            ],
            [
                'title' => 'Leader de Classe',
                'description' => 'Pour ceux ayant organisé une activité scolaire.',
                'imagePath' =>null,
                'teacher_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
                'activated' => 1,
            ],
        ]);
    }
}
