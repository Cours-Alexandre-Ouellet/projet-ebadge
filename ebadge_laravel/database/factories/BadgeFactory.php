<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Model;
use Faker\Generator as Faker;

$factory->define(\App\Models\Badge::class, function (Faker $faker) {
    return [
        'title' => $faker->name(),
        'description' => $faker->text(),
        'imagePath' => $faker->imageUrl(),
        'color' => substr($faker->hexcolor(), 1),
        'created_at' => $faker->dateTimeBetween('-1 years', 'now'),
        'updated_at' => $faker->dateTimeBetween('-1 years', 'now'),
    ];
});
