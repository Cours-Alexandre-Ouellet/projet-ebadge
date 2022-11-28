<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'role';

    public static function Admin()
    {
        return Role::where('name', 'administrateur')->first();
    }

    public static function Teacher()
    {
        return Role::where('name', 'enseignant')->first();
    }

    public static function Student()
    {
        return Role::where('name', 'étudiant')->first();
    }
}
