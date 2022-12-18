<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Classe représentant un role
 * Les roles sont : Administrateur, Étudiant, Enseignant
 */
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

    /**
     * Va chercher le role Administrateur pour avoir son id
     * @return Role
     */
    public static function Admin()
    {
        return Role::where('name', self::ADMIN)->first();
    }

    /**
     * Va chercher le role Enseignant pour avoir son id
     * @return Role
     */
    public static function Teacher()
    {
        return Role::where('name', self::ENSEIGNANT)->first();
    }

    /**
     * Va chercher le role Étudiant pour avoir son id
     *
     * @return Role
     */
    public static function Student()
    {
        return Role::where('name', self::ETUDIANT)->first();
    }


}
