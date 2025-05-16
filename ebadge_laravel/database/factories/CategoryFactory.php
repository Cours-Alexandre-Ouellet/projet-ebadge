<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory{
    

    protected $model = Category::class;

    /**
     * Fonction qui génère des données aléatoire pour une catégorie
     * 
     * @author Vincent Houle
     * @return Category avec des données aléatoires
     */    
    public function definition(): array
    {
        return [ 
            "name" => fake()->streetName(),
            "color" => fake()->hexColor(),
            'created_at' => fake()->dateTimeBetween('-1 years', 'now'),
            'updated_at' => fake()->dateTimeBetween('-1 years', 'now')
        ];
    }
}
