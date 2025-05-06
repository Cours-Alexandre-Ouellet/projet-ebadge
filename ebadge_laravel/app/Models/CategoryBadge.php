<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Lien entre un utilisateur et un badge
 */
class CategoryBadge extends Model
{
    /**
     * La table associée au modèle.
     *
     * @var string
     */

    protected $table = 'category_badge';

    /**
     * Les attributs qui peuvent être assignés en masse.
     * 
     * @var array
     */
    protected $fillable = [
        'badge_id',
        'category_id'
    ];

    /**
     * Définition de la relation entre le badge et la catégorie pour faker.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function definition(): array
    {
        return [
            'badge_id' => $this->faker->numberBetween(1, 100),
            'category_id' => $this->faker->numberBetween(1, 100),
        ];
    }
}
