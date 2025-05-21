<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Role;
use Database\Factories\BadgeFactory as FactoriesBadgeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

/**
 * Classe représentant un badge
 */
class Badge extends Model
{
    use HasFactory, Notifiable;
    /**
     * La table associée au modèle.
     * @var string
     */
    protected $table = 'badge';

    protected $fillable = [
        'title',
        'description',
        'imagePath',
        'teacher_id',
        'activated'
    ];

    /**
     * Relation entre le badge et les utilisateurs
     * 
     * @return BelongsToMany les utilisateurs possédant le badge
     */
    public function users()
    {
        return $this->belongsToMany('App\Models\User', 'user_badge', 'badge_id', 'user_id');
    }

    /**
     * Définit le pourcentage de possession du badge
     */
    public function setPossessionPercentage()
    {
        $totalUsers = User::all()->where('role_id', '=', Role::Student()->id)->count();
        $this->possession = $totalUsers == 0 ? 0 : $this->users->count() / $totalUsers * 100;
        unset($this->users);
    }

    /**
     * Relation entre le badge et ses catégories
     * 
     * @return BelongsToMany les catégories du badge
     */
    public function categories()
    {
        return $this->belongsToMany('App\Models\Category', 'category_badge', 'badge_id', 'category_id');
    }

    /**
     * Créer une nouvelle instance à la factory
     */
    protected static function newFactory()
    {
        return FactoriesBadgeFactory::new();
    }
}
