<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Lien entre un utilisateur et un badge
 */
class CategorieBadge extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'CategorieBadge';

    public function definition(): array
    {
        return [
            'idBadge' => $this->faker->numberBetween(1, 100),
            'idCategorie' => $this->faker->numberBetween(1, 100),
        ];
    }
}
