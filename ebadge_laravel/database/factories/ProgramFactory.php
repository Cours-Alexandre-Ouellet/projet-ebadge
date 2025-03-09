<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */


namespace Database\Factories;

use App\Models\Program;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProgramFactory extends Factory{


    protected $model = Program::class;

    /**
     * fonction qui génère des données aléatoire pour un programme
     * 
     * @author Vincent Houle
     * @return Program avec des données aléatoire
     */
    public function definition(): array
    {
        return [
            'name' => "Informatique",
            'created_at' => fake()->dateTimeBetween('-1 years', 'now'),
            'updated_at' => fake()->dateTimeBetween('-1 years', 'now'),
        ];
    }
}
