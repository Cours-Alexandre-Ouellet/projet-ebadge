<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Classe représentant une catégorie
 */
class Categorie extends Model
{
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
}
