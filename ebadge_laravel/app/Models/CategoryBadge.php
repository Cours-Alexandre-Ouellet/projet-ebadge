<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Lien entre un utilisateur et un badge
 */
class CategoryBadge extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */

    protected $table = 'category_badge';

    protected $fillable = [
        'badge_id',
        'category_id'
    ];

    public function definition(): array
    {
        return [
            'badge_id' => $this->faker->numberBetween(1, 100),
            'category_id' => $this->faker->numberBetween(1, 100),
        ];
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
