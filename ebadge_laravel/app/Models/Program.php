<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Classe représentant un programme
 * Par exemple : un programme de techniques en informatique
 */
class Program extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'program';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
    ];

    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word,
            'created_at' => $this->faker->dateTimeBetween('-1 years', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 years', 'now'),
        ];

    }
}
