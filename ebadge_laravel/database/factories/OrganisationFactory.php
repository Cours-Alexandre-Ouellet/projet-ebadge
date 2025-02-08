<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

namespace Database\Factories;

use App\Models\Organisation;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrganisationFactory extends Factory{


    protected $model = Organisation::class;

    /**
     * fonction qui génère des données aléatoire pour un organisation
     * 
     * @author Vincent Houle
     * @return Organisation avec des données aléatoire
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'created_at' => fake()->dateTimeBetween('-1 years', 'now'),
            'updated_at' => fake()->dateTimeBetween('-1 years', 'now'),
        ];
    }
}

