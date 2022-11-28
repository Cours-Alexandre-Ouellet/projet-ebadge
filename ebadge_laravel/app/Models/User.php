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


    public function getRoleName()
    {
        $role = Role::where('id', $this->role_id)->first();

        if($role != null)
        {
            return $role->name;
        }
        return "";
    }

    public function hasRole($role)
    {
        return $this->getRoleName() == $role;
    }

    public function badges()
    {
        return $this->belongsToMany('App\Models\Badge', 'user_badge', 'user_id', 'badge_id');
    }
}
