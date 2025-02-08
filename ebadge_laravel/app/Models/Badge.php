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
     * The table associated with the model.
     * @var string
     */
    protected $table = 'badge';

    protected $fillable = [
        'title',
        'description',
        'imagePath',
        'color',
    ];

    public function users()
    {
        return $this->belongsToMany('App\Models\User', 'user_badge', 'badge_id', 'user_id');
    }

    public function setPossessionPercentage()
    {
        $users = $this->users;
        $totalUsers = User::all()->where('role_id', '=', Role::Student()->id)->count();
        $this->possession = $totalUsers == 0 ? 0 : $users->count() / $totalUsers * 100;
    }

    /**
     * Relation entre le badge et ses catégories
     * 
     * @return BelongsToMany les catégories du badge
     */
    public function categories()
    {
        return $this->belongsToMany('App\Models\Categorie', 'categorie_badge', 'idBadge', 'idCategorie');
    }

    /**
     * Créer une nouvelle instance à la factory
     */
    protected static function newFactory()
    {
        return FactoriesBadgeFactory::new();
    }
}
