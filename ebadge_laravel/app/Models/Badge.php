<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Role;

class Badge extends Model
{
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
        $this->possession = $users->count() / $totalUsers * 100;
    }
}
