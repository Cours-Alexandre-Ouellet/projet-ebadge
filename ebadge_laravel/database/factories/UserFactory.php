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
            'username' => fake()->unique()->userName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->unique()->email(),
            'password' => Hash::make(fake()->password()),
            'role_id' => 1,
            'program_id' => 0,
            'organisation_id' => 0,
            'privacy' => 1
        ];
    }
}


