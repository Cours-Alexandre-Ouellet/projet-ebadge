<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Database\Factories\CategoryBadgeFactory as FactoriesCategoryBadgeFactory;

/**
 * Lien entre un utilisateur et un badge
 */
class CategoryBadge extends Model
{

    use HasFactory, Notifiable;

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
     * Créer une nouvelle instance à la factory
     */
    protected static function newFactory()
    {
        return FactoriesCategoryBadgeFactory::new();
    }


    public function category()
    {
        return $this->belongsTo(Category::class);
    }

}
