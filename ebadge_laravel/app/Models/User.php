<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\HasApiTokens;
use App\Models\Role;

use Database\Factories\UserFactory as FactoriesUserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use App\Models\Badge;
use App\Models\UserBadge;

/**
 * Classe représentant un utilisateur
 */
class User extends Authenticatable
{
    use HasApiTokens; //Pour l'authentification par token
    use HasFactory, Notifiable;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user';

    public $timestamps = true;

    /**
     * Obtiens le nom du role de l'utilisateur
     *
     * @return string Le nom du role
     */
    public function getRoleName()
    {
        $role = Role::where('id', $this->role_id)->first();

        if ($role != null) {
            return $role->name;
        }
        return "";
    }

    /**
     * Détermine si l'utilisateur a un role donné
     *
     * @param string $role Le role à vérifier
     *
     * @return true si l'utilisateur a le role donné, false sinon
     */
    public function hasRole(string $role)
    {
        return $this->getRoleName() == $role;
    }

    /**
     * Relation entre l'utilisateur et ses badges reçus (étudiant)
     *
     * @return BelongsToMany les badges de l'utilisateur
     */
    public function badges()
    {
        return $this->belongsToMany('App\Models\Badge', 'user_badge', 'user_id', 'badge_id')->withTimestamps();
    }

    /**
     * Relation directe vers les enregistrements de la table pivot user_badge
     * (utile pour suppression)
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function userBadges()
    {
        return $this->hasMany(UserBadge::class, 'user_id');
    }

    /**
     * Relation vers les badges créés en tant que professeur (teacher_id)
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function createdBadges()
    {
        return $this->hasMany(Badge::class, 'teacher_id');
    }

    /**
     * Créer une nouvelle instance à la factory
     */
    protected static function newFactory()
    {
        return FactoriesUserFactory::new();
    }
}
