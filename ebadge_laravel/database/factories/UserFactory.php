<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Organisation;
use App\Models\Program;
use App\Models\Role;
use Faker\Generator as Faker;
use Illuminate\Support\Facades\Hash;

$factory->define(\App\Models\User::class, function (Faker $faker) {
    $passwordEncrypt = Hash::make('password');
    return [
        'first_name' => $faker->firstName(),
        'username' => $faker->userName(),
        'last_name' => $faker->lastName(),
        'email' => $faker->email(),
        'password' => $passwordEncrypt,
        'role_id' => Role::factory()->create()->id,
        'program_id' => Program::factory()->create()->id,
        'organisation_id' => Organisation::factory()->create()->id,
        'privacy' => 1,
    ];
});

