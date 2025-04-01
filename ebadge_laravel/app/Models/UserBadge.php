<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Classe du lien entre un utilisateur et un badge
 */
class UserBadge extends Model
{
    /**
     * La table associée avec le modèle.
     *
     * @var string
     */
    protected $table = 'user_badge';

    public function definition(): array
    {
        return [
            'user_id' => $this->faker->numberBetween(1, 100),
            'badge_id' => $this->faker->numberBetween(1, 100),
            'favorite' => $this->facker->boolean(),
            'created_at' => $this->faker->dateTimeBetween('-1 years', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 years', 'now'),
        ];
    }
}
