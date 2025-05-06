<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

use Database\Factories\UserBadgeFactory as FactoriesUserBadgeFactory;


/**
 * Classe du lien entre un utilisateur et un badge
 */
class UserBadge extends Model
{

    use HasApiTokens; //Pour l'authentification par token
    use HasFactory, Notifiable;


    protected $table = 'user_badge';


    protected $fillable = [
        'user_id',
        'badge_id',
        'favorite',
    ];

    /**
     * Créer une nouvelle instance à la factory
     */
    protected static function newFactory()
    {
        return FactoriesUserBadgeFactory::new();
    }
}
