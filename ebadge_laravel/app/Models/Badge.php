<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Role;
/**
 * Classe représentant un badge
 */
class Badge extends Model
{
    /**
     * La table associée au modèle.
     * @var string
     */
    protected $table = 'badge';

    protected $fillable = [
        'title',
        'description',
        'imagePath',
        'color',
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
        return $this->belongsToMany('App\Models\Category', 'category_badge', 'badge_id', 'category_id');
    }
}
