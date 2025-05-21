<?php

namespace App\Models;

use Database\Factories\RoleFactory as FactoriesRoleFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

/**
 * Classe représentant un role
 * Les roles sont : Administrateur, Étudiant, Enseignant
 */
class Role extends Model
{
    use HasFactory, Notifiable;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'role';

    public const ADMIN = "Administrateur";
    public const ETUDIANT = "Étudiant";
    public const ENSEIGNANT = "Enseignant";
    public const ADMIN_CONTACT = "Contact Administrateur";
    
    public const ALL_ADMINS = self::ADMIN . "," . self::ADMIN_CONTACT;
    
    /**
     * Va chercher le role Administrateur pour avoir son id
     * @return Role
     */
    public static function Admin()
    {
        return Role::where('name', self::ADMIN)->first();
    }
    
    /**
     * Va chercher le role Contact Administrateur pour avoir son id
     * @return Role
     */
    public static function AdminContact()
    {
        return Role::where('name', self::ADMIN_CONTACT)->first();
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

    /**
     * Créer une nouvelle instance à la factory
     */
    protected static function newFactory()
    {
        return FactoriesRoleFactory::new();
    }

}
