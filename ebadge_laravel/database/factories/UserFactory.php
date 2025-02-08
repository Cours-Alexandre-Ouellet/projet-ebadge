<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

namespace Database\Factories;

use App\Models\Organisation;
use App\Models\Role;
use App\Models\Program;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected ?string $passwordEncrypt;
 

    protected $model = User::class;

    /**
     * fonction qui génère des données aléatoire pour un user
     * 
     * @author Vincent Houle
     * @return User avec des données aléatoire
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'username' => fake()->userName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->email(),
            'password' => Hash::make(fake()->password()),
            'role_id' => Role::factory(),
            'program_id' => Program::factory(),
            'organisation_id' => Organisation::factory(),
            'privacy' => 1,
            'created_at' => fake()->dateTimeBetween('-1 years', 'now'),
            'updated_at' => fake()->dateTimeBetween('-1 years', 'now'),
        ];
    }
}


