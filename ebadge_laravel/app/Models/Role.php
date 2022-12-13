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

    public const ADMIN = "Administrateur";
    public const ETUDIANT = "Étudiant";
    public const ENSEIGNANT = "Enseignant";

    public static function Admin()
    {
        return Role::where('name', self::ADMIN)->first();
    }

    public static function Teacher()
    {
        return Role::where('name', self::ENSEIGNANT)->first();
    }

    public static function Student()
    {
        return Role::where('name', self::ETUDIANT)->first();
    }
}
