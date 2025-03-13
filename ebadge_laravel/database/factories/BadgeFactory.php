<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

namespace Database\Factories;

use App\Models\Badge;
use Illuminate\Database\Eloquent\Factories\Factory;

class BadgeFactory extends Factory{
    

    protected $model = Badge::class;

    /**
     * fonction qui génère des données aléatoire pour un Badge
     * 
     * @author Vincent Houle
     * @return Badge avec des données aléatoire
     */    
    public function definition(): array
    {
        return [
            'title' => fake()->name(),
            'description' => fake()->text(),
            'imagePath' => fake()->imageUrl(),
            'created_at' => fake()->dateTimeBetween('-1 years', 'now'),
            'updated_at' => fake()->dateTimeBetween('-1 years', 'now'),
        ];
    }
}

