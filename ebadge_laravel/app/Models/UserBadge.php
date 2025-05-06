<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Badge;

/**
 * Classe du lien entre un utilisateur et un badge
 */
class UserBadge extends Model
{
    /**
     * La table associée avec le modèle.
     *
     * @var string
     */
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
}
