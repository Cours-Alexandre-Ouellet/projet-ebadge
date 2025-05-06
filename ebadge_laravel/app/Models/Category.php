<?php

namespace App\Models;

use Database\Factories\CategoryFactory as FactoriesCategoryFactory;
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
     * La table associée avec le modèle.
     * @var string
     */
    protected $table = 'category';
    
    // Les attributs qui sont assignables au modèle.
    protected $fillable = [
        'name',
        'color',
    ];

    /**
     * Relation entre la catégorie et ses badges
     * 
     * @return BelongsToMany les badges de la catégorie
     */
    public function badges()
    {
        return $this->belongsToMany('App\Models\Badge', 'category_badge', 'category_id', 'badge_id');
    }

    /**
     * Créer une nouvelle instance à la factory
     */
    protected static function newFactory()
    {
        return FactoriesCategoryFactory::new();

    }
}
