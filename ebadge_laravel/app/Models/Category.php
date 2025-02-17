<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

/**
 * Classe représentant une catégorie
 */
class Category extends Model
{
    use HasFactory, Notifiable;

    /**
     * The table associated with the model.
     * @var string
     */
    protected $table = 'categorie';

    protected $fillable = [
        'nom',
    ];

    public function badges()
    {
        return $this->belongsToMany('App\Models\Badge', 'badge_categorie', 'categorie_id', 'badge_id');
    }

    /**
     * Relation entre la catégorie et ses badges
     * 
     * @return BelongsToMany les catégories du badge
     */
    public function categories()
    {
        return $this->belongsToMany('App\Models\Category', 'badge_categorie', 'badge_id', 'categorie_id');
    }

    /**
     * Créer une nouvelle instance à la factory
     */
    protected static function newFactory()
    {
        return CategoryBadge::new();
    }
}
