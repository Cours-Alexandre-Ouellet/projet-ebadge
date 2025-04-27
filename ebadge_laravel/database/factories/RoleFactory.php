<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

namespace Database\Factories;

use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;


class RoleFactory extends Factory
{
    
    protected $model = Role::class;

    /**
     * fonction qui génère des données aléatoire pour un role
     * 
     * @author Vincent Houle
     * @return Role avec des données aléatoire
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement([Role::ETUDIANT, Role::ENSEIGNANT, Role::ADMIN, Role::ADMIN_CONTACT]),
            'created_at' => fake()->dateTimeBetween('-1 years', 'now'),
            'updated_at' => fake()->dateTimeBetween('-1 years', 'now'),
        ];
    }
}

