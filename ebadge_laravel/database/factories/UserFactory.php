<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Organisation;
use Faker\Generator as Faker;
use App\Models\Role;
use App\Models\Program;
use Illuminate\Support\Facades\Hash;

$factory->define(\App\Models\User::class, function (Faker $faker) {

    $passwordEncrypt = Hash::make('password');
    return [
        'first_name' => $faker->firstName(),
        'username' => $faker->userName(),
        'salt' => $faker->randomNumber(8),
        'last_name' => $faker->lastName(),
        'email' => $faker->email(),
        'password' => $passwordEncrypt,
        'role_id' => Factory(\App\Models\Role::class)->create()->id,
        'program_id' => Factory(\App\Models\Program::class)->create()->id,
        'organisation_id' => Factory(\App\Models\Organisation::class)->create()->id,
        'privacy' => 1,
        'created_at' => $faker->dateTimeBetween('-1 years', 'now'),
        'updated_at' => $faker->dateTimeBetween('-1 years', 'now'),
    ];
});
