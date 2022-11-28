<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user';

    public function role()
    {
        return $this->role;
    }

    public function badges()
    {
        return $this->belongsToMany('App\Models\Badge', 'user_badge', 'user_id', 'badge_id');
    }
}
