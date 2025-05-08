<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\User;
use App\Models\Badge;

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


    public $timestamps = true;

    /**
     * Relation vers l'utilisateur
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relation vers le badge
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function badge()
    {
        return $this->belongsTo(Badge::class, 'badge_id');

    }
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
