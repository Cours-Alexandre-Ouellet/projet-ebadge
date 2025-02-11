<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Classe représentant une catégorie
 */
class Category extends Model
{
    /**
     * La table associée avec le modèle.
     * @var string
     */
    protected $table = 'category';
    
    // Les attributs qui sont assignables au modèle.
    protected $fillable = [
        'name',
    ];

    /**
     * Relation entre la catégorie et ses badges
     * 
     * @return BelongsToMany les badges de la catégorie
     */
    public function badges()
    {
        return $this->belongsToMany('App\Models\Badge', 'badge_category', 'category_id', 'badge_id');
    }

    /**
     * Relation entre la catégorie et ses badges
     * 
     * @return BelongsToMany les catégories du badge
     */
    public function categories()
    {
        return $this->belongsToMany('App\Models\Category', 'badge_category', 'badge_id', 'category_id');
    }
}
