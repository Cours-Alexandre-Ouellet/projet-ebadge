<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use Faker\Generator as Faker;

$factory->define(\App\Models\Program::class, function (Faker $faker) {
    return [
        'name' => "Informatique",
        'created_at' => $faker->dateTimeBetween('-1 years', 'now'),
        'updated_at' => $faker->dateTimeBetween('-1 years', 'now'),
    ];
});
