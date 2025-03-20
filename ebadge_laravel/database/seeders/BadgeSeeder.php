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
                'imagePath' => 'badges/super_apprenant.png',
                'teacher_id' => 2, 
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Maître de la Programmation',
                'description' => 'Décerné aux élèves ayant complété un projet en programmation.',
                'imagePath' => 'badges/maitre_prog.png',
                'teacher_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Esprit d\'équipe',
                'description' => 'Pour les élèves qui ont collaboré sur au moins 3 projets de groupe.',
                'imagePath' => 'badges/esprit_equipe.png',
                'teacher_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Innovateur en Herbe',
                'description' => 'Attribué aux élèves ayant proposé une idée innovante.',
                'imagePath' => 'badges/innovateur_herbe.png',
                'teacher_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Excellence Académique',
                'description' => 'Attribué aux élèves avec une moyenne supérieure à 90%.',
                'imagePath' => 'badges/excellence.png',
                'teacher_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Résolveur de Problèmes',
                'description' => 'Pour ceux ayant résolu plus de 50 exercices de mathématiques.',
                'imagePath' => 'badges/resolveur_problemes.png',
                'teacher_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Passionné d\'Apprentissage',
                'description' => 'Attribué aux élèves qui suivent des cours extrascolaires.',
                'imagePath' => 'badges/passionne_apprentissage.png',
                'teacher_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Conférencier Junior',
                'description' => 'Pour ceux ayant présenté un projet en classe.',
                'imagePath' => 'badges/conferencier.png',
                'teacher_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Expert en Numérique',
                'description' => 'Attribué aux élèves ayant maîtrisé un logiciel ou un langage.',
                'imagePath' => 'badges/expert_numerique.png',
                'teacher_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Leader de Classe',
                'description' => 'Pour ceux ayant organisé une activité scolaire.',
                'imagePath' => 'badges/leader_classe.png',
                'teacher_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
