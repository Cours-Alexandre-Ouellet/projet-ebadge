<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Lien entre un utilisateur et un badge
 */
class UserBadge extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user_badge';

    public function definition(): array
    {
        return [
            'user_id' => $this->faker->numberBetween(1, 100),
            'badge_id' => $this->faker->numberBetween(1, 100),
            'created_at' => $this->faker->dateTimeBetween('-1 years', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 years', 'now'),
        ];
    }
}
