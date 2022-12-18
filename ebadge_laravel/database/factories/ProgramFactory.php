<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Organisation;
use Faker\Generator as Faker;
use App\Models\Role;
use App\Models\Program;
use Illuminate\Support\Facades\Hash;

$factory->define(\App\Models\Program::class, function (Faker $faker) {
    return [
        'name' => "Informatique",
        'created_at' => $faker->dateTimeBetween('-1 years', 'now'),
        'updated_at' => $faker->dateTimeBetween('-1 years', 'now'),
    ];
});
